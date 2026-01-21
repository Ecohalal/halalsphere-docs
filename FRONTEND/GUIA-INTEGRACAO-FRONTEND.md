# Guia de Integração Frontend - Módulo de Certificações

**Versão:** 1.0
**Data:** 2026-01-20
**Backend:** NestJS + Prisma + PostgreSQL

---

## 1. Visão Geral

Este guia documenta a integração do frontend com a nova API de Certificações do HalalSphere. A arquitetura foi reestruturada de **Request-centric** para **Certification-centric**.

### 1.1 Mudança de Paradigma

| Antes (Request-centric) | Depois (Certification-centric) |
|------------------------|-------------------------------|
| Request → Process → Certificate | Certification → CertificationRequest → RequestWorkflow → Certificate |
| Cada request era independente | Requests são vinculados a uma Certification |
| Escopo estava no Request | Escopo está na Certification (CertificationScope) |
| Timeline fragmentada | Timeline unificada por Certification |

### 1.2 Arquivos de Integração

```
FRONTEND/
├── types/
│   └── certification.types.ts    # Interfaces TypeScript
├── api/
│   └── certification.api.ts      # Serviços de API
└── GUIA-INTEGRACAO-FRONTEND.md   # Este documento
```

---

## 2. Estrutura de Dados

### 2.1 Entidade Principal: Certification

```typescript
interface Certification {
  id: string;
  certificationNumber: string;  // Formato: HS-YYYY-NNNNN
  companyId: string;
  certificationType: CertificationType;  // C1-C5
  status: CertificationStatus;
  analystId?: string;
  validFrom?: Date;
  validUntil?: Date;

  // Relações
  company?: Company;
  scope?: CertificationScope;
  requests?: CertificationRequest[];
  certificates?: Certificate[];
  history?: CertificationHistory[];
}
```

### 2.2 Fluxo de Solicitação

```
┌─────────────────┐
│  Certification  │
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────────────┐
│  CertificationRequest   │  (nova, renovação, manutenção, etc.)
└────────┬────────────────┘
         │ 1:1
         ▼
┌─────────────────┐
│ RequestWorkflow │  (controle de fases e aprovações)
└─────────────────┘
```

### 2.3 Tipos de Solicitação (RequestType)

| Tipo | Descrição | Fases | Pré-preenchimento |
|------|-----------|-------|-------------------|
| `nova` | Nova certificação | 14 | Não |
| `inicial` | Certificação inicial | 14 | Não |
| `renovacao` | Renovação de certificação | 8 | Sim (dados existentes) |
| `ampliacao` | Ampliação de escopo | 10 | Sim (escopo atual) |
| `manutencao` | Manutenção/ajuste menor | 6 | Sim |
| `adequacao` | Adequação/correção | 6 | Sim |

---

## 3. Endpoints da API

### 3.1 Certifications

| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| GET | `/certifications` | Listar certificações | todos |
| GET | `/certifications/:id` | Detalhes | todos |
| GET | `/certifications/:id/scope` | Escopo completo | todos |
| GET | `/certifications/:id/timeline` | Histórico | todos |
| GET | `/certifications/statistics` | Estatísticas | analista+ |
| GET | `/certifications/expiring` | Expirando | analista+ |
| POST | `/certifications` | Criar | analista+ |
| PUT | `/certifications/:id` | Atualizar | analista+ |
| PATCH | `/certifications/:id/status` | Atualizar status | analista+ |
| PATCH | `/certifications/:id/analyst` | Atribuir analista | gestor+ |
| PUT | `/certifications/:id/scope` | Atualizar escopo | analista+ |

### 3.2 Certification Requests

| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| GET | `/certification-requests` | Listar | todos |
| GET | `/certification-requests/:id` | Detalhes | todos |
| GET | `/certification-requests/protocol/:protocol` | Por protocolo | todos |
| POST | `/certification-requests` | Criar solicitação | empresa+ |
| PUT | `/certification-requests/:id` | Atualizar (rascunho) | empresa+ |
| PATCH | `/certification-requests/:id/submit` | Enviar para análise | empresa+ |
| PATCH | `/certification-requests/:id/review` | Iniciar análise | analista+ |
| PATCH | `/certification-requests/:id/approve` | Aprovar | analista+ |
| PATCH | `/certification-requests/:id/reject` | Rejeitar | analista+ |
| PATCH | `/certification-requests/:id/cancel` | Cancelar | empresa+ |

### 3.3 Workflows

| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| GET | `/workflows` | Listar | analista+ |
| GET | `/workflows/:id` | Detalhes | todos |
| GET | `/workflows/request/:requestId` | Por solicitação | todos |
| GET | `/workflows/flow/:requestType` | Info do fluxo | todos |
| GET | `/workflows/:id/next-phases` | Próximas fases | todos |
| PATCH | `/workflows/:id` | Atualizar | analista+ |
| PATCH | `/workflows/:id/assign-analyst` | Atribuir analista | gestor+ |
| PATCH | `/workflows/:id/assign-auditor` | Atribuir auditor | gestor+ |
| PATCH | `/workflows/:id/advance` | Avançar fase | varia |

### 3.4 Scope (Escopo)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/certifications/:id/scope` | Escopo completo |
| GET | `/certifications/:id/scope/summary` | Resumo (contagens) |
| PUT | `/certifications/:id/scope` | Atualizar info geral |
| GET | `/certifications/:id/scope/products` | Listar produtos |
| POST | `/certifications/:id/scope/products` | Adicionar produto |
| PUT | `/certifications/:id/scope/products/:productId` | Atualizar produto |
| DELETE | `/certifications/:id/scope/products/:productId` | Remover produto |
| (mesmo padrão para facilities, brands, suppliers) |

### 3.5 Certificates

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/certificates/verify/:number` | Verificar (público) | Não |
| GET | `/certificates` | Listar | Sim |
| GET | `/certificates/:id` | Detalhes | Sim |
| POST | `/certificates` | Emitir | gestor+ |
| PATCH | `/certificates/:id/suspend` | Suspender | gestor+ |
| PATCH | `/certificates/:id/reactivate` | Reativar | gestor+ |
| PATCH | `/certificates/:id/cancel` | Cancelar | gestor+ |

---

## 4. Implementação do Wizard de Solicitação

### 4.1 Fluxo do Wizard

```
┌─────────────────────────────────────────────────────────────────┐
│                    WIZARD DE SOLICITAÇÃO                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] Seleção de Tipo                                           │
│      ├── Nova Certificação → Fluxo completo (9 etapas)         │
│      ├── Renovação → Fluxo simplificado (6 etapas)             │
│      └── Manutenção/Ajuste → Fluxo mínimo (4 etapas)           │
│                                                                 │
│  [2] Dados da Empresa (pré-preenchido se existente)            │
│                                                                 │
│  [3] Tipo de Certificação (C1-C5)                              │
│                                                                 │
│  [4] Escopo - Produtos (adicionar/remover)                     │
│                                                                 │
│  [5] Escopo - Instalações (adicionar/remover)                  │
│                                                                 │
│  [6] Documentos (upload)                                        │
│                                                                 │
│  [7] Revisão Final                                              │
│                                                                 │
│  [8] Submissão → Gera protocolo                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Lógica de Pré-preenchimento

```typescript
// Para renovação ou ampliação
async function loadExistingData(certificationId: string) {
  const certification = await certificationsApi.getById(certificationId);
  const scope = await scopeApi.getScope(certificationId);

  return {
    // Dados da certificação
    companyId: certification.companyId,
    certificationType: certification.certificationType,

    // Escopo existente
    products: scope.products?.filter(p => p.status === 'ativo'),
    facilities: scope.facilities?.filter(f => f.status === 'ativo'),
    brands: scope.brands?.filter(b => b.status === 'ativo'),

    // Documentos anteriores podem ser referenciados
    previousCertificationId: certificationId,
  };
}
```

