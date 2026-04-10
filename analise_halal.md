# Análise de Conformidade - HalalSphere vs Documentação FAMBRAS Halal

> Análise criteriosa documento a documento.
> Foco: requisitos que o sistema DEVE implementar.

---

## Legenda de Status
- ✅ Implementado no sistema
- ⚠️ Parcialmente implementado
- ❌ Não implementado
- 🔍 Requer verificação no código

---

## PASTA 5 - Auditoria Estágio 1 (Documental-Operacional)

### Documentos Técnicos (DTs) - Requisitos Normativos

#### DT 7.1 - Requisitos Gerais Alimentos Industrializados e Aditivos (REV 14, 06/02/2024)
- **Escopo**: Categorias C1, C2, C3, C4 e K (GSO 2055-2 / SMIIC 02)
- **30 páginas** | Normas ref: GSO 2055-1, GSO 2538, SMIIC 1:2019, MS 1500:2019, BPJPH

**CATEGORIAS DE CERTIFICAÇÃO (Tabelas 1 e 2 - GSO/SMIIC)**
O sistema DEVE suportar todas as categorias:
| Grupo | Cat | Descrição |
|-------|-----|-----------|
| Agricultura | A1 | Criação de animais (carne/leite/ovos/mel) |
| Agricultura | A2 | Piscicultura/produtos marinhos |
| Agricultura | B1 | Cultivo de plantas |
| Agricultura | B2 | Cultivo de leguminosas e grãos |
| Processamento | C1 | Perecíveis origem animal (abate + processamento) |
| Processamento | C2 | Perecíveis origem vegetal |
| Processamento | C3 | Perecíveis mistos (animal + vegetal) |
| Processamento | C4 | Estáveis temperatura ambiente |
| Ração | D1 | Ração animal (produtores de alimentos) |
| Ração | D2 | Ração pets |
| Serviço | E | Serviço de alimentação (restaurantes) |
| Distribuição | F1 | Atacado e varejo |
| Distribuição | F2 | Negociação e mediação |
| Transporte | G1 | Transporte/armazém perecíveis |
| Transporte | G2 | Transporte/armazém temperatura ambiente |
| Serviços aux | H1 | Serviços (água, pragas, limpeza) |
| Serviços aux | H2 | Serviços financeiros |
| Serviços aux | H3 | Turismo Muslim Friendly |
| Embalagem | I | Materiais de embalagem para alimentos |
| Equipamentos | J | Equipamentos para alimentos |
| Aditivos | K | Aditivos alimentares e ingredientes |
| Cosméticos | L1 | Cosméticos |
| Fármacos | L2 | Fármacos e medicamentos |
| Químicos | L3 | Químicos e agentes de limpeza |

**REQUISITOS DE FABRICAÇÃO (Seção 6) - Impacto no Sistema**
| Req | Descrição | Impacto Sistema |
|-----|-----------|-----------------|
| 6.1 | Conformidade legal país/região | 🔍 Checklist auditoria deve validar |
| 6.2 | Produtos livres de Najasah (impurezas) + tabela 3 não-Halal | 🔍 Checklist ingredientes |
| 6.3 | Sem derivados de animais não abatidos Halal | 🔍 Validação matérias-primas |
| 6.4 | Docs oficiais status Halal para matérias-primas | 🔍 Upload/gestão docs fornecedores |
| 6.4.1 | Homologação de fornecedores | 🔍 Módulo fornecedores |
| 6.5 | Sem substâncias tóxicas/poluentes | 🔍 Checklist |
| 6.6 | Padrões microbiológicos e físico-químicos | 🔍 Laudos laboratoriais |
| 6.7 | Matérias-primas aprovadas previamente pela FAMBRAS | 🔍 Workflow aprovação |
| 6.8 | **ETANOL - LIMITES CRÍTICOS**: produto final ≤0,1%, MP ≤0,5% | 🔍 Campo numérico obrigatório |
| 6.8.3.1 | Limites GSO para Golfo (tabela 4 - 8 tipos, 0,1% a 1%) | 🔍 Regras por mercado destino |
| 6.9 | Nome/marca/logo não infringem Shariah | 🔍 Check rotulagem |
| 6.10 | Regras islâmicas em TODA cadeia | 🔍 Rastreabilidade completa |
| 6.12 | Produtos limpeza aprovados pela FAMBRAS | 🔍 Lista aprovada |
| 6.13 | Peso declarado ≥ peso real (Halal Mizen) | 🔍 Aferição peso |

**REQUISITOS ÁREAS DE PRODUÇÃO (Seção 7)**
| Req | Descrição | Impacto Sistema |
|-----|-----------|-----------------|
| 7.1 | Separação TOTAL Halal/não-Halal em TODA etapa | 🔍 Checklist auditoria |
| 7.2 | Linhas mistas: higienização obrigatória antes produção Halal | 🔍 Registro higienização |
| 7.3 | Conversão linhas suínas: 7 lavagens mínimo (ritual purificação) | 🔍 Registro ritual |
| 7.4 | **SUPERVISOR FAMBRAS obrigatório** quando carne/gelatina/alto risco | 🔍 Alocação supervisor |
| 7.5 | Equipamentos livres de material não-Halal (preferência aço inox) | 🔍 Checklist equipamentos |

**REQUISITOS ARMAZENAGEM E TRANSPORTE (Seção 8)**
| Req | Descrição | Impacto Sistema |
|-----|-----------|-----------------|
| 8.1 | Segregação Halal/não-Halal identificada (50cm pó, estantes) | 🔍 Checklist armazém |
| 8.1.3 | Procedimento para rompimento/vazamento embalagem | 🔍 Doc procedimento |
| 8.2 | **PROIBIDO transporte misto Halal + suíno** | 🔍 Validação transporte |
| 8.2.1 | Países islâmicos: proibido transporte misto qualquer | 🔍 Regra por destino |
| 8.4 | Meios transporte adequados contra contaminação | 🔍 Checklist transporte |

**REQUISITOS ROTULAGEM (Seção 9)**
| Req | Descrição | Impacto Sistema |
|-----|-----------|-----------------|
| 9.1 | Conformidade leis país origem + destino | 🔍 Validação rotulagem |
| 9.2 | Selo Halal conforme IT 4.1 | 🔍 Gestão selo |
| 9.2.1 | **TODA aplicação do selo deve ser APROVADA pela FAMBRAS** | 🔍 Workflow aprovação selo |
| 9.3 | Publicidade conforme Shariah | 🔍 Revisão marketing |
| 9.4 | Sem informações enganosas/elementos Haram | 🔍 Check embalagem |

**REQUISITOS QUALIDADE E SEGURANÇA (Seção 10)**
| Req | Descrição | Impacto Sistema |
|-----|-----------|-----------------|
| 10.1 | **Sistema de Garantia Halal (HAS) conforme DT 7.3** | 🔍 Integração HAS |
| 10.2 | Layout instalações adequado (fluxo, BPH, BPF) | 🔍 Checklist layout |
| 10.4 | **BPF obrigatória** com 8 itens mínimos | 🔍 Checklist BPF |
| 10.5 | **APPCC obrigatório** | 🔍 Checklist APPCC |
| 10.6 | Programa recolhimento c/ comunicação FAMBRAS | 🔍 Workflow recall |
| 10.7 | Tratamento de NCs com ações corretivas | 🔍 Módulo NCs |
| 10.8 | NCs anteriores devem estar solucionadas | 🔍 Histórico NCs |

**ANEXO 1 - PONTOS CRÍTICOS HALAL POR TIPO DE PRODUTO**
O sistema DEVE ter checklist específico por categoria de produto:
- Leite e lácteos (enzimas, coagulantes, aromas, gelatina, embalagem)
- Gorduras e óleos (clarificação, antiumectantes)
- Frutas e vegetais (aromas, enzimas, etanol fermentação)
- Doces/chocolates (gelatina, soro de leite, ácidos graxos)
- Açúcar/café/cacau (fermentação, carvão de osso, OGM)
- Cereais/farinhas/pães (colágeno, vitaminas, conservantes)
- Oleaginosas/leguminosas (extração proteínas, OGM)
- Carne e derivados (abate Halal, insensibilização, tinta carimbo)
- Ovos (enzimas, contaminação cruzada)
- Mel (extração própolis com álcool)
- Sal/especiarias/condimentos (molho soja, vinagre, etanol)
- Produtos mistos (proteínas animais Halal)
- Ingredientes/aditivos (enzimas, aromas, corantes, fermentados)
- Bebidas/sucos (álcool, clarificantes, pectina)
- Água (agentes filtração)
- Drogas/medicamentos (cápsulas gelatina, veículo etanol)
- Cosméticos (queratina, glicerina, permeabilidade)
- Químicos/limpeza (enzimas, ácidos graxos, fragrâncias)
- Armazenamento/transporte (contaminação cruzada)
- Embalagem (tripas, biodegradáveis, corantes)
- Ração (elementos não-Halal)
- Fazenda (ração Halal, sem criação porco, sem cachaça)

---

#### DT 7.4 - Requisitos Gerais Produtos Químicos e Agentes de Limpeza (REV 10, 06/02/2024)
- **Escopo**: Categoria K (GSO 2055-2 / SMIIC 02) - químicos e limpeza
- **29 páginas** | Estrutura IDÊNTICA ao DT 7.1 (seções 6-10 + Anexo 1)

**DIFERENÇAS RELEVANTES vs DT 7.1:**
| Item | DT 7.1 (Alimentos) | DT 7.4 (Químicos) | Impacto Sistema |
|------|--------------------|--------------------|-----------------|
| Etanol limite | 0,1% final / 0,5% MP | **1% (não consumo direto)** | 🔍 Limite por categoria |
| Etanol Golfo | Tabela 4 (8 tipos) | **0,2% v/v fixo** | 🔍 Regra simplificada |
| BPF referência | RDC 275/2002 + RDC 48/2013 | **RDC 47/2013** (saneantes) | 🔍 Checklist BPF diferente |
| Análise risco | APPCC obrigatório | **Análise de risco** (não APPCC) | 🔍 Tipo análise por categoria |
| Seções 7-9 | Idênticas | Idênticas | - |

**REQUISITO ADICIONAL QUÍMICOS:**
- 10.4: BPF com 16 itens mínimos (vs 8 para alimentos): Gestão Qualidade, BPF, Saúde/Higiene, Reclamações, Recolhimento, Devolução, Auto-Inspeção, Documentação, Pessoal, Instalações, Sistemas Água, Áreas Auxiliares, Recebimento/Armazenamento, Amostragem, Produção, Controle Qualidade, Amostras Retenção

---

#### DT 7.5 - Requisitos Gerais Fármacos e Medicamentos (REV 9, 06/02/2024)
- **Escopo**: Categoria L2 (GSO/SMIIC) - fármacos e medicamentos
- **28 páginas** | Estrutura IDÊNTICA ao DT 7.1

**DIFERENÇAS RELEVANTES vs DT 7.1:**
| Item | DT 7.1 (Alimentos) | DT 7.5 (Fármacos) | Impacto Sistema |
|------|--------------------|--------------------|-----------------|
| Etanol limite | 0,1% / 0,5% | **Igual** (0,1% / 0,5%) | - |
| Etanol Golfo | Tabela 4 | **0,2% v/v fixo** | 🔍 Regra por categoria |
| BPF referência | RDC 275/2002 | **RDC 17/2010** (farmacêutica) | 🔍 Checklist BPF diferente |
| Análise risco | APPCC | **Análise de risco** (não APPCC) | 🔍 Tipo análise por categoria |
| BPF itens | 8 itens | **15 itens** (inclui Qualificação/Validação, Contrato Produção, Treinamento, Equipamentos, Materiais) | 🔍 Checklist expandido |
| Exemplo purificação | Linhas suínas genérico | **Gelatina suína em cápsulas** | Contexto específico |

---

#### DT 7.6 - Requisitos Gerais Cosméticos e Cuidados Pessoais (REV 9, 06/02/2024)
- **Escopo**: Categoria L1 (GSO/SMIIC) - cosméticos
- **42 páginas** - MAIS EXTENSO que os anteriores, muitos requisitos EXCLUSIVOS

**DIFERENÇAS E REQUISITOS EXCLUSIVOS COSMÉTICOS:**
| Item | Requisito Exclusivo | Impacto Sistema |
|------|---------------------|-----------------|
| 6.10 | Etanol ≤1% (mesmo de químicos) | 🔍 Limite por categoria |
| 6.11.1 | Água reutilizada PROIBIDA (esgoto) | 🔍 Checklist ingredientes |
| 6.11.2 | Terra de cemitério/fazenda/despejo PROIBIDA | 🔍 Checklist ingredientes |
| 6.11.4 | Espécies ameaçadas proibidas (CITES/IN IBAMA) | 🔍 Validação espécies |
| 6.11.5 | Lei 13.123/2015 patrimônio genético | 🔍 Conformidade legal |
| 6.11.7 | Meio de cultura deve ser Halal | 🔍 Checklist microbiologia |
| 6.16 | Embalagem fechada com segurança | 🔍 Checklist embalagem |
| 9.5 | **Kits**: só selo se TODOS produtos forem Halal | 🔍 Validação kit |
| 9.6 | **Rótulo obrigatório**: 9 informações (nome, endereço, país, peso, datas, precauções, lote, função, ingredientes) | 🔍 Checklist rotulagem |
| 9.6.1 | **Golfo extra**: país origem multi-produção, isenção peso <5ml, validade 30 meses | 🔍 Regras por destino |
| 9.7 | Kits: lista ingredientes combinada | 🔍 Gestão composição |
| 9.8 | **6 critérios apelos publicitários**: conformidade, veracidade, evidência, honestidade, justiça, decisão informada | 🔍 Revisão marketing |
| 9.9 | Proibido reivindicar propriedades medicinais | 🔍 Check rotulagem |
| 10.4 | BPF base: **RDC 48/2013 + ISO 22716:2007 + GSO 2020/2010** | 🔍 Checklist BPF cosmético |
| 10.5 | **SGQ obrigatório** com 6 itens (estrutura org, responsabilidades, pessoal/treinamento, docs, terceirização, mudança) | 🔍 Módulo SGQ |
| 10.6 | BPF com **12 itens** mínimos | 🔍 Checklist expandido |
| 10.9 | Análise risco alergia (inclusive infantil) | 🔍 Checklist risco |
| 10.10 | **Rastreabilidade OBRIGATÓRIA** em todas etapas | 🔍 Módulo rastreabilidade |
| 10.13 | **pH 4-8** geral, **pH 6-7 shampoo baby** | 🔍 Campo pH obrigatório |
| 10.14 | Concentração máxima conforme RDCs (530, 528, 529, 628, 752) | 🔍 Limites regulatórios |
| 10.14.1 | Golfo: GSO 1943/2021 (anexos) | 🔍 Regras por destino |
| 10.16-21 | Regras específicas: corantes, conservantes, chumbo, filtro UV, alisamento, infantil | 🔍 Checklists por tipo produto |

---

