#!/usr/bin/env bash
# Emite 12 certs de teste cobrindo a matriz de variantes (FM 7.7.1/7.7.2,
# selos, com/sem anexo, granel, alcool) e baixa os PDFs gerados para
# comparacao visual contra os templates oficiais FAMBRAS em
# C:\HalalSphere\@TEMPLATE DO CERTIFICADO.2026.
#
# Pre-requisitos:
#   - jq (instalado no Git Bash do Windows)
#   - curl
#   - env vars: HALALSPHERE_EMAIL e HALALSPHERE_PASSWORD do usuario TEST-emitter
#
# Saidas em ./output/CASE-NN.pdf + summary.csv

set -euo pipefail

API="${HALALSPHERE_API_URL:-https://gestaodecertificacoes-api.ecohalal.solutions}"
EMAIL="${HALALSPHERE_EMAIL:?HALALSPHERE_EMAIL nao definido}"
PASSWORD="${HALALSPHERE_PASSWORD:?HALALSPHERE_PASSWORD nao definido}"
OUT_DIR="$(dirname "$0")/output"
CASES_FILE="$(dirname "$0")/cases.json"

mkdir -p "$OUT_DIR"
echo "API=$API"
echo "EMAIL=$EMAIL"
echo

# ============== Login ==============
echo "[1/4] Login..."
LOGIN_RESP=$(curl -sX POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
TOKEN=$(echo "$LOGIN_RESP" | jq -r '.token // empty')
if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "ERRO no login. Resposta:"
  echo "$LOGIN_RESP"
  exit 1
fi
echo "Token obtido (${#TOKEN} chars)"
echo

# ============== Descobrir Plant BRF ==============
echo "[2/4] Procurando planta BRF..."
PLANT_ID=$(curl -s "$API/companies?search=BRF&take=20" \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.data[] | select(.legalName | test("BRF"; "i")) | .id' | head -1)

if [ -z "$PLANT_ID" ]; then
  echo "BRF nao encontrada via /companies?search=BRF. Listando primeiras 5 empresas:"
  curl -s "$API/companies?take=5" -H "Authorization: Bearer $TOKEN" | jq -r '.data[] | "\(.id) | \(.legalName)"'
  exit 1
fi

COMPANY_ID="$PLANT_ID"
echo "Company BRF: $COMPANY_ID"

PLANT_ID=$(curl -s "$API/plants?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.[]? | .id' | head -1 || true)

if [ -z "$PLANT_ID" ] || [ "$PLANT_ID" = "null" ]; then
  echo "Nenhuma planta encontrada para BRF. Tentando /plants direto:"
  PLANT_ID=$(curl -s "$API/plants" -H "Authorization: Bearer $TOKEN" \
    | jq -r ".[]? | select(.companyId == \"$COMPANY_ID\") | .id" | head -1)
fi
if [ -z "$PLANT_ID" ] || [ "$PLANT_ID" = "null" ]; then
  echo "ERRO: BRF sem planta cadastrada."
  exit 1
fi
echo "Plant BRF: $PLANT_ID"
echo

# ============== Descobrir IndustrialCategory IDs ==============
echo "[3/4] Mapeando IndustrialCategory codes -> ids..."
CAT_JSON=$(curl -s "$API/industrial-classification/groups-with-relations" \
  -H "Authorization: Bearer $TOKEN")

map_cat_id() {
  local code="$1"
  echo "$CAT_JSON" | jq -r --arg code "$code" '
    [.[] | .categories[]? | select(.code == $code) | .id] | .[0] // empty'
}

CIV_ID=$(map_cat_id "CIV")
CV_ID=$(map_cat_id "CV")
K_ID=$(map_cat_id "K")
echo "  CIV: $CIV_ID"
echo "  CV : $CV_ID"
echo "  K  : $K_ID"
if [ -z "$CIV_ID" ] || [ -z "$CV_ID" ] || [ -z "$K_ID" ]; then
  echo "ERRO: faltando categoria. Lista bruta:"
  echo "$CAT_JSON" | jq -r '.[] | .categories[]? | "\(.code) -> \(.id)"' | head -30
  exit 1
fi
echo

# ============== Emitir 12 certs ==============
echo "[4/4] Emitindo 12 certs..."
TIMESTAMP=$(date +%s)
SUMMARY="$OUT_DIR/summary.csv"
echo "case,certificateNumber,formCode,template,httpStatus,pdfPath,error" > "$SUMMARY"

emit_case() {
  local id="$1"
  local desc="$2"
  local cat_codes_csv="$3"      # ex "CIV" ou "CV"
  local standards_csv="$4"      # ex "GSO" ou "GSO,UAE"
  local cert_type="$5"
  local products_count="$6"
  local is_granel="$7"
  local is_alcool="$8"

  # Resolve cat ids
  local cat_ids="["
  local first=1
  IFS=',' read -ra CATS <<< "$cat_codes_csv"
  for c in "${CATS[@]}"; do
    local cid
    case "$c" in
      CIV) cid="$CIV_ID" ;;
      CV)  cid="$CV_ID" ;;
      K)   cid="$K_ID" ;;
      *) echo "Codigo $c nao mapeado"; exit 1 ;;
    esac
    if [ $first -eq 1 ]; then first=0; else cat_ids+=","; fi
    cat_ids+="\"$cid\""
  done
  cat_ids+="]"

  # Standards array JSON
  local stds_json="["
  first=1
  IFS=',' read -ra STDS <<< "$standards_csv"
  for s in "${STDS[@]}"; do
    if [ $first -eq 1 ]; then first=0; else stds_json+=","; fi
    stds_json+="\"$s\""
  done
  stds_json+="]"

  # Products
  local products_json="["
  for ((i=1; i<=products_count; i++)); do
    if [ $i -gt 1 ]; then products_json+=","; fi
    products_json+="{\"name\":\"PRODUTO TESTE $i\",\"packingSize\":\"Caixa 1kg\",\"brandNames\":[\"MARCA TESTE\"]}"
  done
  products_json+="]"

  local cert_num="TEST-${id}-${TIMESTAMP}"
  local issued
  issued=$(date +%Y-%m-%d)
  local expires
  expires=$(date -d "+3 years" +%Y-%m-%d 2>/dev/null || date -v+3y +%Y-%m-%d)

  local payload
  payload=$(cat <<EOF
{
  "plantId": "$PLANT_ID",
  "industrialCategoryIds": $cat_ids,
  "certificateNumber": "$cert_num",
  "issuedAt": "$issued",
  "expiresAt": "$expires",
  "certificateType": "$cert_type",
  "certificationType": "produto",
  "applicableStandards": $stds_json,
  "countryVariant": "BR",
  "isGranel": $is_granel,
  "isAlcool": $is_alcool,
  "brandNames": ["MARCA TESTE"],
  "products": $products_json
}
EOF
)

  echo "$payload" > "$OUT_DIR/${id}-payload.json"

  local resp http_code body pdf_url filename
  resp=$(curl -sw "\nHTTP_CODE:%{http_code}" -X POST "$API/certificates/manual-emit" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$payload")
  http_code=$(echo "$resp" | grep -oE 'HTTP_CODE:[0-9]+' | cut -d: -f2)
  body=$(echo "$resp" | sed 's/HTTP_CODE:[0-9]*$//')

  echo "$body" > "$OUT_DIR/${id}-response.json"

  if [ "$http_code" != "201" ] && [ "$http_code" != "200" ]; then
    local err
    err=$(echo "$body" | jq -r '.message // "?"' 2>/dev/null | tr ',' ';' | head -c 200)
    echo "  $id: HTTP $http_code - $err"
    echo "$id,$cert_num,,,$http_code,,$err" >> "$SUMMARY"
    return
  fi

  pdf_url=$(echo "$body" | jq -r '.pdf.pdfUrl // empty')
  filename=$(echo "$body" | jq -r '.pdf.filename // empty')

  if [ -n "$pdf_url" ] && [ "$pdf_url" != "null" ]; then
    local pdf_path="$OUT_DIR/${id}-${filename}"
    curl -sL "$pdf_url" -o "$pdf_path"
    local size
    size=$(stat -c%s "$pdf_path" 2>/dev/null || stat -f%z "$pdf_path")
    echo "  $id: HTTP $http_code, PDF $size bytes -> ${id}-${filename}"
    echo "$id,$cert_num,,,$http_code,${id}-${filename}," >> "$SUMMARY"
  else
    echo "  $id: HTTP $http_code mas sem pdfUrl no response"
    echo "$id,$cert_num,,,$http_code,,no-pdf-url" >> "$SUMMARY"
  fi
}

