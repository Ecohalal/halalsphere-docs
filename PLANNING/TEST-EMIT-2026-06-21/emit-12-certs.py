#!/usr/bin/env python3
"""
Emite 12 certs de teste cobrindo a matriz de variantes (FM 7.7.1/7.7.2,
selos, com/sem anexo, granel, alcool) e baixa os PDFs gerados para
comparacao visual contra os templates oficiais FAMBRAS em
C:\\HalalSphere\\@TEMPLATE DO CERTIFICADO.2026.

Uso:
  HALALSPHERE_EMAIL=... HALALSPHERE_PASSWORD=... python emit-12-certs.py
"""
import io
import json
import os
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

# UTF-8 stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

API = os.environ.get('HALALSPHERE_API_URL', 'https://gestaodecertificacoes-api.ecohalal.solutions')
EMAIL = os.environ.get('HALALSPHERE_EMAIL')
PASSWORD = os.environ.get('HALALSPHERE_PASSWORD')

if not EMAIL or not PASSWORD:
    print('ERRO: defina HALALSPHERE_EMAIL e HALALSPHERE_PASSWORD')
    sys.exit(1)

OUT_DIR = Path(__file__).parent / 'output'
OUT_DIR.mkdir(parents=True, exist_ok=True)

print(f'API={API}')
print(f'EMAIL={EMAIL}')
print()


def api_request(method, path, token=None, payload=None):
    url = f'{API}{path}' if path.startswith('/') else path
    headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    data = json.dumps(payload).encode('utf-8') if payload is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = resp.read().decode('utf-8', errors='replace')
            return resp.status, body
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='replace')
        return e.code, body
    except Exception as e:
        return 0, str(e)


def download(url, dest):
    req = urllib.request.Request(url, headers={'Accept': '*/*'})
    with urllib.request.urlopen(req, timeout=120) as resp, open(dest, 'wb') as f:
        f.write(resp.read())


# ============== 1. Login ==============
print('[1/4] Login...')
status, body = api_request('POST', '/auth/login', payload={'email': EMAIL, 'password': PASSWORD})
if status != 200:
    print(f'ERRO login HTTP {status}: {body[:300]}')
    sys.exit(1)
login_data = json.loads(body)
TOKEN = login_data.get('token')
USER = login_data.get('user', {})
print(f'  user: {USER.get("email")} role={USER.get("role")}')
print(f'  token: {len(TOKEN or "")} chars')
print()

# ============== 2. Achar BRF + Plant ==============
print('[2/4] Procurando empresa BRF...')
status, body = api_request('GET', '/companies?search=BRF&take=20', token=TOKEN)
if status != 200:
    print(f'ERRO companies HTTP {status}: {body[:300]}')
    sys.exit(1)

comps_resp = json.loads(body)
comps = comps_resp.get('data', comps_resp if isinstance(comps_resp, list) else [])
brf_candidates = [c for c in comps if 'BRF' in c.get('legalName', '').upper()]
if not brf_candidates:
    print('Nao encontrei BRF. Lista parcial:')
    for c in comps[:10]:
        print(f'  {c.get("id")} | {c.get("legalName")} | {c.get("taxId")}')
    sys.exit(1)

COMPANY = brf_candidates[0]
print(f'  BRF: {COMPANY.get("id")} | {COMPANY.get("legalName")} | taxId={COMPANY.get("taxId")}')

# Plant
status, body = api_request('GET', f'/plants?companyId={COMPANY["id"]}', token=TOKEN)
if status != 200:
    print(f'ERRO plants HTTP {status}: {body[:300]}')
    sys.exit(1)
plants_data = json.loads(body)
plants = plants_data.get('data', plants_data if isinstance(plants_data, list) else [])
if not plants:
    print(f'BRF sem planta. Tentando /plants global filtrando por companyId...')
    status, body = api_request('GET', '/plants', token=TOKEN)
    if status == 200:
        all_plants = json.loads(body)
        all_plants = all_plants.get('data', all_plants if isinstance(all_plants, list) else [])
        plants = [p for p in all_plants if p.get('companyId') == COMPANY['id']]