#### DT 7.7.1 - Requisitos Gerais Fazendas de Animais Cat A (REV 3, 06/02/2024)
- **Escopo**: Categoria A (GSO/SMIIC) - criação de animais
- **43 páginas** | ESTRUTURA COMPLETAMENTE DIFERENTE dos DTs industriais

**SEÇÕES EXCLUSIVAS FAZENDA ANIMAL (17 seções vs 10 dos industriais):**
| Seção | Conteúdo | Impacto Sistema |
|-------|----------|-----------------|
| 6 | Requisitos gerais: conformidade legal, documentação, mapa/layout, **PROIBIDO porcos** | 🔍 Checklist fazenda |
| 7 | Construção e layout: higiene, separação lotes, ventilação, sanitários | 🔍 Checklist instalações |
| 8 | **PESSOAL**: direitos trabalhistas, **PROIBIDO trabalho infantil/escravo**, lista funcionários, organograma, EPIs, higiene | 🔍 Checklist RH/social |
| 9 | Equipamentos: manutenção, calibração, materiais sem contaminação | 🔍 Checklist equipamentos |
| 10 | Limpeza: procedimentos, frequência, produtos identificados | 🔍 Checklist limpeza |
| 11 | Animais de trabalho: não contaminar alimentos | 🔍 Checklist |
| 12 | **CRIAÇÃO**: espécies Halal, ração sem elementos Haram, medicamentos veterinários (registros, agulhas quebradas), ordenha, ovos, aquicultura | 🔍 Módulo criação animal |
| 13 | **BEM-ESTAR ANIMAL**: manejo bovino/aves, transporte (jejum, superlotação), saúde (profilaxia, veterinário), animais mortos (rastreabilidade) | 🔍 Checklist bem-estar |
| 14 | Armazenagem: segregação Halal, depósitos terceiros aprovados, **PROIBIDO transporte com suíno** | 🔍 Checklist armazém |
| 15 | Rotulagem: selo IT 4.1, aprovação FAMBRAS | 🔍 Igual outros DTs |
| 16 | **MEIO AMBIENTE**: resíduos (sólidos, líquidos, poluentes), preservação água, **proibido desmatamento**, diversidade ecológica, esgoto proibido, solo | 🔍 Checklist ambiental |
| 17 | Qualidade: HAS (DT 7.3), Política Halal | 🔍 Igual outros DTs |

**REQUISITOS CRÍTICOS EXCLUSIVOS FAZENDAS:**
- 6.5: Fazenda NÃO pode produzir NENHUM item não-Halal
- 6.6: PROIBIDO criação de porcos
- 8.5: PROIBIDO trabalho forçado/escravo
- 8.6: PROIBIDO trabalho infantil (<16 anos, exceto aprendiz >14)
- 12.5: Lista atualizada de animais (espécie, ID, idade, sexo)
- 12.6: Registros de medicamentos veterinários (prescrição, animal, datas, carência)
- 12.7: Ordenha: procedimentos higiene, exclusão leite anormal
- 12.8: Ovos: coleta higiênica, contaminados excluídos
- 12.9: Animais doentes NÃO vão para abate
- 13.6: Animais mortos: diagnóstico, registros, NUNCA na cadeia alimentar

---

#### DT 7.7.2 - Requisitos Gerais Fazendas Agrícolas Cat B (REV 2, 06/02/2024)
- **Escopo**: Categoria B (GSO/SMIIC) - atividades agrícolas
- **42 páginas** | Estrutura similar ao DT 7.7.1 mas com seções agrícolas

**DIFERENÇAS vs DT 7.7.1 (Animal):**
| Item | DT 7.7.1 (Animal) | DT 7.7.2 (Agrícola) | Impacto Sistema |
|------|-------------------|----------------------|-----------------|
| Seção 12 | Criação animais | **Não tem** (substituída por 9.4-9.8) | Checklist diferente |
| Seção 13 | Bem-estar animal | **Animais de trabalho** (seção 13 simplificada) | Checklist diferente |
| 6.6 | - | **Sementes OGM**: proibido de espécie não-Halal | 🔍 Validação sementes |
| 6.9 | - | **PROIBIDO cachaça/bebidas alcoólicas** na fazenda | 🔍 Checklist fazenda |
| 9.4 | - | **Irrigação**: qualidade água, sustentabilidade | 🔍 Checklist irrigação |
| 9.5 | - | **DEFENSIVOS AGRÍCOLAS**: registros uso, armazenamento (30m fontes água), EPI, proibido <18 anos/grávidas, embalagens não reutilizáveis, intervalo pré-colheita | 🔍 Módulo defensivos |
| 9.6 | - | **Colheita**: momento adequado, contaminação, descarte danificados | 🔍 Checklist colheita |
| 9.7 | - | **Pós-colheita**: seleção, corpos estranhos, água potável para consumo cru | 🔍 Checklist pós-colheita |
| 9.8 | - | **Secagem grãos**: controle rigoroso temperatura/umidade | 🔍 Checklist secagem |
| 15.2 | - | **Irrigação**: qualidade água controlada, fontes sustentáveis | 🔍 Checklist ambiental |
| 16.3 | - | **Rastreabilidade**: data plantio, defensivos, colheita, beneficiamento | 🔍 Módulo rastreabilidade |
| 16.6 | - | **MIPD**: Manejo Integrado Pragas e Doenças obrigatório | 🔍 Checklist pragas |
| 16.8 | - | Resíduos de defensivos conforme legislação | 🔍 Laudos laboratoriais |
| Seção 8 | Idêntica (RH/trabalho) | Idêntica | - |

---

## DT 7.8 - Armazéns/Entrepostos, Transporte e Distribuição (REV 09, 40 pags)
**Categorias**: F1, F2 (Distribuição), G1, G2 (Transporte/Armazenamento), H1 (Serviços auxiliares)
**Normas base**: DECRETO 9.013/2017, GSO 2055-2, SMIIC 02

### Estrutura (Seções 6-11 + Anexo 1)
| Seção | Tema | Requisitos Únicos | Impacto Sistema |
|-------|------|-------------------|-----------------|
| 6 | Requerimentos gerais armazém/transporte/distribuição | Separação total Halal/não-Halal; Proibido manipulação/fracionamento/reembalagem (Dec 9.013); Identificação visível produtos Halal | 🔍 Gestão armazém |
| 6.11 | Superfícies contato | Não podem ser de materiais não-Halal (osso, chifre, unhas, dentes); Proibido compartilhar utensílios coleta amostra sem higienização | 🔍 Checklist materiais |
| 7 | Recebimento/expedição | Carga Halal identificada na recepção; Seguros adequados obrigatórios; Carga/descarga rápida (controle temperatura) | 🔍 Checklist recebimento |
| 8 | Transporte | Proibido mistura carga Halal+não-Halal em veículo; Granel: proibido transporte misto; Superfícies veículo higienizadas, sem rachaduras/ferrugem | 🔍 Controle transporte |
| 9.1 | Rastreabilidade | Sistema eficiente rastreabilidade desde fornecedores até ponto chegada; Período retenção registros definido | 🔍 Módulo rastreabilidade |
| 9.5 | Rotação estoque | FIFO/FEFO obrigatório | 🔍 Controle estoque |
| 9.6 | Controle ambiental | Temperatura, umidade, pressão conforme produto | 🔍 Monitoramento |
| 9.7 | Instalações | Localização adequada; Pisos impermeáveis/antiderrapantes; Barreira sanitária; Câmaras frias climatizadas; Ventilação (fluxo contaminada→limpa proibido) | 🔍 Checklist instalações |
| 9.8 | Equipamentos | Duráveis, móveis; Não de materiais não-Halal | 🔍 Inventário |
| 9.9 | Procedimentos | Recall (notificar partes interessadas); Manutenção/calibração; Descarte resíduos; Gestão materiais adquiridos; Emergências contaminação | 🔍 Gestão procedimentos |
| 9.26 | Veículos/contêineres | Estado adequado conservação/limpeza; Controle temp/umidade documentado; Se uso misto → limpeza entre cargas | 🔍 Checklist veículos |
| 9.28 | Terceirizados | Avaliação/seleção baseada em capacidade Halal; Registros mantidos | 🔍 Gestão fornecedores |
| 10 | Sistema Garantia Halal | Comitê Halal (10.2); Política Halal (10.3); Escopo Halal (10.4); Análise de risco Halal com matriz probabilidade×severidade (10.5); Auditoria interna anual mínimo (10.6); Treinamento HAS obrigatório (10.7); Rastreabilidade (10.8) | 🔍 Módulo HAS completo |
| 11 | Rotulagem/publicidade | Selo aprovado pela FAMBRAS; Armazém NÃO pode aplicar selo nos produtos (responsabilidade do fabricante); Materiais publicitários sem elementos Haram | 🔍 Controle rótulos |
| Anexo 1 | Pontos críticos por produto | Mesma tabela dos DTs anteriores (22 tipos de produto) | Referência cruzada |

**DIFERENÇAS ÚNICAS vs outros DTs:**
- **Foco operacional logístico** (não produtivo): armazéns, transporte, distribuição
- **Decreto 9.013/2017**: proibido manipulação/fracionamento em armazém
- **Faixas pintadas chão**: indicando posição paletes e passagens
- **Empilhadeiras**: gasolina/diesel proibidas em áreas de estoque alimentício
- **Corredores**: não podem ser usados como áreas de armazenamento
- **Segregação física**: 50cm entre Halal/não-Halal para embalagens flexíveis (ex: sacos de ráfia)
- **Países islâmicos**: proibido transporte misto Halal+não-Halal
- **Programa defesa**: bioterrorismo/sabotagem - identificar ameaças e medidas proteção

---

## DT 7.9 - Alimentos para Animais e Ração Animal (REV 07, 35 pags)
**Categorias**: D1 (Alimentos para animais), D2 (Ração animal)
**Normas base**: GSO 2578:2021, SMIIC 02, MAPA (registro obrigatório)

### Estrutura (Seções 6-10 + Anexo 1)
| Seção | Tema | Requisitos Únicos | Impacto Sistema |
|-------|------|-------------------|-----------------|
| 6.1 | Conformidade legal | Registro MAPA obrigatório para fabricantes que usam medicamentos | 🔍 Validação registros |
| 6.2-6.4 | Matérias-primas | Livres de elementos não-Halal; Sem derivados animais não-abatidos Halal; Seguras frente a contaminação | Base DT 7.1 |
| 6.5 | Segurança | Sem substâncias tóxicas/poluentes perigosos | Base |
| 6.6 | OGM | Permitido OGM se não prejudicial à saúde; **Obrigatório identificar no rótulo** | 🔍 Validação rótulo OGM |
| 6.9 | Etanol | Mesmo limite 0,5% (alimentos animais); Fonte não pode ser bebida alcoólica | Base DT 7.1 |
| 6.10 | Marca/embalagem | Nome, marca, logo não infringem Shariah | Base |
| 6.14 | Peso Halal Mizen | Testes amostrais peso; Não-conformes segregados; Registros diários | Base |
| 7 | Áreas produção | Separação total Halal/não-Halal em TODO fluxo; Linhas compartilhadas: higienização validada antes produção Halal | Base DT 7.1 |
| 7.3 | Higienização | Proibido alternância higienização entre equipamentos Halal/não-Halal; Testes validação na 1ª produção Halal após não-Halal | Base |
| 7.4 | Purificação suína | 7 enxagues (30s cada); Conversão não pode ser contínua | Base DT 7.1 |
| 7.5 | Supervisor FAMBRAS | Obrigatório quando derivados animais rastreáveis por lote | Base |
| 7.7 | **Farelo de soja** | Livre de ranço/odores; Umidade controlada; Micotoxinas monitoradas | 🔍 Específico ração |
| 8 | Armazenamento | Medicamentos veterinários: local separado, acesso restrito; Segregação 50cm embalagens flexíveis; Granel: proibido transporte misto; Países islâmicos: proibido transporte misto | Base DT 7.8 |
| 9 | Rotulagem | Conformidade país origem + destino; Selo IT 4.1; Publicidade sem indução ao consumo excessivo | Base |
| 10 | Qualidade/segurança | HAS (DT 7.3); BPF; APPCC quando aplicável; Recall comunicar certificadora; Pesticidas/micotoxinas níveis aceitáveis | Base |
| Anexo 1 | Pontos críticos | Mesma tabela 22 tipos de produto | Referência cruzada |

**DIFERENÇAS ÚNICAS vs outros DTs:**
- **MAPA obrigatório**: registro para fabricantes com medicamentos veterinários
- **Medicamentos veterinários**: somente licenciados pelo MAPA, em condições aprovadas
- **Anticoccidianos**: proibido mesmo princípio ativo do medicamento veterinário incorporado
- **Farelo de soja**: requisitos específicos (ranço, umidade, micotoxinas)
- **OGM rotulagem**: obrigatório identificar quando usado ingredientes geneticamente modificados
- **Rotação estoque**: PVPS/FIFO obrigatório

---

## DT 7.10 - Materiais de Embalagem e Invólucros (REV 07, 32 pags)
**Categorias**: I (Embalagem)
**Normas base**: GSO 2652:2021, MS 2565:2014 (Halal Packaging), SMIIC 02

### Estrutura (Seções 6-10 + Anexo 1)
| Seção | Tema | Requisitos Únicos | Impacto Sistema |
|-------|------|-------------------|-----------------|
| 6.1-6.4 | Requisitos gerais | Componentes (incluindo revestimentos e lubrificantes) livres de não-Halal | 🔍 Validação componentes |
| 6.6 | Migração | Pigmentos/corantes não podem migrar para alimento; Sem degradação sensorial | 🔍 Testes migração |
| 6.8 | **Invólucros naturais** | Devem provir de animais Halal abatidos Halal; Rastreabilidade obrigatória | 🔍 Rastreabilidade invólucros |
| 6.9 | Aprovação prévia | Todos componentes informados e aprovados pela FAMBRAS | Base |
| 6.10 | Etanol | Componentes em contato direto: sem bebidas alcoólicas; Etanol como auxiliar processo: permitido se fonte não é bebida alcoólica | Base |
| 6.14 | Produtos limpeza | Todos informados e aprovados pela FAMBRAS; Livres de componentes não-Halal | Base |
| 6.15 | Listas positivas | Componentes devem estar em listas positivas ANVISA/FDA/EU; **Residual solventes ≤5mg/m²** superfície | 🔍 Conformidade regulatória |
| 6.17 | Permeabilidade | Vapor/gases adequada ao material alimentar embalado | 🔍 Especificação técnica |
| 7 | Fabricação | Separação Halal/não-Halal; Higienização validada; Proibido alternância; Testes validação | Base |
| 7.3 | Purificação suína | 7 enxagues (30s cada); Conversão não contínua | Base DT 7.1 |
| 7.4 | Supervisor | Obrigatório quando componentes origem animal rastreáveis por lote | Base |
| 8 | Armazenagem/transporte | Embalagens alimentos separadas de não-alimentícios/químicos; Países islâmicos: proibido transporte misto; Proibido transportar com suínos/derivados | Base |
| 9 | Rotulagem | Selo somente na embalagem que acondiciona os materiais certificados; Informações obrigatórias: fabricante, rastreabilidade, peso, tipo material, finalidade, instruções, avisos | 🔍 Rótulo específico embalagem |
| 10 | Qualidade/segurança | BPF para materiais contato alimentos; HAS (DT 7.3); Defesa alimentos/bioterrorismo | Base |
| Anexo 1 | Pontos críticos | Mesma tabela 22 tipos de produto | Referência cruzada |