# Casos da matriz
emit_case "CASE-01" "Industrial CIV + GSO com anexo"        "CIV" "GSO"       "habilitation" 11 false false
emit_case "CASE-02" "Industrial CIV + GSO sem anexo (5p)"   "CIV" "GSO"       "habilitation" 5  false false
emit_case "CASE-03" "Industrial CIV + OIC bilingue"         "CIV" "OIC_SMIIC" "habilitation" 10 false false
emit_case "CASE-04" "Industrial CIV + BPJPH"                "CIV" "BPJPH"     "habilitation" 10 false false
emit_case "CASE-05" "Industrial CIV + MUIS"                 "CIV" "MUIS"      "habilitation" 10 false false
emit_case "CASE-06" "Industrial CIV + MS"                   "CIV" "MS"        "habilitation" 10 false false
emit_case "CASE-07" "Industrial CIV + UAE"                  "CIV" "UAE"       "habilitation" 10 false false
emit_case "CASE-08" "Frigorifico CV + GSO"                  "CV"  "GSO"       "habilitation" 2  false false
emit_case "CASE-09" "Frigorifico CV + MS"                   "CV"  "MS"        "habilitation" 2  false false
emit_case "CASE-10" "Frigorifico CV + OIC"                  "CV"  "OIC_SMIIC" "habilitation" 2  false false
emit_case "CASE-11" "Industrial K + GSO"                    "K"   "GSO"       "habilitation" 4  false false
emit_case "CASE-12" "Industrial CIV + GSO granel+alcool"    "CIV" "GSO"       "habilitation" 10 true  true

echo
echo "Pronto. Sumario em $SUMMARY"
echo "PDFs em $OUT_DIR/"