if not plants:
    print('ERRO: BRF sem plant cadastrada.')
    sys.exit(1)

PLANT = plants[0]
print(f'  Plant: {PLANT.get("id")} | {PLANT.get("name")} | SIF={PLANT.get("sanitaryCode")}')
print()

# ============== 3. Mapear IndustrialCategory codes -> ids ==============
print('[3/4] Mapeando IndustrialCategory codes -> ids...')
status, body = api_request('GET', '/industrial-classification', token=TOKEN)
if status != 200:
    print(f'ERRO industrial-classification HTTP {status}: {body[:300]}')
    sys.exit(1)

groups = json.loads(body)
cats_by_code = {}
for g in groups:
    for c in (g.get('categories') or []):
        cats_by_code[c.get('code')] = c.get('id')

CIV_ID = cats_by_code.get('CIV')
CV_ID = cats_by_code.get('CV')
K_ID = cats_by_code.get('K')

print(f'  CIV: {CIV_ID}')
print(f'  CV : {CV_ID}')
print(f'  K  : {K_ID}')

missing = [k for k, v in {'CIV': CIV_ID, 'CV': CV_ID, 'K': K_ID}.items() if not v]
if missing:
    print(f'ERRO: faltando categorias {missing}. Lista bruta dos primeiros 30:')
    for code, cid in list(cats_by_code.items())[:30]:
        print(f'  {code} -> {cid}')
    sys.exit(1)
print()

# ============== 4. Emitir 12 certs ==============
print('[4/4] Emitindo 12 certs...')
TIMESTAMP = int(time.time())

CASES = [
    ('CASE-01', 'Industrial CIV + GSO com anexo (11 prod)',     [CIV_ID], ['GSO'],       11, False, False),
    ('CASE-02', 'Industrial CIV + GSO sem anexo (5 prod)',      [CIV_ID], ['GSO'],       5,  False, False),
    ('CASE-03', 'Industrial CIV + OIC bilingue',                [CIV_ID], ['OIC_SMIIC'], 10, False, False),
    ('CASE-04', 'Industrial CIV + BPJPH',                       [CIV_ID], ['BPJPH'],     10, False, False),
    ('CASE-05', 'Industrial CIV + MUIS',                        [CIV_ID], ['MUIS'],      10, False, False),
    ('CASE-06', 'Industrial CIV + MS',                          [CIV_ID], ['MS'],        10, False, False),
    ('CASE-07', 'Industrial CIV + UAE',                         [CIV_ID], ['UAE'],       10, False, False),
    ('CASE-08', 'Frigorifico CV + GSO',                         [CV_ID],  ['GSO'],       2,  False, False),
    ('CASE-09', 'Frigorifico CV + MS',                          [CV_ID],  ['MS'],        2,  False, False),
    ('CASE-10', 'Frigorifico CV + OIC',                         [CV_ID],  ['OIC_SMIIC'], 2,  False, False),
    ('CASE-11', 'Industrial K + GSO',                           [K_ID],   ['GSO'],       4,  False, False),
    ('CASE-12', 'Industrial CIV + GSO granel + alcool',         [CIV_ID], ['GSO'],       10, True,  True),
]


def derive_standard(applicable_standards):
    """Espelha deriveStandard do frontend (IT 7.10 + FM 4.1.X)."""
    s = set(applicable_standards)
    has_gso = 'GSO' in s
    has_oic = 'OIC_SMIIC' in s
    if has_gso and has_oic:
        return 'BOTH'
    if has_gso:
        return 'GSO_2055_2'
    if has_oic:
        return 'SMIIC_02'
    return 'VOLUNTARY'