**DIFERENÇAS ÚNICAS vs outros DTs:**
- **Foco em materiais de embalagem**, não alimentos em si
- **Migração de componentes**: controle rigoroso para evitar migração pigmentos/corantes
- **Invólucros naturais** (tripas): rastreabilidade Halal obrigatória
- **Listas positivas regulatórias**: ANVISA RDC 17/2008, FDA 21 CFR, EU 10/2011
- **Residual solventes**: máximo 5mg/m² de superfície
- **Permeabilidade**: adequada ao alimento embalado
- **Embalagens biodegradáveis**: garantir origem Halal do composto orgânico
- **Rótulo específico**: inclui tipo de material (ex: tipo de plástico), finalidade, instruções de uso

---

## DT 7.11 - Serviços de Alimentação e Turismo (REV 05, 39 pags)
**Categorias**: E (Serviço alimentação), H2 (Hotéis), H3 (Turismo/lazer)
**Normas base**: OIC/SMIIC 9:2019 (Turismo Halal), GSO 2055-2, SMIIC 02

### Estrutura COMPLETAMENTE DIFERENTE (Seções 6-12 + Anexo 1)
| Seção | Tema | Requisitos Únicos | Impacto Sistema |
|-------|------|-------------------|-----------------|
| 6 | Requisitos gerais serviço | Conformidade legal; Recursos visuais (anúncios/banners) sem infringir ética islâmica; TV sem conteúdo anti-ética islâmica; Certificado visível no estabelecimento; Mão de obra legalizada; Meio ambiente | 🔍 Checklist serviço |
| 7 | Requisitos Halal | Regras islâmicas em todas áreas; Químicos higienização sem risco Halal; Cosméticos banheiros sem risco Halal; **Bebidas alcoólicas proibidas nas instalações**; **Proibido fumar em áreas Halal** | 🔍 Controle estabelecimento |
| 7.7 | Banheiros | Bidê/ducha higiênica obrigatório; Piso limpo; Sabonetes sem risco Halal | 🔍 Checklist instalações |
| 8 | Alimentos Halal | Requisitos base iguais DT 7.1; Gelatina proibida sem certificado; Separação total Halal/não-Halal; Utensílios dedicados (aço inoxidável preferível) | Base |
| 9.1 | **QUARTOS (hotéis)** | Quibla sinalizada; Espaço oração (salah); Bidê/ducha; Sem álcool no frigobar; Sem arte humana/animal; TV sem conteúdo adulto; Isolamento acústico | 🔍 **Módulo hotelaria** |
| 9.2 | **Sanitários comuns** | Separados homens/mulheres; Banheiro deficientes; Portas não ocas/transparentes; Mictórios com privacidade; Quibla evitada no alinhamento | 🔍 Checklist sanitários |
| 9.3 | **Gerais hotel** | Proibido entrada produtos não-Halal em QUALQUER departamento; Lojas proibidas de vender álcool/suínos; Chave individual por porta; Áreas para animais estimação; Placas em árabe+inglês+idioma local | 🔍 Gestão hotel |
| 9.4 | **Sala de oração** | Separada homens/mulheres; Sem música próxima; Transporte para mesquitas se necessário; Alcorão disponível; Tapete/esteira (sajjada) | 🔍 Gestão oração |
| 9.5 | **Recreação** | Instalações separadas ou horário programado mulheres; Cosméticos Halal; Piscina: separada ou horário alternado homens/mulheres; SPA/massagem: pessoal mesmo sexo; Entretenimento sem violar ética islâmica | 🔍 Gestão recreação |
| 9.6 | **Bem-estar** | Separado ou horário programado mulheres; Produtos cosméticos Halal | 🔍 Gestão bem-estar |
| 9.7 | **Informações hóspedes** | Cartão informações Halal; Regras hotel conforme ética islâmica; Quibla indicada; Vestuário adequado | 🔍 Comunicação |
| 10 | **Turismo** | Itinerário compatível Shariah; Horário oração/suhoor/iftar (Ramadan); Transporte regulamentar; Transporte feminino exclusivo sob demanda; Guias com competência linguística e conhecimento Halal | 🔍 **Módulo turismo** |
| 11 | Gestão serviço Halal | HAS documentado; Alta administração responsável; Política Halal; Pessoal designado; Feedback cliente; NC auditorias resolvidas | Base |
| 12 | **Classificação** | **3 categorias de hotel Halal**: A (100% Halal), B (Halal friendly), C (Muslim friendly) | 🔍 **Sistema classificação** |
| 12.2 | **Restaurantes** | Tabela requisitos: cozinha Halal, só comida Halal, sem álcool, sem suínos, sem animais estimação, BPF | 🔍 Checklist restaurante |
| Anexo 1 | Pontos críticos | Mesma tabela 22 tipos produto | Referência cruzada |

**DIFERENÇAS ÚNICAS vs TODOS os outros DTs:**
- **Categoria totalmente diferente**: serviços, não produtos industriais
- **Turismo Halal**: conceito completo com 3 categorias (A/B/C) baseado no OIC/SMIIC 9:2019
- **Quartos hotel**: Quibla, oração, sem arte humana/animal, sem álcool frigobar, sem TV adulto
- **Piscinas/SPA**: separação por gênero obrigatória (ou horário alternado)
- **Sala de oração**: obrigatória com Alcorão, sajjadas, sem música próxima
- **Placas trilíngues**: árabe + inglês + idioma local
- **Guia turístico**: conhecimento Halal, garantir alimentação Halal, locais sem violação ética
- **Ramadan**: horário programado para suhoor e iftar
- **Entretenimento**: animações culturais não podem violar ética islâmica
- **Bebidas alcoólicas**: totalmente proibidas em todo o estabelecimento Cat. A
- **Categoria B (Halal friendly)**: álcool removido do frigobar sob solicitação
- **Classificação hotéis**: sistema de 3 níveis com tabela detalhada de requisitos obrigatórios/proibidos

---

## RESUMO CONSOLIDADO - TODOS OS 10 DTs (Pasta 5)

### Mapa de DTs por Categoria de Certificação

| Categoria | Subcategoria | DT Aplicável | Páginas |
|-----------|-------------|--------------|---------|
| A1-A2 | Fazendas animais | DT 7.7.1 | 43 |
| B1-B2 | Fazendas agrícolas | DT 7.7.2 | 42 |
| C1-C4 | Alimentos industrializados | DT 7.1 | 30 |
| D1-D2 | Ração animal | DT 7.9 | 35 |
| E | Serviço alimentação | DT 7.11 | 39 |
| F1-F2 | Distribuição | DT 7.8 | 40 |
| G1-G2 | Transporte/armazenamento | DT 7.8 | 40 |
| H1 | Serviços auxiliares | DT 7.8 | 40 |
| H2-H3 | Hotéis/turismo | DT 7.11 | 39 |
| I | Embalagem | DT 7.10 | 32 |
| J | Equipamentos | DT 7.1 (ref) | 30 |
| K | Aditivos | DT 7.1 | 30 |
| L1 | Cosméticos | DT 7.6 | 42 |
| L2 | Fármacos | DT 7.5 | 28 |
| L3 | Químicos | DT 7.4 | 29 |

### Requisitos Transversais (presentes em TODOS os DTs)
1. **Sistema Garantia Halal (HAS)** - DT 7.3 referenciado em todos
2. **Tabela de não-Halal** (Tabela 3) - idêntica em todos os DTs
3. **Comitê Halal** - líder muçulmano qualificado
4. **Análise de risco** - matriz probabilidade × severidade
5. **Auditoria interna** - mínimo anual
6. **Treinamento HAS** - obrigatório para envolvidos
7. **Rastreabilidade** - cadeia completa
8. **Purificação ritual suína** - 7 enxagues × 30s
9. **Supervisor FAMBRAS** - quando derivados animais/alto risco
10. **Selo FAMBRAS** - aprovação prévia obrigatória (IT 4.1)
11. **Anexo 1** - 22 tipos produto com pontos críticos (idêntico em todos DTs)

---

# FORMULÁRIOS DE AUDITORIA - ESTÁGIO 1 (Pasta 5)

## FM 7.7.4 - Relatórios de Auditoria Estágio 1 (10 formulários XLSX)

### Estrutura Comum (3 abas por formulário)
1. **Relatório RESUMO**: Dados empresa, time auditoria (líder + religioso + técnico), normas referência, conclusão (4 opções), plano auditoria, observações gerais, assinaturas
2. **Relatório DETALHADO**: Checklist de itens auditados com colunas: Item | C (Conforme) | NC-MAIOR | NC-MENOR | OBS | NA | Evidências
3. **ESCOPO AUDITADO**: Listagem produtos certificados (nome, código, embalagem, marca) - até 140+ linhas

### Conclusões possíveis (Resumo):
- Recomendado - Empresa apta para o Estágio 2
- Recomendado somente após encerramento das não-conformidades
- Recomendada a suspensão
- Não recomendado
- **Mandatório**: responder TODAS NC antes do Estágio 2

### Normas de Referência citadas (comum a todos):
- GSO 2055-1/2015, GSO 993/2015 (Gulf countries)
- UAE.S 2055-1/2015, UAE.S 993/2022 (UAE)
- MS 1500/2009, MS 1900/2005, MS 2300/2009 (Malaysia/JAKIM)
- MUIS-HC-S001/2005, MUIS-HC-S002/2007 (Singapore)
- KEPKABAN BPJPH 20/2023, 6/2023, 77/2023, 78/2023, KMA 748/2021 (Indonesia)
- OIC/SMIIC 1:2019, OIC/SMIIC 22:2021 (OIC countries)
- Legislações brasileiras

### Mapa dos Checklists Detalhados por DT

| Formulário | DT Ref | Categorias | Itens | Seções |
|------------|--------|------------|-------|--------|
| FM 7.7.4.1 | DT 7.1 | C1-C4, K (Industrial/Aditivos) | 46 | 5 seções: Req.Gerais Fabricação, Áreas Produção, Armazém/Transporte, Qualidade/Segurança, HAS |
| FM 7.7.4.3 | DT 7.4 | L3 (Químicos) | 61 | Similar + itens específicos químicos |
| FM 7.7.4.5 | DT 7.5 | L2 (Fármacos) | 62 | Similar + itens específicos fármacos |
| FM 7.7.4.7 | DT 7.6 | L1 (Cosméticos) | 77 | Similar + SGQ, itens específicos cosméticos |
| FM 7.7.4.9 | DT 7.7.2 | B1-B2 (Fazenda Agrícola) | 70 | 10 seções: Req.Gerais, Funcionários, Cultivo/Colheita, Equipamentos, Armazém, Limpeza, Animais Trabalho, Ambientais, Qualidade, HAS |
| FM 7.7.4.11 | DT 7.8 | F1-F2, G1-G2, H1 (Entreposto) | 48 | 5 seções: Req.Gerais Armazém, Recebimento/Expedição, Transporte, Qualidade, HAS |
| FM 7.7.4.13 | DT 7.9 | D1-D2 (Ração) | 50 | 5 seções: Req.Gerais Produção, Áreas Produção, Armazém/Transporte, Qualidade, HAS |
| FM 7.7.4.15 | DT 7.10 | I (Embalagem) | 51 | 5 seções: Req.Gerais Fabricante, Fabricação, Armazém/Transporte, Qualidade, HAS |
| FM 7.7.4.17 | DT 7.11 | E, H2-H3 (Turismo) | 81 | 7 seções: Req.Gerais Serviço, Req.Halal, Alimentos, Hotéis, Turismo, Gestão Serviço, HAS |
| FM 7.7.4.19 | DT 7.7.1 | A1-A2 (Fazenda Animal) | 60 | 11 seções: Req.Gerais, Funcionários, Equipamentos, Limpeza, Animais Trabalho, Criação, Bem-estar, Armazém, Ambientais, Qualidade, HAS |

### Itens de Auditoria - Seção HAS (comum a TODOS os formulários)
Todos os formulários incluem seção HAS com estes itens padrão:
1. HAS documentado compatível com SGQ (DT 7.3 - 6.1-6.4)
2. Política Halal assinada pela alta direção (DT 7.3 - 6.5.1, 7.1, 7.3)
3. Equipe Gestão Halal documentada com responsabilidades (DT 7.3 - 6.5.2, 8.1, 8.4)
4. Autoridades necessárias incluindo supervisor (DT 7.3 - 8.2, 8.3)
5. Treinamento Halal anual obrigatório (DT 7.3 - 6.5.3, 9.1-9.3)
6. Conteúdo treinamento: Halal/Haram/Mashbooh + PCCH (DT 7.3 - 9.1.1, 9.2.1)
7. Composição e fluxograma produtos no HAS (DT 7.3 - 6.5.4, 10.1, 10.2)
8. PCCH identificados com matriz risco probabilidade×severidade (DT 7.3 - 6.5.5, 11.1-11.6)
9. Separação completa Halal/não-Halal em todo fluxo (DT 7.1/7.3 - 7.1, 11.2)
10. Medidas preventivas/corretivas documentadas (DT 7.3 - 11.4, 11.5)
11. Metodologia auditoria interna HAS (DT 7.3 - 6.5.6, 12.1)
12. Auditoria interna anual mínima (DT 7.3 - 12.2)

### Impacto no Sistema HalalSphere 🔍

| Componente | Requisito FM 7.7.4 | Status Sistema |
|------------|-------------------|----------------|
| **Checklist dinâmico por DT** | Cada DT tem checklist diferente (46-81 itens) | 🔍 Sistema precisa gerar checklist por categoria |
| **Campos auditoria** | C/NC-MAIOR/NC-MENOR/OBS/NA/Evidências por item | 🔍 Modelo de auditoria precisa esses campos |
| **Conclusão 4 níveis** | Apto/Após NC/Suspensão/Não recomendado | 🔍 Workflow decisão pós-auditoria |
| **Escopo produtos** | Lista detalhada nome/código/embalagem/marca | 🔍 Catálogo produtos certificados |
| **Normas por mercado** | GSO, UAE, JAKIM, MUIS, BPJPH, SMIIC | 🔍 Filtro normas por país destino |
| **Time auditoria** | Líder + religioso + técnico + observadores | 🔍 Gestão equipe auditoria |
| **Rastreabilidade NC** | NC devem ser respondidas antes Estágio 2 | 🔍 Workflow NC → resposta → aprovação |

---

## FM 7.4.3 - Planos de Auditoria Estágio 1 (20 formulários XLSX: 10 presenciais + 10 remotos)

### Estrutura Comum (3 abas por formulário)
1. **PLANO - SUMÁRIO**: Dados cliente, time auditoria, objetivos, normas referência, obrigações auditado, considerações
2. **PLANO - CRONOGRAMA**: Agenda detalhada hora-a-hora com atividades, auditor responsável, setor cliente
3. **ESCOPO A SER AUDITADO**: Listagem produtos (idêntica ao FM 7.7.4)