### 4.3 Componente de Seleção de Tipo

```tsx
// React example
function RequestTypeSelector({ onSelect }: { onSelect: (type: RequestType) => void }) {
  const types = [
    {
      type: 'nova',
      title: 'Nova Certificação',
      description: 'Primeira certificação para esta categoria',
      icon: '🆕',
      steps: 9,
    },
    {
      type: 'renovacao',
      title: 'Renovação',
      description: 'Renovar certificação existente',
      icon: '🔄',
      steps: 6,
      requiresCertification: true,
    },
    {
      type: 'ampliacao',
      title: 'Ampliação de Escopo',
      description: 'Adicionar produtos ou instalações',
      icon: '📈',
      steps: 6,
      requiresCertification: true,
    },
    {
      type: 'manutencao',
      title: 'Manutenção',
      description: 'Ajustes menores na certificação',
      icon: '🔧',
      steps: 4,
      requiresCertification: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {types.map((t) => (
        <button
          key={t.type}
          onClick={() => onSelect(t.type as RequestType)}
          className="p-4 border rounded-lg hover:bg-gray-50"
        >
          <span className="text-2xl">{t.icon}</span>
          <h3 className="font-semibold">{t.title}</h3>
          <p className="text-sm text-gray-600">{t.description}</p>
          <span className="text-xs">{t.steps} etapas</span>
        </button>
      ))}
    </div>
  );
}
```

---

## 5. Componentes Principais

### 5.1 Lista de Certificações