def derive_template_code(applicable_standards):
    """Espelha deriveTemplateCode do frontend."""
    s = set(applicable_standards)
    if not s:
        return 'STANDARD'
    if 'GSO' in s:
        return 'GAC_ENAS'
    if 'OIC_SMIIC' in s:
        return 'OIC_SMIIC'
    if 'MUIS' in s:
        return 'MUIS'
    if 'MS' in s:
        return 'MS'
    if 'BPJPH' in s:
        return 'BPJPH'
    if 'UAE' in s:
        return 'UAE'
    return 'STANDARD'


def build_payload(cat_ids, applicable_standards, products_count, is_granel, is_alcool, cert_number):
    today = time.strftime('%Y-%m-%d')
    # +3 anos sem dependencia externa
    exp_year = int(today[:4]) + 3
    exp = f'{exp_year}{today[4:]}'
    products = [
        {
            'name': f'PRODUTO TESTE {i}',
            'packingSize': 'Caixa 1kg',
            'brandNames': ['MARCA TESTE'],
        }
        for i in range(1, products_count + 1)
    ]
    return {
        'plantId': PLANT['id'],
        'industrialCategoryIds': cat_ids,
        'certificateNumber': cert_number,
        'issuedAt': today,
        'expiresAt': exp,
        'certificateType': 'habilitation',
        'certificationType': 'produto',
        'standard': derive_standard(applicable_standards),
        'applicableStandards': applicable_standards,
        'templateCode': derive_template_code(applicable_standards),
        'countryVariant': 'BR',
        'isGranel': is_granel,
        'isAlcool': is_alcool,
        'brandNames': ['MARCA TESTE'],
        'products': products,
    }


summary = [['case', 'cert_number', 'http', 'pdf_filename', 'pdf_bytes', 'error']]

for case_id, desc, cat_ids, stds, n_products, is_granel, is_alcool in CASES:
    cert_num = f'TEST-{case_id}-{TIMESTAMP}'
    payload = build_payload(cat_ids, stds, n_products, is_granel, is_alcool, cert_num)
    (OUT_DIR / f'{case_id}-payload.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')

    status, body = api_request('POST', '/certificates/manual-emit', token=TOKEN, payload=payload)
    (OUT_DIR / f'{case_id}-response.json').write_text(body, encoding='utf-8')

    if status not in (200, 201):
        try:
            err = json.loads(body).get('message', '?')
            if isinstance(err, list):
                err = '; '.join(err)
        except Exception:
            err = body[:200]
        print(f'  {case_id}: HTTP {status} - {err}')
        summary.append([case_id, cert_num, str(status), '', '', str(err)[:200]])
        continue

    resp_data = json.loads(body)
    pdf_url = resp_data.get('pdf', {}).get('pdfUrl')
    filename = resp_data.get('pdf', {}).get('filename', f'{case_id}.pdf')

    if not pdf_url:
        print(f'  {case_id}: HTTP {status} sem pdfUrl')
        summary.append([case_id, cert_num, str(status), '', '', 'no-pdf-url'])
        continue

    pdf_path = OUT_DIR / f'{case_id}-{filename}'
    try:
        download(pdf_url, pdf_path)
        size = pdf_path.stat().st_size
        print(f'  {case_id}: HTTP {status}, PDF {size:>7} bytes -> {pdf_path.name}')
        summary.append([case_id, cert_num, str(status), pdf_path.name, str(size), ''])
    except Exception as e:
        print(f'  {case_id}: HTTP {status} mas falha no download: {e}')
        summary.append([case_id, cert_num, str(status), '', '', f'dl-fail:{e}'])

# Summary CSV
with open(OUT_DIR / 'summary.csv', 'w', encoding='utf-8') as f:
    for row in summary:
        f.write(','.join(row) + '\n')

print()
print(f'Sumario: {OUT_DIR / "summary.csv"}')
print(f'PDFs em: {OUT_DIR}/')