### Diferença Presencial vs Remoto
| Aspecto | Presencial | Remoto |
|---------|-----------|--------|
| Modalidade | In loco | Online (Microsoft Teams) |
| Coluna extra cronograma | - | Ferramenta TIC/ICT |
| Teste prévio | - | 1 dia antes: teste plataforma |
| Obrigações auditado | Alimentação Halal, sala oração, sala reunião, EPIs | Evidências acordadas, horários |
| Visita site | Física | Via planta baixa ou transmissão |

### Obrigações do Auditado (Presencial) - Requisitos Importantes
1. **Estágio 1 + Golfo**: NÃO pode ser remoto (obrigatoriamente presencial)
2. **Empresa em operação**: deve estar fabricando produtos Halal no momento do Estágio 2
3. **Alimentação Halal**: para os auditores (sem suínos, sem álcool)
4. **Ambiente oração**: fornecer local para auditores rezarem
5. **Horário reza**: respeitar
6. **Sala isolada**: para reunião da equipe auditora
7. **EPIs**: providenciar para segurança dos auditores

### Cronograma Tipo - Auditoria Industrial Estágio 1 (DT 7.1)
| Etapa | Atividade | Setor |
|-------|-----------|-------|
| 1 | Reunião abertura (apresentações, metas, agenda) | Todos + alta direção |
| 2 | Visita ao site / planta baixa | Qualidade |
| 3 | Documentação Legal (alvará/licença) | Administrativo |
| 4 | APPCC (fluxograma, controles processo) | Qualidade |
| 5 | HAS - Sistema Garantia Halal (DT 7.3) + treinamento | Qualidade |
| 6 | Fichas técnicas: água processo, produtos limpeza, embalagem | Qualidade/Meio Ambiente |
| 7 | Fichas técnicas: graxas, lubrificantes (NSF) | Manutenção |
| 8 | Certificados Halal matérias-primas/insumos/auxiliares | Qualidade |
| 9 | Pausa almoço + reza | - |
| 10 | BPF: higienização, controle pragas, seleção MP, rastreabilidade | Qualidade |
| 11 | Manual BPF / Manual Qualidade | Qualidade |
| 12 | Tratamento desvios/reclamações/NC | Qualidade |
| 13 | Transporte e armazenamento | Qualidade |
| 14 | Amostragem de materiais | Qualidade |
| 15 | Rótulos + materiais publicitários | Qualidade |
| 16 | Reunião auditores (preparatória) | Auditores |
| 17 | Reunião encerramento (constatações, próximos passos) | Todos + alta direção |

### Impacto no Sistema HalalSphere 🔍
| Componente | Requisito FM 7.4.3 | Status |
|------------|-------------------|--------|
| **Geração plano auditoria** | Cronograma hora-a-hora por DT, com responsáveis | 🔍 Template automático por categoria |
| **Modalidade auditoria** | Presencial vs Remoto (com restrição Golfo) | 🔍 Flag modalidade + validação Golfo |
| **Envio antecipado** | Plano enviado 1 semana antes | 🔍 Workflow notificação automática |
| **Obrigações auditado** | Checklist pré-auditoria (alimentação, oração, EPIs) | 🔍 Checklist preparação empresa |
| **Teste TIC remoto** | 1 dia antes: teste plataforma | 🔍 Agendamento teste pré-auditoria |
| **Escopo produtos** | Lista detalhada bilíngue (PT+EN) para certificado | 🔍 Catálogo bilíngue |

---

## FM 9.3 - Formulário Preparatório de Auditoria (REV 4, DOCX)
**Propósito**: Analista de processo coleta informações/evidências para preparar auditoria Halal.

### Campos do Formulário
| Campo | Conteúdo | Impacto Sistema |
|-------|----------|-----------------|
| Nome do cliente | Empresa auditada | Base |
| Identificação (localização/SIF) | Local + registro SIF | 🔍 Planta/SIF |
| Categoria | GSO 2055-2 / SMIIC 02 | Base |
| Tipo de processo | Inicial / Manutenção / Renovação | 🔍 Tipo certificação |
| Tipo de reconhecimento | **Inclusão Golfo / Exclusão Golfo** | 🔍 Flag Golfo (impacta modalidade auditoria) |
| Número do processo | Protocolo | Base |
| Vencimento do processo | Data limite | 🔍 Deadline |
| Data da auditoria | Agendada | 🔍 Agenda |
| Duração mínima auditoria | Conforme FM 7.1.9 (cálculo) | 🔍 Cálculo automático |
| Time de auditoria | Auditores designados | 🔍 Alocação equipe |
| Modalidade/Ferramenta | In loco / Online (ferramenta) | 🔍 Modalidade |
| Contato cliente | Email + telefone | Base |
| Contato supervisor | Telefone (se aplicável) | 🔍 Supervisor FAMBRAS |
| **Anexos obrigatórios** | Relatório auditoria anterior + Fluxograma processo + **Planilha matérias-primas** | 🔍 Documentos pré-auditoria |
| **Análise laboratorial** | Não/NA / **PCR** (espécies) / **Solventes residuais** (lista) | 🔍 Gestão laudos laboratoriais |
| Outras informações | Campo livre | - |

### Requisitos Novos Identificados 🔍
1. **FM 7.1.9**: Fórmula de cálculo de duração mínima de auditoria (documento separado)
2. **PCR (Polymerase Chain Reaction)**: teste para identificar espécies animais (ex: suíno)
3. **Solventes residuais**: análise laboratorial para controle de etanol/solventes
4. **Flag Golfo**: impacta se auditoria Estágio 1 pode ser remota ou deve ser presencial
5. **Planilha matérias-primas**: deve ser anexada antes da auditoria

---

# PASTA 6 - AUDITORIA ESTÁGIO 2 (Verificação da Produção e de Registros)

**Total**: 32 arquivos PT (10 relatórios + 20 planos auditoria + 1 FM 9.3 + 1 exemplo remota)

## Estrutura Espelhada com Pasta 5
Pasta 6 contém os MESMOS tipos de formulários da Pasta 5, mas para **Estágio 2**:
- FM 7.7.4.**pares** (2,4,6,8,10,12,14,16,18,20) = Relatórios auditoria Estágio 2
- FM 7.4.4 (presenciais + remotos) = Planos auditoria Estágio 2
- FM 9.3 = Formulário preparatório (idêntico ao da Pasta 5)

## DIFERENÇAS ESTÁGIO 1 vs ESTÁGIO 2

### Foco da Auditoria
| Aspecto | Estágio 1 (Documental) | Estágio 2 (Operacional) |
|---------|----------------------|------------------------|
| **Foco** | Documentação, procedimentos, HAS | **Verificação in loco**, registros, evidências práticas |
| **Verbos** | "prevê", "documenta", "descreve" | **"evidencia"**, "mantém", "garante", "monitora" |
| **Rotulagem** | Não verificada (seção ausente) | **Seção 4 dedicada** (rótulo, selo IT 4.1, material publicitário) |
| **BPF** | Verifica existência documentos | **Verifica implementação** (instalações limpas, registros, EPIs) |
| **Rastreabilidade** | Verifica procedimento | **Simulação de rastreabilidade** (retorna dados cadeia completa) |
| **Auditoria interna** | Verifica planejamento | **Verifica execução** (auditor competente, relatório distribuído, achados corrigidos) |

### Itens de Auditoria Estágio 2 - Comparação Quantitativa
| DT | Estágio 1 | Estágio 2 | Δ | Motivo |
|----|-----------|-----------|---|--------|
| DT 7.1 (Industrial) | 46 | 49 | +3 | Rotulagem, layout, BPF detalhada |
| DT 7.4 (Químicos) | 61 | 63 | +2 | Rotulagem, instalações |
| DT 7.5 (Fármacos) | 62 | 63 | +1 | Rotulagem |
| DT 7.6 (Cosméticos) | 77 | 82 | +5 | SGQ verificação, rotulagem |
| DT 7.7.1 (Fazenda Animal) | 60 | 89 | **+29** | Verificação campo completa |
| DT 7.7.2 (Fazenda Agrícola) | 70 | 88 | **+18** | Verificação campo completa |
| DT 7.8 (Entreposto) | 48 | 76 | **+28** | Verificação instalações/transporte |
| DT 7.9 (Ração) | 50 | 60 | +10 | Produção, armazém verificados |
| DT 7.10 (Embalagem) | 51 | 62 | +11 | Fabricação, qualidade verificados |
| DT 7.11 (Turismo) | 81 | 81 | 0 | Mesmo volume (já operacional) |

### Seções EXCLUSIVAS do Estágio 2 (ausentes no Estágio 1)
1. **Rotulagem** (Seção 4 no DT 7.1 Estágio 2):
   - Conformidade rótulo com país origem/destino
   - Selo FAMBRAS conforme IT 4.1
   - Aprovação prévia materiais publicitários
   - Sem elementos contra Shariah em publicidade

2. **Verificação operacional BPF** (Seção 5):
   - Layout instalações (fluxo adequado)
   - Instalações sanitariamente adequadas
   - Registros higienização
   - Controle água com registros
   - Uniformes/EPIs limpos em bom estado
   - Área isolada descarte lixo
   - Manutenção preventiva/calibração com evidências
   - Inexistência pragas nas instalações
   - Registros seleção matérias-primas

3. **Simulação rastreabilidade** (Item 5.5):
   - Teste prático retornando dados TODA cadeia produtiva
   - Incluindo laudos microbiológicos e físico-químicos produto final

4. **Verificação auditoria interna** (Itens 6.7-6.10):
   - Auditor competente E independente
   - Deve ter acompanhado pelo menos 1 auditoria Halal
   - Relatório distribuído a todos setores + assinado alta direção
   - Achados corrigidos no prazo

### Conclusões Estágio 2 (Diferentes do Estágio 1)
| Estágio 1 | Estágio 2 |
|-----------|-----------|
| "Apta para o Estágio 2" | **"Recomendado"** (para certificação) |
| "Após NC" | "Após encerramento NC" |
| "Suspensão" | "Suspensão" |
| "Não recomendado" | "Não recomendado" |

### Impacto no Sistema HalalSphere 🔍
| Componente | Requisito Pasta 6 | Status |
|------------|------------------|--------|
| **2 checklists por DT** | Estágio 1 (documental) + Estágio 2 (operacional) | 🔍 Modelo dual de checklist |
| **Simulação rastreabilidade** | Teste prático integrado na auditoria | 🔍 Funcionalidade simulação |
| **Verificação in loco** | Foco em evidências práticas, não documentais | 🔍 Campo evidências fotográficas |
| **Rotulagem** | Verificação selo + publicidade + conformidade país | 🔍 Módulo controle rótulos |
| **Conclusão diferenciada** | Estágio 2 conclui para CERTIFICAÇÃO (não para próximo estágio) | 🔍 Workflow decisão final |
| **Exemplo remota** | FM 7.7.4.2 tem versão exemplo para auditoria remota | 🔍 Template auditoria remota |

---

## RESUMO CONSOLIDADO - PASTAS 5 E 6

### Total de Documentos Processados
| Categoria | Pasta 5 (Estágio 1) | Pasta 6 (Estágio 2) | Total |
|-----------|--------------------|--------------------|-------|
| DTs (Documentos Técnicos) | 10 PDFs (30-43 pags cada) | - (mesmos DTs) | 10 |
| FM 7.7.4 (Relatórios) | 10 XLSX (46-81 itens) | 10 XLSX (49-89 itens) | 20 |
| FM 7.4.3/7.4.4 (Planos) | 20 XLSX (pres+remoto) | 20 XLSX (pres+remoto) | 40 |
| FM 9.3 (Preparatório) | 1 DOCX | 1 DOCX (idêntico) | 1 |
| **Total documentos únicos** | **41** | **31** | **71** |

### Fluxo Completo de Auditoria
```
FM 9.3 (Preparatório) → FM 7.4.3 (Plano Est.1) → FM 7.7.4.X (Relatório Est.1)
    ↓ NC respondidas
FM 9.3 (Preparatório) → FM 7.4.4 (Plano Est.2) → FM 7.7.4.Y (Relatório Est.2)
    ↓ Conclusão: Recomendado
CERTIFICAÇÃO EMITIDA
```

---

## PASTA 1 - SOLICITAÇÃO DE CERTIFICAÇÃO

### FM 7.1.9 - Revisão da Solicitação e Cálculo Dias de Auditoria (REV 11)
**Tipo**: XLSX | **Abas**: 4 (FM 7.1.9 In loco, CALC DIAS AUDIT, Planilha1, CATEGORIAS)

#### Estrutura do Formulário (Aba Principal)
- **Informações do Fabricante**: Razão Social, CNPJ, SIF
- **Abrangência**: Gulf inclusion (Sim/Não) 🔍
- **Filiais**: Se tem subsidiárias representadas
- **Base cálculo**: Categoria produtos, QMS certificado, nº HACCP, nº funcionários maior turno

#### Confirmação da Revisão (Checklist FAMBRAS)
1. FM 7.2.1 devidamente preenchido com informações coesas e suficientes
2. FAMBRAS possui equipe técnica apta na categoria (ou pode subcontratar)
3. FAMBRAS possui reconhecimento na categoria desejada
- Classificação final: Aceito/Recusado (com justificativa se negativo) 🔍

#### 🔍 Regras de Cálculo de Duração (CRÍTICO para sistema)
- **Estágio 1 = 30% do tempo total** (máximo)
- **Estágio 2 = 70% do tempo total**
- **Tempo mínimo = meio dia de auditoria**
- **Manutenção = 1/3 da auditoria inicial** (mín. meio dia)
- **Renovação = 2/3 da auditoria inicial** (mín. meio dia)
- **Redução máximo 30%** com justificativa obrigatória
- **Estágio 1 OBRIGATORIAMENTE in loco para categorias C, D, E, I e K**

#### Tabela de Cálculo (CALC DIAS AUDIT)
| Categoria | TD (dias base) | TH (HACCP adicional) | TMS (sem SGQ) |
|-----------|---------------|---------------------|---------------|
| A | 0.75 | 0.25 | 0.25 |
| B | 0.75 | 0.25 | - |
| C | 1.50 | 0.50 | - |
| D | 1.50 | 0.50 | - |
| E | 1.00 | 0.50 | - |
| F | 1.00 | 0.50 | - |
| G | 1.00 | 0.25 | - |
| H | 1.00 | 0.25 | - |
| I | 1.00 | 0.25 | - |
| J | 1.00 | 0.25 | - |
| K | 1.50 | 0.50 | - |

#### Tabela FTE (Funcionários → Dias Adicionais)
| FTE Range | HD Adicionais |
|-----------|--------------|
| 1-19 | 0 |
| 20-49 | 0.5 |
| 50-79 | 1.0 |
| 80-199 | 1.5 |
| 200-499 | 2.0 |
| 500-899 | 2.5 |
| 900-1299 | 3.0 |
| 1300-1699 | 3.5 |
| 1700-2999 | 4.0 |
| 3000-5000 | 4.5 |
| ≥5000 | 5.0 |