```tsx
// Substituir lista de requests por lista de certificações
function CertificationsList() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filters, setFilters] = useState<CertificationFilterDto>({});

  useEffect(() => {
    certificationsApi.list(filters).then((res) => setCertifications(res.data));
  }, [filters]);

  return (
    <table>
      <thead>
        <tr>
          <th>Número</th>
          <th>Empresa</th>
          <th>Tipo</th>
          <th>Status</th>
          <th>Validade</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {certifications.map((cert) => (
          <tr key={cert.id}>
            <td>{cert.certificationNumber}</td>
            <td>{cert.company?.name}</td>
            <td>{cert.certificationType}</td>
            <td><StatusBadge status={cert.status} /></td>
            <td>{formatDate(cert.validUntil)}</td>
            <td>
              <Link to={`/certifications/${cert.id}`}>Ver</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### 5.2 Detalhe da Certificação

```tsx
function CertificationDetail({ id }: { id: string }) {
  const [certification, setCertification] = useState<Certification | null>(null);
  const [timeline, setTimeline] = useState<CertificationHistory[]>([]);

  useEffect(() => {
    Promise.all([
      certificationsApi.getById(id),
      certificationsApi.getTimeline(id),
    ]).then(([cert, hist]) => {
      setCertification(cert);
      setTimeline(hist);
    });
  }, [id]);

  if (!certification) return <Loading />;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Info Principal */}
      <div className="col-span-2">
        <Card>
          <h2>{certification.certificationNumber}</h2>
          <p>Empresa: {certification.company?.name}</p>
          <p>Tipo: {certification.certificationType}</p>
          <StatusBadge status={certification.status} />
        </Card>

        {/* Tabs: Escopo, Solicitações, Certificados */}
        <Tabs>
          <Tab label="Escopo">
            <ScopeView certificationId={id} />
          </Tab>
          <Tab label="Solicitações">
            <RequestsList certificationId={id} />
          </Tab>
          <Tab label="Certificados">
            <CertificatesList certificationId={id} />
          </Tab>
        </Tabs>
      </div>

      {/* Timeline */}
      <div>
        <Timeline events={timeline} />
      </div>
    </div>
  );
}
```

### 5.3 Timeline Unificada

```tsx
function Timeline({ events }: { events: CertificationHistory[] }) {
  const getIcon = (action: string) => {
    const icons: Record<string, string> = {
      created: '🆕',
      status_changed: '📊',
      analyst_assigned: '👤',
      scope_updated: '📦',
      document_uploaded: '📄',
      certificate_issued: '🏆',
    };
    return icons[action] || '📌';
  };

  return (
    <div className="timeline">
      {events.map((event) => (
        <div key={event.id} className="timeline-item">
          <span className="icon">{getIcon(event.action)}</span>
          <div className="content">
            <p className="action">{event.action}</p>
            <p className="description">{event.description}</p>
            <p className="date">{formatDate(event.createdAt)}</p>
            {event.performedBy && (
              <p className="user">Por: {event.performedBy.name}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 6. Gestão de Estado

### 6.1 React Query / TanStack Query

```typescript
// hooks/useCertifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCertifications(filters?: CertificationFilterDto) {
  return useQuery({
    queryKey: ['certifications', filters],
    queryFn: () => certificationsApi.list(filters),
  });
}

export function useCertification(id: string) {
  return useQuery({
    queryKey: ['certification', id],
    queryFn: () => certificationsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCertificationRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: certificationRequestsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      queryClient.invalidateQueries({ queryKey: ['certification', data.certificationId] });
    },
  });
}
```

### 6.2 Zustand Store

```typescript
// stores/certificationStore.ts
import { create } from 'zustand';

interface CertificationStore {
  // Wizard state
  wizardStep: number;
  wizardData: Partial<CreateCertificationRequestDto>;
  setWizardStep: (step: number) => void;
  setWizardData: (data: Partial<CreateCertificationRequestDto>) => void;
  resetWizard: () => void;

  // Current certification
  currentCertification: Certification | null;
  setCurrentCertification: (cert: Certification | null) => void;
}

export const useCertificationStore = create<CertificationStore>((set) => ({
  wizardStep: 1,
  wizardData: {},
  setWizardStep: (step) => set({ wizardStep: step }),
  setWizardData: (data) => set((state) => ({
    wizardData: { ...state.wizardData, ...data }
  })),
  resetWizard: () => set({ wizardStep: 1, wizardData: {} }),

  currentCertification: null,
  setCurrentCertification: (cert) => set({ currentCertification: cert }),
}));
```

---

## 7. Permissões e Roles

### 7.1 Roles do Sistema

| Role | Descrição | Acesso |
|------|-----------|--------|
| `empresa` | Usuário da empresa cliente | Suas certificações, criar solicitações |
| `analista` | Analista de certificação | Processar solicitações, avaliar documentos |
| `auditor` | Auditor de campo | Realizar auditorias, relatórios |
| `comercial` | Equipe comercial | Propostas, contratos |
| `gestor` | Gestor de certificação | Aprovar, emitir certificados |
| `admin` | Administrador | Acesso total |

### 7.2 Controle de Acesso no Frontend

```typescript
// hooks/usePermissions.ts
export function usePermissions() {
  const { user } = useAuth();

  return {
    canCreateRequest: ['empresa', 'analista', 'gestor', 'admin'].includes(user?.role),
    canApproveRequest: ['analista', 'gestor', 'admin'].includes(user?.role),
    canIssueCertificate: ['gestor', 'admin'].includes(user?.role),
    canAssignAnalyst: ['gestor', 'admin'].includes(user?.role),
    canViewAllCertifications: ['analista', 'gestor', 'admin'].includes(user?.role),
  };
}

// Componente protegido
function ProtectedButton({ permission, children, ...props }) {
  const permissions = usePermissions();

  if (!permissions[permission]) return null;

  return <button {...props}>{children}</button>;
}
```

---

## 8. Validações

### 8.1 Validação de Formulários (Zod)

```typescript
import { z } from 'zod';

export const createRequestSchema = z.object({
  certificationId: z.string().uuid('ID da certificação inválido'),
  requestType: z.enum(['nova', 'renovacao', 'ampliacao', 'manutencao', 'adequacao']),
  changeDescription: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  category: z.string().optional(),
  origin: z.enum(['animal', 'vegetal', 'misto', 'quimico']).optional(),
});

export const createFacilitySchema = z.object({
  name: z.string().optional(),
  address: z.string().min(5, 'Endereço obrigatório'),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default('Brasil'),
  postalCode: z.string().optional(),
  facilityType: z.string().optional(),
});
```

---

## 9. Migração de Código Existente

### 9.1 Antes vs Depois

```typescript
// ANTES: Buscar requests
const requests = await fetch('/api/requests').then(r => r.json());

// DEPOIS: Buscar certificações
const certifications = await certificationsApi.list();

// ANTES: Criar novo request
await fetch('/api/requests', {
  method: 'POST',
  body: JSON.stringify({ companyId, productDescription, ... })
});

// DEPOIS: Criar certificação + request
const certification = await certificationsApi.create({ companyId, certificationType });
const request = await certificationRequestsApi.create({
  certificationId: certification.id,
  requestType: 'nova',
});
```

### 9.2 Checklist de Migração

- [ ] Substituir listagem de Requests por listagem de Certifications
- [ ] Atualizar detalhes de Request para detalhes de Certification
- [ ] Implementar novo Wizard com seleção de tipo
- [ ] Adicionar componente de Timeline unificada
- [ ] Atualizar gestão de escopo para usar novo endpoint
- [ ] Implementar lógica de pré-preenchimento para renovação
- [ ] Atualizar dashboard com estatísticas de Certifications
- [ ] Atualizar notificações para usar novos eventos

---

## 10. Exemplos de Uso

### 10.1 Criar Nova Certificação (Fluxo Completo)

```typescript
async function createNewCertification(data: WizardData) {
  // 1. Criar Certification
  const certification = await certificationsApi.create({
    companyId: data.companyId,
    certificationType: data.certificationType,
  });

  // 2. Criar Request
  const request = await certificationRequestsApi.create({
    certificationId: certification.id,
    requestType: 'nova',
  });

  // 3. Adicionar produtos ao escopo
  for (const product of data.products) {
    await scopeApi.products.add(certification.id, product);
  }

  // 4. Adicionar instalações ao escopo
  for (const facility of data.facilities) {
    await scopeApi.facilities.add(certification.id, facility);
  }

  // 5. Enviar para análise
  await certificationRequestsApi.submit(request.id);

  return { certification, request };
}
```

### 10.2 Solicitar Renovação

```typescript
async function requestRenewal(certificationId: string, changes?: any) {
  // 1. Criar request de renovação (escopo é herdado automaticamente)
  const request = await certificationRequestsApi.create({
    certificationId,
    requestType: 'renovacao',
    changeDescription: changes?.description,
  });

  // 2. Se houver alterações no escopo, fazer as atualizações
  if (changes?.newProducts) {
    for (const product of changes.newProducts) {
      await scopeApi.products.add(certificationId, product);
    }
  }

  // 3. Enviar para análise
  await certificationRequestsApi.submit(request.id);

  return request;
}
```

---

## 11. Troubleshooting

### 11.1 Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| 401 Unauthorized | Token expirado | Renovar token / relogar |
| 403 Forbidden | Sem permissão | Verificar role do usuário |
| 404 Not Found | Recurso não existe | Verificar ID |
| 400 Bad Request | Dados inválidos | Verificar validação |

### 11.2 Debug

```typescript
// Interceptor para debug
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  console.log('Request:', args);
  const response = await originalFetch(...args);
  console.log('Response:', response.status);
  return response;
};
```

---

## 12. Próximos Passos

1. **F-001 a F-005**: Implementar Wizard de Solicitação
2. **F-006 a F-009**: Criar novas telas
3. **F-010 a F-014**: Atualizar telas existentes
4. **F-015 a F-017**: Integrar com API

---

*Documento gerado em 2026-01-20*
*Backend: halalsphere-backend-nest v2.0*