#### Fórmula: Total HD = TD + TH + TMS + FTE_HD

#### 🔍 Dados Finais da Auditoria (output)
- Categoria(s) aplicável(eis)
- Supervisão do processo
- Nº auditores muçulmanos (obrigatório)
- Nº especialistas técnicos
- Duração total: Est.1 + Est.2 + X dias/filial

#### Tabela Categorias (Anexo A) - 24 subcategorias GSO 2055-2
- **A**: AI (animais carne/leite/ovos/mel), AII (piscicultura/marinhos)
- **B**: BI (plantas exceto grãos), BII (leguminosas e grãos)
- **C**: CI (animal perecível), CII (vegetal perecível), CIII (mistos), CIV (estáveis temp ambiente), CV (abate)
- **D**: DI (ração animais), DII (ração pets)
- **E**: Serviço alimentação (sem sub)
- **F**: FI (varejo/atacado), FII (corretagem/negociação)
- **G**: GI (transporte/armazenamento perecível), GII (temp ambiente)
- **H**: Serviços auxiliares (sem sub)
- **I**: Embalagem (sem sub)
- **J**: Equipamentos (sem sub)
- **K**: Bioquímicos (sem sub)

#### 🔍 Impacto no Sistema HalalSphere
1. **CertificationRequest deve capturar**: categoria, subcategoria, Gulf inclusion, nº funcionários, nº HACCP, QMS certificado, filiais
2. **Motor de cálculo automático**: implementar fórmula TD + TH + TMS + FTE_HD
3. **Split automático**: 30/70% entre estágios (com arredondamento meio dia)
4. **Regras manutenção/renovação**: 1/3 e 2/3 do tempo inicial
5. **Validação**: Estágio 1 in loco obrigatório para C, D, E, I, K

---

### FM 7.2.1.X - Formulários de Solicitação de Certificação (8 variantes)
**Tipo**: DOCX | **Variantes**: Industrial, Aves, Bovino, Industrial LATAM, Entreposto, Frigorífico LATAM, Fazenda, Turismo, Catering

#### Estrutura Comum (todas variantes)
1. **Informações do Solicitante**: Razão Social, Nome Fantasia, Endereço, CNPJ, SIF
2. **Informações do Fabricante**: (se diferente do solicitante)
3. **Contatos**: Solicitante, Legal (assina contrato), Responsável trâmites
4. **Certificações além da Halal**: Certificadora, Norma, Escopo, Validade (impacta cálculo)
5. **Escopo**: Via FM 7.2.1.5 (tabela produto/código/embalagem/marca)
6. **Informações fabricação**: Turnos, funcionários/turno, APPCC, marcas próprias/terceiros
7. **Produtos a certificar**: Anexar fichas técnicas + fluxogramas
8. **Atividades subcontratadas**: Listagem obrigatória (impacta contrato)
9. **Consultoria**: Se recebeu consultoria Halal
10. **Complexidade**: Nº matérias-primas e insumos totais 🔍
11. **Abrangência**: Mercado Interno / Exportação / Golfo

#### Variantes Específicas por Segmento 🔍
| Formulário | Segmento | Campos Específicos |
|-----------|----------|-------------------|
| FM 7.2.1.1 | Industrial | Avaliação complexidade (nº MP), marcas próprias |
| FM 7.2.1.2 | Frigorífico Aves | Listagem por tipo: frango/peru/pato inteiros, cortes, temperados, miúdos, CMS, pele |
| FM 7.2.1.3 | Frigorífico Bovino | Escopo listagem por tipo bovino |
| FM 7.2.1.4 | Industrial LATAM | Igual 7.2.1.1 com campos país LATAM |
| FM 7.2.1.7 | Entreposto/Armazém | Info unidades de armazém (simplificado) |
| FM 7.2.1.8 | Frigorífico LATAM | Igual 7.2.1.2/3 com campos LATAM |
| FM 7.2.1.9 | Fazenda/Farm | Tipo pecuária (corte/leiteiro/avicultura), capacidade, criação suíno?, cachaça/álcool na fazenda? |
| FM 7.2.1.10 | Turismo | Info unidades (simplificado) |
| FM 7.2.1.11 | Catering | Info filiais (simplificado) |

#### 🔍 Impacto no Sistema HalalSphere
1. **Formulário dinâmico**: Renderizar campos diferentes por tipo/categoria de certificação
2. **Campos condicionais**: Fazenda pergunta sobre suínos e álcool na propriedade
3. **Escopo produto**: Tabela estruturada com nome/código/embalagem/marca (FM 7.2.1.5)
4. **3 contatos obrigatórios**: Solicitante, Legal, Responsável trâmites
5. **Certificações existentes**: Lista com impacto no cálculo de dias

---

### FM 7.2.1.5 - Controle de Escopo (REV 1)
**Tipo**: XLSX | **Estrutura**: Tabela com 150 linhas para produtos

#### Colunas
- Nome do Produto (PT e EN obrigatório - EN usado no certificado)
- Código(s) do produto
- Tipo(s) e tamanho(s) de embalagem
- Marca(s)

#### 🔍 Impacto no Sistema
- Sistema deve armazenar escopo bilíngue (PT/EN) - EN vai para certificado
- Cada produto com código, embalagem e marca
- Suportar até 150 produtos por certificação

---

### IT 7.4 - Instrução de Revisão e Análise do Formulário de Solicitação (REV 6)
**Tipo**: PDF | **Páginas**: 17 | **Norma base**: GSO 2055-2:2021 + IAF MD 5:2015

#### Processo Completo de Revisão
```
Cliente solicita → FM 7.2.1.X preenchido → Resp. Técnico valida FM 7.1.9
    → Classifica pedido (Aceito/Rejeitado) → FM 7.2.3/7.2.4 (Proposta)
    → Cliente aceita → Equipe técnica → Agendamento auditoria
```

#### 🔍 Regras Detalhadas de Cálculo (complementa FM 7.1.9)
- **Fórmula**: TS = TD + TH + TMS + TFTE
- **Resultado em Homens-Dia (HD)**: 1 dia = 8 horas (máx 9h com acordo)
- **Filial = 50% da auditoria mínima** no local (não 2 estágios, só Est. 2)
- **Múltiplas categorias**: Usar a de MAIOR complexidade + 0.5 dia/HACCP adicional
- **QMS duplicado**: Se mesmo organismo valida QMS, sem tempo adicional
- **FTE**: Funcionários do maior turno (produção + manutenção + armazém + qualidade)
- **Filiais FTE**: Somar FTE de todas as filiais ao da matriz

#### 🔍 Regras de Arredondamento
- 0.8-0.9 ou 1.1-1.2 → arredonda para 1.0
- 1.3-1.4 ou 1.6-1.7 → arredonda para 1.5
- Sempre dias inteiros ou meio dia
- **Mínimo absoluto: 0.5 dia**
- Est. 1 mínimo: 0.5 dia | Est. 2 inicial mínimo: 1.0 dia

#### 🔍 Regras de Redução (IAF MD 5:2015) - máx 30%
Justificativas válidas:
- Planta muito pequena
- Alto nível maturidade sistema Halal (certificado há muitos anos)
- Alto nível automação
- Pessoas externas no turno (motoristas, vendedores)
- Processo repetitivo (linhas paralelas)
- **NÃO pode**: Usar poucos funcionários ou QMS como justificativa (já na fórmula)

#### 🔍 Ciclo de Certificação e Revisões
- **Inicial**: Est. 1 (30%) + Est. 2 (70%)
- **Manutenção (anual)**: Apenas Est. 2, 1/3 do tempo inicial (mín 0.5 dia, 1 dia cat A/B)
- **Renovação (a cada 3 anos)**: Apenas Est. 2, 2/3 do tempo inicial (mín 0.5 dia cat A/B)
- **Re-revisão FM 7.1.9**: Quando muda escopo, conquista QMS, ou altera nº funcionários
- **Supervisão**: Obrigatória para empresas com proteínas animais 🔍

#### 🔍 Equipe de Auditoria
- Mínimo 2 auditores muçulmanos (técnico + líder religioso)
- Nº auditores impacta fórmula HD (obrigatório preencher)
- Especialistas técnicos: Não impactam HD mas participam
- Responsáveis técnicos: Lina (Industrial) e Islam Zaid (Frigorífico)

---

## PASTA 2 - PROPOSTA E CONTRATO

### FM 4.1.1 - Contrato Certificado Único (REV 26)
**Tipo**: DOCX | **Variantes**: 3 (Brasil, LATAM, Logística/Armazém) + Supervisor (4 variantes) + Campanha

#### Estrutura do Contrato (15 cláusulas + 2 anexos)
- **Cláusula 1ª**: Objeto - Certificação Halal válida 3 anos, sob método de auditoria
- **Cláusula 2ª**: Valores - Processo inicial + Manutenção ano 2 + Manutenção ano 3
- **Cláusula 3ª**: Logística - CONTRATANTE arca com despesas (hospedagem, translado, alimentação)
- **Cláusula 11ª**: Vigência - 36 meses a partir da assinatura
- **Cláusula 12ª**: Restrições por país (Egito, Irã, Indonésia, EAU)
- **Cláusula 14ª**: Obrigação de informar mudanças que afetem certificação

#### 🔍 Restrições por País (CRÍTICO para sistema)
- **Egito**: NÃO PODE certificar (possui certificadora própria)
- **Irã**: Pode haver restrições (certificadora própria)
- **Indonésia**: Válido apenas para proteína animal in-natura, aditivos, matérias-primas, aromas
- **EAU**: Pode certificar mas NÃO pode usar selo FAMBRAS (apenas Marca Halal da ESMA)
- **Golfo**: Proibido insensibilização no abate

#### Anexo I - Termo de Responsabilidade
- Implementar mudanças quando determinadas pela FAMBRAS
- Fornecer relação completa de MP/insumos/auxiliares e fabricantes/fornecedores
- Manter registro de reclamações sobre conformidade Halal
- Informar mudanças: status legal, organização, método produção, produto, endereço, SGQ
- **Prazo para medidas corretivas: 30 dias** após notificação 🔍
- Layout embalagem com selo Halal deve ser aprovado pela FAMBRAS
- Certificado Halal por planta produtora (múltiplas plantas = múltiplos processos)
- Certificado por embarque via sistema online FAMBRAS 🔍

#### Anexo II - Acordo de Confidencialidade
- Sigilo absoluto sobre informações confidenciais
- Exceções: conhecimento público, exigência legal/judicial (notificar em 24h)
- Devolução de informações em 30 dias após término

#### 🔍 Variantes de Contrato
| Contrato | Uso | Diferencial |
|----------|-----|------------|
| FM 4.1.1 | Brasil | Padrão |
| FM 4.1.1.2 | América Latina | Adaptado legislação LATAM |
| FM 4.1.1.3 | Logística/Armazém/Entreposto | Simplificado |
| FM 4.1.2.1 | Supervisor Fixo - Custo Contratada | FAMBRAS paga supervisor |
| FM 4.1.2.2 | Supervisor Fixo - Custo Contratante | Empresa paga supervisor (Brasil e Paraguai) |
| FM 4.1.2.3 | Supervisor Logística | Supervisor em armazém |
| FM 4.1.2.4 | Supervisor Colômbia | Adaptado Colômbia |
| FM 4.1.3 | Campanha (hab. planta) | Supervisor por campanha R$300/dia |

---

### FM 7.2.3 - Proposta Comercial (REV 15)
**Tipo**: DOCX | **Variante**: FM 7.2.4 (Entreposto/Armazém)

#### Seções da Proposta
1. Informações Solicitante/Fabricante
2. Escopo: Referencia FM 7.2.1.5 (Controle de Escopo)
3. **Abrangência**: Mercado Interno, Arábia Saudita, EAU, demais Golfo, SE Asiático, outros
4. **Tipo de Serviço**: Inicial / Manutenção / Renovação
5. **Programa de Certificação**: Descrição atividades auditoria
6. **Cotação e Pagamento**: Valores iniciais e manutenção anual
7. **Duração auditoria**: Separado GOLFO vs outros mercados, com Est.1 e Est.2 detalhados
8. **Quadro funcionários - Supervisão**: Validação prévia pela FAMBRAS
9. **Modelo certificado**: Com supervisor (habilitação planta + certificado produto) vs sem
10. **Validade proposta**: 60 dias

#### 🔍 Impacto no Sistema
1. **Proposta deve ter seção específica para Golfo** com duração separada
2. **Supervisão de produção**: Necessária para algumas categorias (proteínas animais)
3. **Certificado por embarque**: Sistema online para emissão

---

### FM 7.2.2 - Controle de Propostas e Contratos (REV 3)
**Tipo**: XLSX | **Estrutura**: Planilha de controle com 12 colunas

#### Colunas
- Número, Data, Cliente, Esquema de Certificação
- Responsável pela proposta/contrato
- Valor certificação, Valor inicial, Valor manutenção anual
- Status do contrato, Data aprovação contrato
- Status da proposta, Data aprovação proposta

#### 🔍 Impacto: Dashboard de gestão comercial no sistema

---

### IT 4.2 - Numeração de Propostas, Contratos e Certificados (REV 6)
**Tipo**: PDF | **Páginas**: 5

#### 🔍 Regras de Numeração (CRÍTICO para sistema)

**Proposta**: `ABC.SIG.ANOMES.SEQ`
- ABC = 3 primeiras letras empresa
- SIG = Sigla cidade (tabela SIGLA.xlsx)
- ANOMES = Últimos 2 dígitos ano + mês
- SEQ = Sequencial (1, 2, 3...)
- Ex: NES.ARC.1703.02

**Contrato**: Mesmo número da proposta aceita

**Certificado Industrial**: `ABC.SIG.ANOMES.SEQQ.PAIS`
- SEQQ = 4 dígitos sequenciais
- PAIS = Sigla 3 letras (BRA, URU, ARG, COL, PAR)
- Ex: NES.ARC.1703.0604.BRA

**Certificado Frigorífico**: `ABC.SIG.ANOMES.SEQQ.NORMA.PAIS`
- NORMA = Sequencial por norma divergente
- Aves: .1=UAE, .2=GSO, .3=KEPKABAN/SMIIC/MUIS, .4=MS 1500
- Bovinos: .1=GSO+UAE, .2=KEPKABAN/SMIIC/MUIS
- Ex: SEA.SDN.2310.0830.2.BRA

**Regra importante**: Certificado muda número quando muda escopo. Manutenção sem alteração de escopo NÃO reemite certificado.

#### 🔍 Impacto no Sistema HalalSphere
1. **Geração automática de números**: Implementar lógica ABC.SIG.ANOMES.SEQ
2. **Tabela de siglas de cidades**: Importar SIGLA.xlsx
3. **Certificados por norma**: Frigoríficos podem ter múltiplos certificados (1 por conjunto de normas)
4. **Rastreabilidade**: Proposta → Contrato → Certificado (mesmo número base)

---

### FM 7.4.2.3 - Controle de Contatos (REV 1)
**Tipo**: DOCX | Registro de contatos da empresa cliente

---

## PASTA 3 - ENVIO DA DOCUMENTAÇÃO INICIAL

### FM 7.4.2.1 - Solicitação de Documentação Inicial - Industrial (REV 30)
### FM 7.4.2.2 - Solicitação de Documentação Inicial - Frigorífico (REV 16)
### FM 7.4.2.12 - Solicitação de Documentação Inicial - Armazém (REV 3)
**Tipo**: DOCX | **Variantes**: 3 (Industrial, Frigorífico, Armazém)

#### 🔍 Checklist de Documentos Obrigatórios (Industrial)
1. Cópia CNPJ + SIF (se aplicável)
2. Ficha técnica descritiva produto final (origem + ingredientes)
3. Fluxograma de produção de todos os produtos
4. **FM 7.4.2.6** - Declaração de conformidade Halal Industrial
5. **FM 7.4.2.7** - Planilha MP e Fornecedores (2 abas: MP+Insumos, Outros)
   - Enviar mín. 15 dias antes da auditoria
6. Ficha técnica de TUDO que entra em contato com produto Halal
7. Documentação Halal de todos elementos (cert. Halal ou declaração status)
   - Declaração status Halal: validade 3 anos
   - FM 7.4.2.W - Modelo declaração (PT/EN)
8. **FM 7.4.2.15** - Questionário Halal para Armazém (se usa armazém externo)
9. Ensaios laboratoriais (definidos pelo auditor):
   - **PCR**: Identificação espécies animais (suíno, bovino, galinha, ovinos)
   - **Solventes residuais**: Cromatografia gasosa (etanol, metanol, propanol, acetona)
10. Autorização uso logomarca
11. Controle uso selo Halal (com modelos rótulos)
12. 2 amostras cada produto (showroom)
13. **HAS** (DT 7.3): Sistema de Garantia Halal obrigatório pré-auditoria

#### 🔍 Laboratórios Homologados (ISO 17025)
| Laboratório | PCR | Solventes | Restrições |
|------------|-----|-----------|-----------|
| Eurofins | Sim | Sim* | *Não para matrizes animal. Código teste Itália ID087 |
| FoodChain | Sim | Não | - |
| CQA | Sim | Sim | - |
| INTECSO | Sim | Sim | - |
| SENAI | Sim | Não | - |

- Amostras enviadas em até 1 dia útil após coleta
- Resultado enviado diretamente para FAMBRAS HALAL pelo laboratório
- Lacre de amostra obrigatório (número mencionado no cadastro)

#### Diferenças Frigorífico vs Industrial
- Frigorífico pede FM 7.4.2.8 (Especificação Técnica por Família) em vez de ficha individual
- Frigorífico bovino: tinta de carimbo deve constar na planilha MP
- Frigorífico: foco em auxiliares de processo (tinta carimbo carcaça, desmoldantes)
- Armazém: versão simplificada

#### 🔍 Impacto no Sistema HalalSphere
1. **Checklist dinâmico de documentação**: 13 itens com status tracking por item
2. **Upload de documentos**: Suportar fichas técnicas, certificados Halal, declarações
3. **Prazo de envio**: FM 7.4.2.7 mín. 15 dias antes da auditoria (alerta automático)
4. **Integração laboratórios**: Rastreamento resultados PCR e solventes
5. **Validade declarações**: Controle de 3 anos para declarações de status Halal
6. **HAS obrigatório**: Bloquear agendamento de auditoria se HAS não enviado

---

## PASTA 4 - AGENDAMENTO DA AUDITORIA

### PR 7.1 - Condições de Concessão, Manutenção, Extensão, Redução, Suspensão, Cancelamento, Término e Renovação (REV 20)
**Tipo**: PDF | **Páginas**: 56 | **DOCUMENTO CENTRAL DO PROCESSO**
**Normas base**: ISO/IEC 17065:2012, GSO 2055-2:2021, IAF MD 5:2015, SMIIC 02:2019, KEPKABAN BPJPH

#### 🔍 Ciclo de Certificação (3 anos)
```
ANO 1: Auditoria Inicial (Est.1 30% + Est.2 70%) → Comitê Decisão → Certificado 3 anos
ANO 2: Manutenção 1 (apenas Est.2, 1/3 tempo) → Comitê Decisão → Revalidação
ANO 3: Manutenção 2 / Renovação (Est.2, 2/3 tempo) → Comitê Decisão → Novo Ciclo
```

#### 🔍 Condições para Concessão (seção 6)
1. FM 7.2.1.X (solicitação) considerada viável
2. Proposta (FM 7.2.3/4) aceita e assinada
3. Contrato (FM 4.1.X) assinado ATÉ emissão do certificado
4. Documentação do interessado aprovada
5. SGQ e produto Halal aprovados em Est.1 + Est.2
6. Amostras coletadas e ensaiadas (se aplicável)
7. Todas NCs sanadas (FM 7.7.5.3)
8. Pagamentos realizados nos prazos

#### 🔍 Condições para Manutenção (seção 7)
- Apenas auditoria Est.2
- NCs sanadas + parecer favorável equipe auditora
- Aprovação pelo Comitê de Decisão
- **Prazo**: Máximo 12 meses entre auditorias (atraso = suspensão)

#### 🔍 Condições para Renovação (seção 9)
- Nova FM 7.2.1.X + nova proposta + novo contrato (ou aditivo)
- Auditoria Est.2 ANTES que expire o ciclo anterior
- Renovação deve ser solicitada **6 meses antes** da expiração
- Após expiração: pode restaurar em até 6 meses se atividades completadas

#### 🔍 Fluxo Detalhado do Processo (seções 10.1 - 10.9)
```
10.1 Solicitação (FM 7.2.1.X)
  → 10.2 Análise Crítica (FM 7.1.9) - Aceito/Rejeitado
  → 10.3 Proposta (FM 7.2.3) + Contrato (FM 4.1.X)
  → 10.4 Programa de Auditoria (FM 7.1.2.1/2)
  → 10.5 Envio Documentos Obrigatórios (IT 7.12)
  → 10.6 Documentação + Análise (FM 7.4.2.1/2)
  → 10.7 Auditoria (Est.1 + Est.2)
    → 10.7.1 Duração (FM 7.1.9 - GSO 2055-2)
    → 10.7.2 Plano (FM 7.4.3.X / FM 7.4.4.X)
    → 10.7.3 Equipe (mín. 1 técnico + 1 religioso)
    → 10.7.4 Estágios (Est.1 documental → Est.2 operacional)
    → 10.7.5 Metodologia (ISO 19011)
    → 10.7.6 Encerramento NCs
  → 10.8 Ensaios Laboratoriais (PCR/Solventes)
  → 10.9 Decisão Comitê (mín. 4 pessoas, unanimidade)
    → 1º passo: Aprovação técnica
    → 2º passo: Aprovação religiosa (2 Sheikhs)
    → 3º passo: Aprovação final (RT)
  → Emissão Certificado (FM 7.7.1/2)
```

#### 🔍 Regras Críticas para o Sistema
- **Golfo**: Est.1 e Est.2 NÃO podem ser em sequência. Est.2 só após relatório Est.1 com parecer favorável
- **Relatório auditoria**: Máximo 15 dias corridos após encerramento
- **NCs resposta**: Cliente tem 7 dias corridos para responder com correções
- **NC evidências**: Prazo até vencimento do ciclo/certificado (anual)
- **Intervalo Est.1→Est.2**: Máximo 6 meses (senão repete Est.1)
- **Comitê Decisão**: Mínimo 4 pessoas (2 Sheikhs + técnico + RT), decisão por UNANIMIDADE
- **Certificado por embarque**: Via sistema online FAMBRAS (para exportação)
- **Visitas não anunciadas**: Permitidas com objetivo claro

#### 🔍 Suspensão (seção 11) - máx 3 meses (1 ano se entressafra)
Motivos:
- NC sem necessidade de revogação imediata
- Uso impróprio do certificado/marca
- Violação de regras/procedimentos
- Modificação sem concordância FAMBRAS
- Inadimplência financeira
- **Ação**: Reter documentos, proibir uso da marca, notificar acreditadores

#### 🔍 Cancelamento (seção 12)
Motivos:
- NC grave na auditoria
- Inadimplência financeira
- Suspensão sem resolução no prazo (3 meses)
- Base normativa modificada e empresa não se adequa
- Distrato
- **REGRA**: Certificados só podem ser cancelados APÓS serem suspensos (exceto distrato)

#### 🔍 Extensão de Escopo (seção 10.9.3)
- Produto idêntico (só muda nome/granulometria): Isento de auditoria e lab
- Novo fluxo de fabricação: Necessita Est.2
- Normalmente: Apenas Est.2

#### 🔍 Impacto no Sistema HalalSphere
1. **Workflow de 17 fases**: Mapear exatamente ao fluxo do PR 7.1 (10.1 a 10.9)
2. **Comitê de Decisão**: 3 passos (técnico→religioso→final) com unanimidade
3. **Status de certificação**: ATIVO/SUSPENSO/CANCELADO/EXPIRADO/EM_RENOVAÇÃO
4. **Controle de prazos**: 12 meses manutenção, 6 meses Est.1→Est.2, 15 dias relatório, 7 dias NC
5. **Restrição Golfo**: Bloqueio Est.2 antes de relatório Est.1 aprovado
6. **Extensão escopo**: Avaliar se precisa auditoria ou não (regras específicas)
7. **Certificado embarque**: Sistema online para emissão por lote
8. **Programa auditoria**: FM 7.1.2.1/2 controle vencimento e status

---

## PASTA 7 - ANÁLISE LABORATORIAL

### IT 7.6.1 - Coleta de Amostras para Análise Laboratorial (REV 3)
**Tipo**: PDF | **Páginas**: 6

#### Procedimento de Coleta
- **3 amostras sempre**: 1 para laboratório + 2 contra-amostras (retidas na empresa)
- **PCR (DNA)**: 200-400g por amostra
- **Solventes (Cromatografia)**: 500g por amostra
- **Mix de produtos**: Permitido misturar até 10 produtos para PCR (1 amostra composta)
- **Envio**: Até 1 dia útil após coleta
- **Lacre**: Numerado e obrigatório (número registrado no FM 7.6.1)
- **Relatório**: FM 7.6.1 assinado pelo auditor + representante da empresa

#### Laboratórios Homologados (ISO 17025)
| Laboratório | PCR | Solventes | Restrições |
|------------|-----|-----------|-----------|
| Eurofins | Sim | Sim* | *Não para matrizes animais (código Itália ID087) |
| FoodChain | Sim | Não | - |
| CQA | Sim | Sim | - |
| INTECSO | Sim | Sim | - |
| SENAI | Sim | Não | - |

#### Regras de Análise
- Resultado enviado diretamente pelo laboratório para FAMBRAS (não passa pelo cliente)
- Contra-amostras: usadas em caso de contestação do resultado
- Análise obrigatória na auditoria inicial; nas manutenções conforme programa
- Frigoríficos: foco em auxiliares de processo (tinta carimbo, desmoldantes)

#### 🔍 Impacto no Sistema HalalSphere
1. **Módulo de amostras**: Registrar coleta com número do lacre, quantidade, tipo (PCR/solventes)
2. **Rastreamento lab**: Status da análise (enviada/em análise/resultado recebido)
3. **Integração resultados**: Receber resultado do laboratório e vincular ao processo
4. **Contra-amostras**: Controle de retenção e validade
5. **Bloqueio**: Não avançar para comitê sem resultado laboratorial (quando aplicável)

---

## PASTA 8 - REVISÃO DO PROCESSO

### FM 7.1.2.1 - Programa de Status do Certificado (REV 14)
**Tipo**: XLSX | **Colunas**: 77 | **Capacidade**: 5010 linhas

#### Estrutura da Planilha
- **Tracking completo**: Desde solicitação até emissão do certificado
- **3 ciclos**: Inicial (Est.1 + Est.2), Manutenção 1, Renovação
- **Controles por ciclo**: Data agendamento, auditores, relatório, NCs, comitê, certificado
- **Métricas de performance**: Tempo por fase, atrasos, auditor designado
- **Controle empresa-mês**: Tracking mensal do status de cada empresa

#### Colunas Principais (agrupadas)
1. **Identificação**: Empresa, CNPJ, unidade, categoria, protocolo
2. **Proposta/Contrato**: Número, data, valor, status assinatura
3. **Auditoria Est.1**: Data, auditor técnico, auditor religioso, relatório, NCs
4. **Auditoria Est.2**: Data, auditor técnico, auditor religioso, relatório, NCs
5. **Laboratório**: Amostras enviadas, resultados, status
6. **Comitê Decisão**: Data, resultado, observações
7. **Certificado**: Número, data emissão, validade
8. **Manutenção**: Repetição das colunas acima para cada ciclo

#### 🔍 Impacto no Sistema HalalSphere
1. **Dashboard de programa**: Visão consolidada de todas as certificações e status
2. **Automação do tracking**: Preencher automaticamente conforme workflow avança
3. **Alertas de vencimento**: Controle automático de prazos por certificação
4. **Relatórios gerenciais**: Exportar dados no formato do FM 7.1.2.1
5. **KPIs**: Tempo médio por fase, taxa de aprovação, backlog de processos

---

## PASTA 9 - COMITÊ DE DECISÃO

### FM 7.1.1 - Check List de Processo (REV 10)
**Tipo**: DOCX | **Usado em**: Inicial, Manutenção, Renovação, Suspensão, Cancelamento

#### Cabeçalho do Checklist
- Tipo de processo: Inicial / Manutenção / Renovação / Alteração de escopo / Suspensão / Cancelamento
- Reconhecimento Golfo: Inclusão / Exclusão
- Dados empresa: Nome, unidade, auditores, categoria, nº certificado

#### 9 Itens de Verificação
1. Solicitação de certificação com escopo completo (FM 7.2.1.X)
2. Proposta comercial assinada
3. Contrato assinado
4. Fichas técnicas e fluxogramas conformes para Halal
5. Matérias-primas/insumos avaliados sem risco Halal
6. Análises PCR/Cromatografia aplicadas e com resultado adequado (se necessário)
7. Estágios de auditoria necessários realizados
8. Relatório de auditoria completo e coerente
9. NCs respondidas pelo cliente e fechadas pela FAMBRAS

#### Comitê de Decisão (4 pessoas, UNANIMIDADE)
| Função | Decisão |
|--------|---------|
| Revisão Técnica | Aprovado / Reprovado |
| Revisão Religiosa 1 (Sheikh) | Aprovado / Reprovado |
| Revisão Religiosa 2 (Sheikh) | Aprovado / Reprovado |
| Aprovação RT (Responsável Técnico) | Aprovado / Reprovado |

#### 🔍 Impacto no Sistema HalalSphere
1. **Tela de comitê**: Checklist dos 9 itens com status C/NC/NA por item
2. **Workflow de aprovação**: 4 aprovadores sequenciais com registro de decisão
3. **Bloqueio**: Não emitir certificado sem unanimidade (4 aprovações)
4. **Tipos de processo**: Suportar todos os tipos no mesmo formulário
5. **Auditoria trail**: Registro de quem aprovou, quando, e observações

---

## PASTA 10 - EMISSÃO E GESTÃO DO CERTIFICADO

### IT 7.10 - Preenchimento e Emissão do Certificado Halal (REV 4)
**Tipo**: PDF | **Páginas**: 21

#### 3 Modelos de Certificado
1. **FM 7.7.2 - Certificado Único** (com/sem anexo de produtos)
   - Para até 6 produtos: sem anexo
   - Para 7+ produtos: com página anexa
2. **FM 7.7.1 - Habilitação de Planta** (com/sem SIF, com/sem anexo)
   - COM SIF: para frigoríficos com registro federal
   - SEM SIF: para empresas sem registro federal

#### Variantes por Mercado
- **GAC (Golfo)**: Versão específica com reconhecimento Gulf Accreditation Center
- **Sem Golfo**: Versões por norma de reconhecimento:
  - KEPKABAN BPJPH (Indonésia)
  - MS (Malásia)
  - MUIS e SMIIC (Singapura/OIC)

#### Variantes por País (gabaritos disponíveis)
- Brasil, Argentina, Colômbia, Paraguai (cada um com seus modelos)

#### Campos do Certificado
- **Issue Date**: Data de emissão (≥ data do comitê de decisão)
- **Certificate Number**: Numeração sequencial por setor (Industrial/Frigorífico)
- **Certified Since**: Data da primeira certificação com FAMBRAS
- **Initial Certification Cycle Date**: Início do ciclo de 3 anos
- **Expiry Date**: Sempre 3 anos exatos a partir do início do ciclo (NUNCA altera)
- **Company Data**: Nome, endereço, CNPJ, SIF (se aplicável)
- **Standards**: DTs aplicáveis por categoria
- **Category**: A-K conforme GSO 2055-2
- **Scope**: Tabela de produtos (Nome, Código/Embalagem, Marca)

#### Categorias GSO no Certificado (A-K)
| Cat | Descrição | Subcategorias |
|-----|-----------|---------------|
| A | Farming of animals | - |
| B | Farming of plants | - |
| C | Food manufacturing | C1-C5 (Perishable animal/plant/mixed, Ambient, Slaughtering) |
| D | Feed production | D1 (Animal feed), D2 (Pet food) |
| E | Catering | - |
| F | Distribution | F1 (Retail/wholesale), F2 (Broking/trading) |
| G | Transport and storage | G1 (Perishable), G2 (Ambient) |
| H | Services | - |
| I | Food packaging and materials | - |
| J | Equipment manufacturing | - |
| K | Production of (Bio) Chemicals | - |

#### DTs por Tipo de Certificação
| DT | Escopo |
|----|--------|
| DT 7.1 | Industrialized food and food additive |
| DT 7.2.1 | Slaughterhouses - Poultry |
| DT 7.2.2 | Slaughterhouses - Bovine |
| DT 7.4 | Chemicals and cleaning agents |
| DT 7.5 | Drugs and medications |
| DT 7.6 | Personal hygiene, cosmetics, perfumes |
| DT 7.7 | Farms |
| DT 7.8 | Warehouse, transportation, distribution |
| DT 7.10 | Packaging materials and wrappers |

#### Regras de Emissão
- Certificado SEMPRE salvo como PDF protegido (senha padrão Fambras2018)
- Proteção: impedir cópia, permitir apenas impressão e leitor de tela
- Produtos a granel: sem obrigatoriedade de marca
- Plantas 100% Halal: sem obrigatoriedade de código/embalagem
- Exceções: somente mediante liberação do Responsável Técnico

#### 🔍 Impacto no Sistema HalalSphere
1. **Geração automática de certificado**: Template engine com os 3 modelos
2. **Seleção automática de gabarito**: Com base em país + SIF + Golfo + quantidade de produtos
3. **Validação de datas**: Issue Date ≥ data comitê, Expiry = Cycle Start + 3 anos
4. **Certified Since**: Campo calculado (data do primeiro certificado da empresa)
5. **PDF protegido**: Gerar certificado com proteção contra edição/cópia
6. **Multi-país**: Suportar gabaritos BR/AR/CO/PY
7. **Multi-norma**: Selecionar DTs e categorias automaticamente pelo escopo
8. **Versionamento**: Emitir novo certificado ao alterar escopo mantendo datas do ciclo

---

## PASTA 11 - USO DO SELO HALAL

### PR 4.1 - Condições para Uso de Certificados e Marcas de Conformidade (REV 10)
**Tipo**: PDF | **Páginas**: 9

#### Regras Gerais
- Marca de conformidade: propriedade exclusiva da FAMBRAS Halal
- Uso permitido apenas durante vigência do certificado
- Layout de TODAS embalagens com selo: aprovação prévia obrigatória pela qualidade
- Publicidade com selo: aprovação prévia obrigatória
- **UAE**: Proibido selo FAMBRAS → usar apenas "Emirates Quality Mark"
- Habilitação de planta: selo SOMENTE em produções acompanhadas por supervisor muçulmano
- Selo NÃO é obrigatório - empresa pode optar por não usar
- Empresa pode usar selo próprio, arcando com ônus

#### Uso Abusivo (penalidades)
- Uso antes de assinar contrato
- Uso após término/suspensão/cancelamento
- Uso em produtos fora do escopo
- Uso em país que exige marca específica (UAE)
- Uso em itens contra valores islâmicos
- Tradução não autorizada do certificado

#### Penalidades Progressivas
1. Aviso
2. Suspensão da certificação (sem rescisão contratual)
3. Cancelamento da certificação (com rescisão contratual)
4. Término da certificação (sem rescisão contratual)

### IT 4.1 - Instrução para Uso do Selo de Garantia FAMBRAS Halal (REV 13)
**Tipo**: PDF | **Páginas**: 13

#### Versões do Selo
- **Matriz (Brasil)**: Selo padrão FAMBRAS Halal
- **Filiais (Colômbia, Paraguai)**: Selo com identificação da filial
- **UAE**: Emirates Quality Mark (MOIAT) - adquirido por produto via site gov

#### Regras de Aplicação
- Tamanho mínimo e máximo definidos (com especificações visuais)
- Versões: Cromia (CMYK), Pantone, P&B, fundo escuro, etiqueta
- Cores: podem variar desde que mantenham legibilidade (aprovação prévia)
- Selo em embalagem primária (com rótulo/identificação do produto)
- Granel: sem obrigatoriedade de selo (sugestão apenas no laudo)
- Marcas próprias: permitido desde que produzido em planta Halal certificada

#### Controle de Uso
- **FM 7.4.2.4**: Declaração da empresa sobre quais produtos aplicam o selo
  - Tabela: Nome do Produto, Código, Embalagens, Marcas
  - Compromisso de enviar artes para aprovação prévia
  - Compromisso de retirar selo após término da certificação
- **FM 4.3.1**: Verificação periódica do uso da marca
  - Monitoramento em pontos de venda e websites
  - Campos: Data, Empresa, Produto, Local, Avaliação, Ação, Correção

### 🔍 Impacto no Sistema HalalSphere
1. **Controle de selo por produto**: Registrar quais produtos aplicam selo e versão
2. **Workflow de aprovação de arte**: Upload de layout → análise qualidade → aprovação/rejeição
3. **Restrição UAE**: Alertar/bloquear selo FAMBRAS para exportação UAE
4. **Monitoramento**: Registro de verificações periódicas de uso do selo
5. **Notificação automática**: Alertar empresa sobre retirada do selo ao término/suspensão
6. **Marca própria**: Rastrear uso do selo em marcas de terceiros fabricadas na planta

---

## PASTA 12 - PROCESSO DE CANCELAMENTO E SUSPENSÃO

### FM 7.1.1 - Check List de Processo para Suspensão/Cancelamento (REV 10)
**Tipo**: DOCX | **Mesmo formulário da Pasta 9, com tipo "Suspensão" ou "Cancelamento" selecionado**

#### Tipos de Processo Suportados
- Inicial, Manutenção, Renovação, Alteração de escopo, **Suspensão**, **Cancelamento**
- Reconhecimento Golfo: Inclusão / Exclusão separadamente

#### Diferencial para Suspensão/Cancelamento
- Mesmos 9 itens de verificação, mas o comitê avalia o motivo da suspensão/cancelamento
- Comitê de 4 pessoas com unanimidade obrigatória também para suspender/cancelar

### FM 7.8.1.S / FM 7.8.2.S - Lista de Sites (Industrial / Frigorífico)
**Tipo**: XLSX | **Campos**: Nome empresa, Endereço, Tipo produto, Nº certificado, Reconhecimento Golfo

#### Finalidade
- Controle das plantas/sites que tiveram certificação suspensa ou cancelada
- Separação por setor: Industrial (FM 7.8.1.S) e Frigorífico (FM 7.8.2.S)

### 🔍 Impacto no Sistema HalalSphere
1. **Status de certificação**: Fluxo ATIVO → SUSPENSO → CANCELADO com registro de motivo
2. **Comitê para suspensão**: Mesmo workflow de 4 aprovações
3. **Controle de sites afetados**: Listar todas as plantas impactadas
4. **Notificações**: Alertar acreditadores e partes interessadas sobre suspensão/cancelamento
5. **Restrição Golfo**: Separar inclusão/exclusão do reconhecimento GAC

---

## PASTA 13 - INCLUSÃO DE PRODUTO / ALTERAÇÃO DO PROCESSO

### IT 7.8 - Alteração de Escopo de Certificado Halal Vigente (REV 2)
**Tipo**: PDF | **Páginas**: 4

#### Redução de Escopo
- Por decisão da FAMBRAS (não atende requisitos) ou solicitação do cliente
- **Documentos**: FM 7.2.1.X com escopo atualizado (excluindo produto) + justificativa por e-mail
- **Resultado**: Emissão de novo certificado com escopo atualizado
- **Obrigação**: Retirar selo Halal dos produtos removidos a partir da data de aprovação

#### Extensão de Escopo (Inclusão de Produtos)
- **Documentos obrigatórios**:
  1. FM 7.2.1.X com escopo completo (vigente + novos produtos)
  2. Ficha técnica + fluxograma do novo produto
  3. FM 7.4.2.7 atualizado se novas matérias-primas + fichas técnicas + certificados Halal
- **Avaliação pelo RT**: Se novo processo de produção → auditoria Est.2 obrigatória
- **Formalização**: Novo certificado com escopo atualizado
- **Selo**: Só após concessão da extensão + aprovação de arte pela qualidade

### FM 7.2.1.5 - Controle de Escopo (REV 1)
**Tipo**: XLSX | **Mesmo formulário da Pasta 1** - Planilha de controle do escopo de produtos

### FM 7.4.2.9 - Planilha MP e Fornecedores (REV 7)
**Tipo**: XLSX | **Lista de matérias-primas e fornecedores** para avaliação Halal

### 🔍 Impacto no Sistema HalalSphere
1. **Workflow de extensão**: Solicitação → Análise documental → Decisão (com/sem auditoria)
2. **Workflow de redução**: Solicitação → Justificativa → Aprovação RT → Novo certificado
3. **Avaliação automática**: Se novo fluxo de produção detectado → exigir Est.2
4. **Certificado versionado**: Emitir nova versão mantendo datas do ciclo
5. **Integração MP**: Planilha de matérias-primas com avaliação de risco Halal
6. **Rastreabilidade**: Histórico de todas alterações de escopo por certificação

---

## PASTAS 14-19 - MANUTENÇÃO 1 (Ciclo Ano 2)

### Resumo do Fluxo de Manutenção
As Pastas 14-19 documentam o processo de Manutenção 1 (supervisão Ano 2 do ciclo). Os documentos são majoritariamente referências ao processo inicial, com as seguintes diferenças:

#### Pasta 14 - Solicitação Documental (Manutenção)
- Repete FM 7.4.2.1 (documentação inicial), **excluindo** documentos legais da empresa
- Atualização de certificados Halal de matérias-primas conforme vencimento
- Não necessita nova solicitação de certificação (FM 7.2.1.X)

#### Pasta 15 - Agendamento de Auditoria (Manutenção)
- Mesmo procedimento do agendamento inicial
- **Diferença**: Apenas auditoria Est.2 (sem Est.1)
- Analista define auditor baseado em: tipo de cliente, formação acadêmica, afinidade setorial
- Verificação de disponibilidade no calendário de auditoria

#### Pasta 16 - Auditoria Estágio 2 (Manutenção)
- Mesmo plano e relatório do Est.2 inicial (Pasta 6)
- Tempo de auditoria: **1/3 do tempo inicial** (conforme FM 7.1.9)

#### Pasta 17 - Análise Laboratorial (Manutenção)
- Mesmo procedimento do processo inicial (Pasta 7)
- Aplicabilidade conforme programa de auditoria

#### Pasta 18 - Comitê de Decisão (Manutenção)
- Mesmo procedimento do comitê inicial (Pasta 9)
- 4 pessoas, unanimidade, 3 passos (técnico → religioso → RT)

#### Pasta 19 - Pagamento (Manutenção)
- Cobrança conforme proposta comercial aceita
- Pagamento: boleto, NF ou fatura (conforme alinhado)
- Responsáveis: Halima (Industrial) ou Aline (Frigorífico)
- Solicitação de autorização de pagamento → acompanhamento financeiro

### 🔍 Impacto no Sistema HalalSphere
1. **Workflow de manutenção**: Reusar workflow inicial sem fases Est.1, proposta e contrato
2. **Documentação simplificada**: Checklist reduzido (sem docs legais)
3. **Cálculo automático tempo**: 1/3 do tempo inicial para manutenção
4. **Controle de vencimento**: Alertar sobre certificados Halal de MP vencendo
5. **Faturamento recorrente**: Cobrança automática conforme proposta aceita

---

## PASTA 20 - MANUTENÇÃO 2

### Manutenção 2 (Supervisão Ano 3 / Renovação)
- **Idêntica à Manutenção 1** em procedimento
- Diferença de tempo de auditoria: **2/3 do tempo inicial** (conforme FM 7.1.9)
- Referência ao PR 7.1, seções 7 e 10.10

### 🔍 Impacto no Sistema HalalSphere
1. **Mesmo workflow da Manutenção 1**, ajustando tempo de auditoria
2. **Alerta de renovação**: 6 meses antes do vencimento do ciclo

---

## PASTA 21 - RENOVAÇÃO

### Processo de Renovação (Novo Ciclo de 3 Anos)
- Referência ao PR 7.1, seções 9 e 13
- **Diferenças do processo inicial**:
  - Nova FM 7.2.1.X (solicitação de certificação)
  - Nova proposta comercial (FM 7.2.3/4) + novo contrato (ou aditivo)
  - Auditoria Est.2 ANTES da expiração do certificado
  - Solicitação deve ser feita **6 meses antes** da expiração
  - Pós-expiração: pode restaurar em até 6 meses se atividades foram completadas

### 🔍 Impacto no Sistema HalalSphere
1. **Workflow de renovação**: Similar ao inicial, mas sem Est.1 (apenas Est.2)
2. **Alerta automático**: 6 meses antes do vencimento para iniciar renovação
3. **Janela de restauração**: Até 6 meses pós-expiração com condições
4. **Novo ciclo**: Gerar novo certificado com ciclo de 3 anos a partir da decisão

---

## PASTAS 22-24 - EXEMPLOS CLIENTE (Bovino, Ave, Industrial)
**Pastas vazias** - Destinadas a conter exemplos de processos reais de clientes por segmento.
Não há documentos para análise.

---

## PASTA 25 - RELATÓRIOS SUPERVISORES

### Visão Geral
Relatórios utilizados por supervisores muçulmanos que acompanham produção in loco em frigoríficos e plantas industriais com habilitação de planta. **7 formulários** identificados.

### FM 20.1 - Relatório de Ocorrências Aves (REV 4)
**Tipo**: DOCX | **Envio**: Diário

#### Campos
- **Identificação**: Empresa, cidade, SIF, data, nome supervisor
- **Abate mecânico**: Condições do abate mecânico (Sim/Não + descrição)
- **Insensibilização**: Condições (Sim/Não + descrição)
- **Paradas de linha**: Quantidade, se ocasionada por processo Halal, morte de aves, mecanismo de proteção
- **Aves vivas/mal sangradas**: Passaram pelo tanque de escaldagem? Retiradas antes?
- **Outros**: Campo livre para ocorrências adicionais + evidências (fotos)
- **Correção/Ação corretiva**: Ação adotada pelo supervisor

#### Destinatários por Unidade
- Seara/JBS: qualidade@fambrashalal.com.br + mohamed.elsharif@
- BRF e outras: qualidade@fambrashalal.com.br + adel@

### FM 20.2 - Registro de Ocorrências Internas (REV 1)
**Tipo**: DOCX | **Envio**: Diário

#### Campos
- **Identificação**: Empresa, SIF, data, supervisor, presença na unidade (Sim/Não)
- **Matérias-primas**: Recebimento, certificado Halal acompanhando MP cárnea, aprovação prévia
- **Produção**: Houve produção Halal? Detalhes
- **Outros**: Campo livre + evidências
- **Correção/Ação corretiva**: Ação do supervisor

### FM 7.1.3.1 - Relatório Acompanhamento Fabricação Produtos Industrializados à Base de Carne (REV 4)
**Tipo**: DOC (legado) | **Uso**: Supervisão de produção de cárneos industrializados

### FM 7.1.3.2 - Relatório Acompanhamento Fabricação Produtos Industrializados sem Carne (REV 3)
**Tipo**: DOC (legado) | **Uso**: Supervisão de produção sem carne

### FM 7.1.3.3 - Relatório Acompanhamento Fabricação Produtos Tripas (REV 6)
**Tipo**: XLSX | **68 linhas, 16 colunas**

#### Estrutura
- **Identificação**: Empresa, SIF, supervisor, datas/horários
- **Informações produção**: Data/hora início e fim, número do pedido/invoice
- **Matérias-primas tripas**: Hidratação, calibração, salga
- **Rastreamento**: Código, produto, peso, embalagem

### FM 7.1.3.5 - Relatório Acondicionamento Produtos Industrializados à Base de Proteínas Animais (REV 3)
**Tipo**: DOC (legado) | **Uso**: Supervisão de acondicionamento

### FM 7.1.3.6 - Inventário de Acompanhamento de Rotulagem (REV 3)
**Tipo**: XLSX | **88 linhas, 20 colunas**

#### Estrutura
- **Produto Final sem Rótulo**: Código interno, nome, data produção, nº latas, peso líquido
- **Produto Final com Rótulo**: Código, nome, data rotulagem, nº latas, peso
- **Embarque**: Nº pedido, data embarque, nº latas
- **Descartados**: Com e sem rótulo (latas descartadas/amostras)
- **Estoque**: Com e sem rotulagem (nº latas, peso)
- **Fórmulas**: Cálculos automáticos de peso e balanço

### FM 7.1.3.7 - Relatório de Verificação de Limpeza (REV 1)
**Tipo**: DOCX | **Uso**: Verificação pré-produção

#### Estrutura
- **Identificação produção**: Data, horário início
- **Identificação produto**: Nome, embalagem, peso, código, código Juliano
- **Checklist de limpeza**: C/NC por equipamento/setor
  - Triturador, Elevador, Cozinhador, Moedor, Carretinha, Misturador (desossa/conserva)
- **Declaração**: Supervisor confirma verificação de TODOS equipamentos e utensílios
- **Assinatura**: Supervisor muçulmano + data

### 🔍 Impacto no Sistema HalalSphere
1. **Módulo de supervisão**: Relatórios diários digitais por tipo (aves, cárneos, tripas, limpeza)
2. **Formulários dinâmicos**: Diferentes campos por tipo de supervisão
3. **Envio automático**: Notificação diária para destinatários por unidade/empresa
4. **Evidências**: Upload de fotos vinculadas ao relatório
5. **Rastreamento produção**: Controle de lotes, embarques, rotulagem, estoque
6. **Checklist de limpeza**: Verificação pré-produção com registro C/NC por equipamento
7. **Auditoria trail**: Quem preencheu, quando, assinatura digital

---
---

# RESUMO CONSOLIDADO E GAP ANALYSIS

## Documentos Analisados por Pasta

| Pasta | Tema | Documentos | Chave |
|-------|------|-----------|-------|
| 1 | Solicitação de Certificação | FM 7.1.9, FM 7.2.1.X (8 variantes), FM 7.2.1.5, IT 7.4 | Cálculo dias auditoria, formulários solicitação |
| 2 | Proposta e Contrato | FM 4.1.1, FM 7.2.3, FM 7.2.2, IT 4.2, FM 4.1.3 | Contrato, numeração, proposta comercial |
| 3 | Documentação Inicial | FM 7.4.2.1/2/12 | Checklists documentação por segmento |
| 3.1 | Documentos da Qualidade | **DEFERIDO** (ignorado por instrução do usuário) | - |
| 4 | Agendamento de Auditoria | PR 7.1 (56 pg) | DOCUMENTO CENTRAL - ciclo completo |
| 5 | Auditoria Estágio 1 | DTs 7.1-7.11, FM 7.4.3.X, FM 7.7.5.3, IT 7.12 | Requisitos normativos, planos, relatórios, NCs |
| 6 | Auditoria Estágio 2 | FM 7.4.4.X, FM 7.5.1, FM 7.5.2, FM 7.7.5.4 | Planos, relatórios, checklist operacional |
| 7 | Análise Laboratorial | IT 7.6.1 | Coleta amostras, labs homologados |
| 8 | Revisão do Processo | FM 7.1.2.1 | Programa status certificado (77 colunas) |
| 9 | Comitê de Decisão | FM 7.1.1 | Checklist 9 itens + comitê 4 pessoas |
| 10 | Emissão Certificado | IT 7.10, gabaritos (16+ templates) | 3 modelos, multi-país, multi-norma |
| 11 | Uso do Selo | PR 4.1, IT 4.1, FM 7.4.2.4, FM 4.3.1 | Regras selo, UAE, monitoramento |
| 12 | Cancelamento/Suspensão | FM 7.1.1, FM 7.8.1.S/2.S | Mesmo checklist, lista sites afetados |
| 13 | Inclusão/Alteração | IT 7.8, FM 7.2.1.5, FM 7.4.2.9 | Extensão/redução escopo, MP |
| 14-19 | Manutenção 1 | Referências ao processo inicial | Apenas Est.2, 1/3 tempo |
| 20 | Manutenção 2 | Idem Manutenção 1 | 2/3 tempo |
| 21 | Renovação | Referência PR 7.1 seções 9/13 | Novo ciclo, nova solicitação |
| 22-24 | Exemplos Cliente | **VAZIAS** | - |
| 25 | Relatórios Supervisores | FM 20.1/2, FM 7.1.3.1/2/3/5/6/7 | 7 formulários supervisão diária |

## Total de Documentos Únicos Analisados
- **DTs (requisitos normativos)**: 11 documentos (DT 7.1 a DT 7.11)
- **FMs (formulários)**: ~35 formulários únicos
- **ITs (instruções de trabalho)**: 7 instruções
- **PRs (procedimentos)**: 2 procedimentos (PR 7.1, PR 4.1)
- **Total**: ~55 documentos únicos analisados

## GAP ANALYSIS - Funcionalidades Críticas

### 1. CÁLCULO DE DIAS DE AUDITORIA (FM 7.1.9 + IT 7.4)
**Status**: ❌ Não implementado
**Criticidade**: ALTA
- Motor de cálculo com: categorias A-K, FTE por faixas, TD+TH+TMS+FTE_HD
- Arredondamento: 0.8-0.9→1.0, 1.3-1.4→1.5
- Split: 30% Est.1 / 70% Est.2
- Manutenção: 1/3 tempo, Renovação: 2/3 tempo
- Redução máxima: 30% com justificativa (IAF MD 5)
- Filial: 50% do tempo da matriz
- Múltiplas categorias: usar a de maior complexidade

### 2. NUMERAÇÃO DE DOCUMENTOS (IT 4.2)
**Status**: ⚠️ Parcialmente implementado (protocolo HS-YYYY-NNNNNN existe)
**Criticidade**: ALTA
- Proposta: ABC.SIG.ANOMES.SEQ
- Contrato: Mesmo número da proposta aceita
- Certificado Industrial: ABC.SIG.ANOMES.SEQQ.PAIS
- Certificado Frigorífico: ABC.SIG.ANOMES.SEQQ.NORMA.PAIS
- Diferenciar numeração por setor e norma

### 3. COMITÊ DE DECISÃO (FM 7.1.1)
**Status**: ⚠️ CommitteeDecision existe no modelo, mas falta workflow completo
**Criticidade**: ALTA
- 3 passos sequenciais: Técnico → Religioso (2 Sheikhs) → RT
- UNANIMIDADE obrigatória (4 aprovações)
- 9 itens de checklist com status C/NC/NA
- Suportar TODOS os tipos: Inicial, Manutenção, Renovação, Suspensão, Cancelamento

### 4. GERAÇÃO DE CERTIFICADO (IT 7.10)
**Status**: ❌ Não implementado
**Criticidade**: ALTA
- 3 modelos: Certificado Único, Habilitação de Planta (com/sem SIF)
- Variantes por mercado: GAC, KEPKABAN, MS, MUIS/SMIIC
- Variantes por país: BR, AR, CO, PY
- 16+ templates de gabaritos
- PDF protegido (contra cópia)
- Tabela de produtos no escopo (nome, código, marca)
- Campos calculados: Certified Since, Cycle Date, Expiry Date

### 5. CONTROLE DE ESCOPO (IT 7.8)
**Status**: ⚠️ Modelo Product existe, mas falta workflow de extensão/redução
**Criticidade**: MÉDIA
- Extensão: Avaliação se precisa Est.2 (novo fluxo) ou não (mesmo fluxo)
- Redução: Justificativa + novo certificado
- Emissão de novo certificado ao alterar escopo

### 6. ANÁLISE LABORATORIAL (IT 7.6.1)
**Status**: ⚠️ Parcialmente (AiAnalysis existe, lab tracking não)
**Criticidade**: MÉDIA
- Registro de coleta: lacre, quantidade, tipo (PCR/solventes)
- 5 labs homologados com restrições por tipo
- Rastreamento de resultado (enviado → em análise → recebido)
- Contra-amostras
- Bloqueio: não avançar sem resultado

### 7. CONTROLE DE SELO HALAL (PR 4.1 + IT 4.1)
**Status**: ❌ Não implementado
**Criticidade**: MÉDIA
- Registro de quais produtos usam selo
- Workflow de aprovação de arte/embalagem
- Restrição UAE (Emirates Quality Mark)
- Monitoramento periódico em PDV e websites
- Penalidades progressivas (Aviso → Suspensão → Cancelamento)

### 8. FORMULÁRIOS DE SOLICITAÇÃO SEGMENTADOS (FM 7.2.1.X)
**Status**: ⚠️ CertificationRequest existe, mas sem variantes por segmento
**Criticidade**: MÉDIA
- 8 variantes: Industrial, Aves, Bovino, Fazenda, Turismo, Catering, etc.
- Campos dinâmicos por segmento (ex: suíno, álcool para Fazenda)
- 11 seções no formulário padrão

### 9. RELATÓRIOS DE SUPERVISÃO (FM 20.1/2, FM 7.1.3.X)
**Status**: ❌ Não implementado
**Criticidade**: MÉDIA (somente para habilitação de planta)
- 7 tipos de relatório diário
- Formulários dinâmicos por tipo (aves, cárneos, tripas, limpeza)
- Upload de evidências (fotos)
- Envio automático para destinatários

### 10. CONTRATO E PROPOSTA (FM 4.1.1 + FM 7.2.3)
**Status**: ⚠️ Modelo Contract/Proposal existe parcialmente
**Criticidade**: MÉDIA
- 15 cláusulas contratuais + 2 anexos (responsabilidade + confidencialidade)
- Restrições por país (Egito, Irã, Indonésia, UAE)
- Proposta com campanhas (FM 4.1.3)
- Controle de assinaturas

### 11. PROGRAMA DE AUDITORIA (FM 7.1.2.1)
**Status**: ⚠️ Parcialmente (tracking existe, mas não no nível de 77 colunas)
**Criticidade**: MÉDIA
- Dashboard consolidado de todas certificações
- Tracking completo por ciclo (Inicial, Manutenção 1, Renovação)
- Métricas de performance por auditor e empresa

### 12. RESTRIÇÕES DO GOLFO / GAC (PR 7.1)
**Status**: ⚠️ Parcialmente (campo Gulf recognition existe)
**Criticidade**: ALTA
- Est.1 e Est.2 NÃO podem ser em sequência para Golfo
- Est.2 só após relatório Est.1 com parecer favorável
- Est.1 obrigatoriamente in loco para categorias C, D, E, I, K
- Gabarito específico GAC para certificado

### 13. CHECKLIST DE DOCUMENTAÇÃO (FM 7.4.2.1/2/12)
**Status**: ❌ Não implementado
**Criticidade**: MÉDIA
- 13 itens com tracking de status por item
- Diferenciação por segmento (Industrial, Frigorífico, Armazém)
- Prazo: mínimo 15 dias antes da auditoria
- HAS obrigatório

## Priorização Recomendada (por impacto no fluxo)

### Prioridade 1 - Bloqueantes para Operação
1. Comitê de Decisão (workflow 4 aprovações + unanimidade)
2. Geração de Certificado (templates + PDF protegido)
3. Cálculo de Dias de Auditoria (motor de regras)
4. Restrições Golfo/GAC (bloqueios no workflow)

### Prioridade 2 - Operação Completa
5. Numeração de Documentos (padrão FAMBRAS)
6. Controle de Escopo (extensão/redução)
7. Análise Laboratorial (tracking completo)
8. Formulários Segmentados

### Prioridade 3 - Funcionalidades Complementares
9. Controle de Selo Halal
10. Contrato/Proposta completo
11. Programa de Auditoria (dashboard)
12. Checklist de Documentação
13. Relatórios de Supervisão

