# Plano de Implementação - Sincronização de Fases

> **DOCUMENTO HISTORICO (Nov 2025)** - Exemplos de codigo referem-se ao Fastify, que foi substituido por NestJS 11 + Express em Jan 2026. A logica de fases continua valida, mas a sintaxe NestJS usa decorators (@Controller, @Post, etc).

**Data:** 2025-11-18
**Baseado em:** ANALISE_COMPARATIVA_FASES.md

---

## 🎯 DECISÕES APROVADAS

### 1. Modelo de Kanban
✅ **APROVADO: Baseado em FASES (8 colunas)**
- Cada coluna representa uma das 8 fases do processo
- Cards mostram o status atual dentro da fase
- Melhor visibilidade do fluxo completo

### 2. Transições
✅ **APROVADO: Híbrido - Automáticas + Manuais**
- Transições automáticas quando ações são concluídas
- Analista pode avançar manualmente quando necessário
- Sistema valida pré-condições antes de avançar

### 3. Status "em_andamento"
✅ **APROVADO: Genérico**
- Manter `em_andamento` como status universal
- Simplicidade para o usuário
- Contexto dado pela fase atual

### 4. Request vs Process Status
✅ **APROVADO: Unificar**
- Usar apenas `Process.status` como fonte única
- `Request.status` será derivado/sincronizado automaticamente
- Elimina inconsistências

---

## 📋 IMPLEMENTAÇÃO - FASE 1: CORREÇÕES CRÍTICAS

### 1.1 Remover Status Inexistente ❌ CRÍTICO

**Arquivo:** `frontend/src/pages/ProcessDetails.tsx`

**Problema:**
```typescript
const STATUS_CONFIG = {
  em_analise: { label: 'Em Análise', variant: 'default' },  // ❌ NÃO EXISTE
  // ...
};
```

**Solução:**
```typescript
const STATUS_CONFIG = {
  rascunho: { label: 'Rascunho', variant: 'default' },
  pendente: { label: 'Pendente', variant: 'warning' },
  em_andamento: { label: 'Em Andamento', variant: 'default' },
  aguardando_documentos: { label: 'Aguardando Documentos', variant: 'warning' },
  analise_documental: { label: 'Análise Documental', variant: 'default' },
  analise_tecnica: { label: 'Análise Técnica', variant: 'default' },
  aguardando_auditoria: { label: 'Aguardando Auditoria', variant: 'warning' },
  proposta_enviada: { label: 'Proposta Enviada', variant: 'default' },
  aguardando_assinatura: { label: 'Aguardando Assinatura', variant: 'warning' },
  em_auditoria: { label: 'Em Auditoria', variant: 'default' },
  concluido: { label: 'Concluído', variant: 'success' },
  aprovado: { label: 'Aprovado', variant: 'success' },
  reprovado: { label: 'Reprovado', variant: 'error' },
  certificado: { label: 'Certificado Emitido', variant: 'success' },
  cancelado: { label: 'Cancelado', variant: 'error' },
  suspenso: { label: 'Suspenso', variant: 'warning' },
};
```

### 1.2 Remover Fluxo Hardcoded ❌ CRÍTICO

**Arquivo:** `frontend/src/pages/ProcessDetails.tsx`

**Problema:**
```typescript
const handleAdvancePhase = () => {
  const statusFlow = [
    'aguardando_documentos',
    'em_analise',  // ❌ Não existe
    // ...
  ];
  // ...
};
```

**Solução:**
```typescript
const handleAdvancePhase = async () => {
  try {
    await processService.advancePhase(process.id);
    queryClient.invalidateQueries({ queryKey: ['process', id] });
    toast.success('Fase avançada com sucesso!');
  } catch (error: any) {
    toast.error(error.message || 'Erro ao avançar fase');
  }
};
```

### 1.3 Adicionar Validação de Status no Backend ❌ CRÍTICO

**Arquivo:** `backend/src/modules/process/process.service.ts`

**Adicionar:**
```typescript
import { ProcessStatus as PrismaProcessStatus } from '@prisma/client';

private validateStatus(status: string): void {
  const validStatuses = Object.values(PrismaProcessStatus);
  if (!validStatuses.includes(status as PrismaProcessStatus)) {
    throw new Error(`Status inválido: ${status}. Status válidos: ${validStatuses.join(', ')}`);
  }
}

async updateProcessStatus(
  requestId: string,
  data: UpdateProcessStatusDTO,
  userId: string
): Promise<ProcessResponse> {
  // Validar status antes de atualizar
  this.validateStatus(data.status);

  // ... resto do código
}
```

---

## 📋 IMPLEMENTAÇÃO - FASE 2: LÓGICA DE TRANSIÇÃO

### 2.1 Criar Service de Transição de Fases

**Novo arquivo:** `backend/src/modules/process/process-transition.service.ts`

```typescript
import { prisma } from '../../lib/prisma';
import { ProcessPhase } from '@prisma/client';
import { getNextPhase, PROCESS_PHASES } from './process.phases';

export class ProcessPhaseTransitionService {
  /**
   * Validar se processo pode avançar para próxima fase
   */
  private async canAdvancePhase(processId: string): Promise<{
    canAdvance: boolean;
    reason?: string;
  }> {
    const process = await prisma.process.findUnique({
      where: { id: processId },
      include: {
        request: true,
        contracts: true,
        audits: true,
      },
    });

    if (!process) {
      return { canAdvance: false, reason: 'Processo não encontrado' };
    }

    const currentPhase = process.currentPhase;

    // Validações por fase
    switch (currentPhase) {
      case ProcessPhase.cadastro_solicitacao:
        // Pode avançar se status for 'pendente' e analista atribuído
        if (!process.analystId) {
          return { canAdvance: false, reason: 'Analista não atribuído' };
        }
        return { canAdvance: true };

      case ProcessPhase.analise_documental:
        // Pode avançar se documentos aprovados
        const docs = await prisma.document.findMany({
          where: {
            requestId: process.requestId,
            validationStatus: 'pendente',
          },
        });
        if (docs.length > 0) {
          return { canAdvance: false, reason: 'Existem documentos pendentes de validação' };
        }
        return { canAdvance: true };

      case ProcessPhase.proposta_comercial:
        // Pode avançar se proposta enviada
        const proposta = await prisma.contract.findFirst({
          where: {
            processId: process.id,
            contractType: 'proposta',
          },
        });
        if (!proposta || proposta.status !== 'enviado') {
          return { canAdvance: false, reason: 'Proposta comercial não enviada' };
        }
        return { canAdvance: true };

      case ProcessPhase.contrato:
        // Pode avançar se contrato assinado
        const contrato = await prisma.contract.findFirst({
          where: {
            processId: process.id,
            contractType: 'contrato',
          },
        });
        if (!contrato || contrato.status !== 'assinado') {
          return { canAdvance: false, reason: 'Contrato não assinado' };
        }
        return { canAdvance: true };

      case ProcessPhase.auditoria_agendada:
        // Pode avançar se auditoria agendada existe
        const agendada = await prisma.audit.findFirst({
          where: {
            processId: process.id,
            status: 'agendado',
          },
        });
        if (!agendada) {
          return { canAdvance: false, reason: 'Auditoria não agendada' };
        }
        return { canAdvance: true };

      case ProcessPhase.auditoria_realizada:
        // Pode avançar se auditoria concluída
        const concluida = await prisma.audit.findFirst({
          where: {
            processId: process.id,
            status: 'concluido',
          },
        });
        if (!concluida) {
          return { canAdvance: false, reason: 'Auditoria não concluída' };
        }
        return { canAdvance: true };

      case ProcessPhase.comite_tecnico:
        // Pode avançar se decisão tomada
        const decisao = await prisma.committeeDecision.findFirst({
          where: {
            processId: process.id,
            decisionType: 'aprovar',
          },
        });
        if (!decisao) {
          return { canAdvance: false, reason: 'Comitê ainda não decidiu ou reprovas' };
        }
        return { canAdvance: true };

      case ProcessPhase.certificado_emitido:
        // Última fase, não pode avançar
        return { canAdvance: false, reason: 'Processo já está na fase final' };

      default:
        return { canAdvance: false, reason: 'Fase desconhecida' };
    }
  }

  /**
   * Determinar próximo status baseado na fase
   */
  private getNextStatus(currentPhase: ProcessPhase, nextPhase: ProcessPhase): string {
    switch (nextPhase) {
      case ProcessPhase.analise_documental:
        return 'analise_documental';

      case ProcessPhase.proposta_comercial:
        return 'em_andamento';

      case ProcessPhase.contrato:
        return 'aguardando_assinatura';

      case ProcessPhase.auditoria_agendada:
        return 'aguardando_auditoria';

      case ProcessPhase.auditoria_realizada:
        return 'em_auditoria';

      case ProcessPhase.comite_tecnico:
        return 'em_andamento';

      case ProcessPhase.certificado_emitido:
        return 'certificado';

      default:
        return 'em_andamento';
    }
  }

  /**
   * Avançar processo para próxima fase
   */
  async advancePhase(processId: string, userId: string): Promise<void> {
    const process = await prisma.process.findUnique({
      where: { id: processId },
    });

    if (!process) {
      throw new Error('Processo não encontrado');
    }

    // Validar se pode avançar
    const validation = await this.canAdvancePhase(processId);
    if (!validation.canAdvance) {
      throw new Error(validation.reason || 'Não é possível avançar a fase');
    }

    // Obter próxima fase
    const nextPhase = getNextPhase(process.currentPhase);
    if (!nextPhase) {
      throw new Error('Processo já está na última fase');
    }

    // Determinar próximo status
    const nextStatus = this.getNextStatus(process.currentPhase, nextPhase);

    // Atualizar processo
    await prisma.$transaction(async (tx) => {
      // Registrar saída da fase atual
      await tx.processPhaseHistory.updateMany({
        where: {
          processId: processId,
          exitedAt: null,
        },
        data: {
          exitedAt: new Date(),
          daysInPhase: Math.floor(
            (new Date().getTime() - process.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
          ),
        },
      });

      // Registrar entrada na nova fase
      await tx.processPhaseHistory.create({
        data: {
          processId: processId,
          phase: PROCESS_PHASES[nextPhase].order,
          enteredAt: new Date(),
        },
      });

      // Atualizar processo
      await tx.process.update({
        where: { id: processId },
        data: {
          currentPhase: nextPhase,
          status: nextStatus as any,
          updatedAt: new Date(),
        },
      });

      // Registrar histórico
      await tx.processHistory.create({
        data: {
          processId: processId,
          status: nextStatus as any,
          notes: `Fase avançada de ${process.currentPhase} para ${nextPhase}`,
          changedBy: userId,
        },
      });
    });
  }

  /**
   * Transições automáticas por ação
   */
  async onDocumentsApproved(processId: string): Promise<void> {
    const process = await prisma.process.findUnique({
      where: { id: processId },
    });

    if (process?.currentPhase === ProcessPhase.analise_documental) {
      // Auto-avançar para proposta comercial
      const systemUserId = 'system'; // Ou criar um usuário sistema
      await this.advancePhase(processId, systemUserId);
    }
  }

  async onProposalSent(processId: string): Promise<void> {
    const process = await prisma.process.findUnique({
      where: { id: processId },
    });

    if (process?.currentPhase === ProcessPhase.proposta_comercial) {
      await this.advancePhase(processId, 'system');
    }
  }

  async onContractSigned(processId: string): Promise<void> {
    const process = await prisma.process.findUnique({
      where: { id: processId },
    });

    if (process?.currentPhase === ProcessPhase.contrato) {
      await this.advancePhase(processId, 'system');
    }
  }

  async onAuditScheduled(processId: string): Promise<void> {
    const process = await prisma.process.findUnique({
      where: { id: processId },
    });

    if (process?.currentPhase === ProcessPhase.auditoria_agendada) {
      await this.advancePhase(processId, 'system');
    }
  }

  async onAuditCompleted(processId: string): Promise<void> {
    const process = await prisma.process.findUnique({
      where: { id: processId },
    });

    if (process?.currentPhase === ProcessPhase.auditoria_realizada) {
      await this.advancePhase(processId, 'system');
    }
  }

  async onCommitteeApproved(processId: string): Promise<void> {
    const process = await prisma.process.findUnique({
      where: { id: processId },
    });

    if (process?.currentPhase === ProcessPhase.comite_tecnico) {
      await this.advancePhase(processId, 'system');
    }
  }
}
```

### 2.2 Adicionar Endpoint de Transição

**Arquivo:** `backend/src/modules/process/process.routes.ts`

```typescript
import { advancePhase } from './process.controller';

// Adicionar rota
fastify.post('/:id/advance-phase', {
  onRequest: [fastify.authenticate],
  handler: advancePhase,
});
```

**Arquivo:** `backend/src/modules/process/process.controller.ts`

```typescript
import { ProcessPhaseTransitionService } from './process-transition.service';

const transitionService = new ProcessPhaseTransitionService();

/**
 * Advance process to next phase
 * POST /api/processes/:id/advance-phase
 */
export async function advancePhase(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const user = request.user as any;

    // Only analysts and managers can advance phases
    if (user.role !== 'analista' && user.role !== 'gestor') {
      return reply.status(403).send({
        success: false,
        error: 'Apenas analistas e gestores podem avançar fases',
      });
    }

    // Get request ID from process
    const process = await prisma.process.findUnique({
      where: { requestId: id },
      select: { id: true },
    });

    if (!process) {
      return reply.status(404).send({
        success: false,
        error: 'Processo não encontrado',
      });
    }

    await transitionService.advancePhase(process.id, user.id);

    // Log phase advancement
    await AuditLogger.logProcessAction(request, id, 'advance_phase');

    return reply.send({
      success: true,
      message: 'Fase avançada com sucesso',
    });
  } catch (error: any) {
    console.error('Error advancing phase:', error);

    return reply.status(400).send({
      success: false,
      error: error.message || 'Erro ao avançar fase',
    });
  }
}
```

### 2.3 Adicionar Método no Frontend

**Arquivo:** `frontend/src/services/process.service.ts`

```typescript
class ProcessService {
  // ... métodos existentes

  /**
   * Advance process to next phase
   */
  async advancePhase(id: string): Promise<void> {
    const response = await api.post(`/processes/${id}/advance-phase`);
    return response.data;
  }
}
```

---

## 📋 IMPLEMENTAÇÃO - FASE 3: UNIFICAÇÃO DE STATUS

### 3.1 Sincronizar Request.status com Process.status

**Arquivo:** `backend/src/modules/process/process.service.ts`

```typescript
/**
 * Mapear Process.status para Request.status
 */
private mapProcessStatusToRequestStatus(processStatus: string): string {
  switch (processStatus) {
    case 'rascunho':
      return 'rascunho';

    case 'pendente':
    case 'em_andamento':
    case 'aguardando_documentos':
    case 'analise_documental':
    case 'analise_tecnica':
    case 'aguardando_auditoria':
    case 'proposta_enviada':
    case 'aguardando_assinatura':
    case 'em_auditoria':
      return 'em_analise';

    case 'aprovado':
    case 'certificado':
      return 'aprovado';

    case 'reprovado':
    case 'cancelado':
    case 'suspenso':
      return 'rejeitado';

    default:
      return 'em_analise';
  }
}

/**
 * Atualizar Request.status quando Process.status mudar
 */
async updateProcessStatus(
  requestId: string,
  data: UpdateProcessStatusDTO,
  userId: string
): Promise<ProcessResponse> {
  // ... validações existentes

  const process = await prisma.process.update({
    where: { id: processId },
    data: {
      status: data.status as any,
      updatedAt: new Date(),
    },
    // ... includes
  });

  // NOVO: Sincronizar Request.status
  const requestStatus = this.mapProcessStatusToRequestStatus(data.status);
  await prisma.request.update({
    where: { id: requestId },
    data: {
      status: requestStatus as any,
    },
  });

  // ... resto do código
}
```

---

## 📋 IMPLEMENTAÇÃO - FASE 4: KANBAN BASEADO EM FASES

### 4.1 Redesenhar Kanban do Analista

**Arquivo:** `frontend/src/pages/analyst/AnalystDashboard.tsx`

```typescript
import { getAllPhases } from '@/lib/process-phases';

const PHASE_COLUMNS = getAllPhases().map((phase) => ({
  id: phase.id,
  title: phase.name,
  responsibility: phase.responsibilityLabel,
  color: getPhaseColor(phase.order),
  bgColor: getPhaseBgColor(phase.order),
  icon: getPhaseIcon(phase.order),
  description: phase.description,
}));

function getPhaseColor(order: number): string {
  const colors = [
    'text-blue-600',    // Fase 1
    'text-purple-600',  // Fase 2
    'text-indigo-600',  // Fase 3
    'text-cyan-600',    // Fase 4
    'text-teal-600',    // Fase 5
    'text-green-600',   // Fase 6
    'text-orange-600',  // Fase 7
    'text-emerald-600', // Fase 8
  ];
  return colors[order - 1] || 'text-gray-600';
}

function getPhaseBgColor(order: number): string {
  const colors = [
    'bg-blue-50',    // Fase 1
    'bg-purple-50',  // Fase 2
    'bg-indigo-50',  // Fase 3
    'bg-cyan-50',    // Fase 4
    'bg-teal-50',    // Fase 5
    'bg-green-50',   // Fase 6
    'bg-orange-50',  // Fase 7
    'bg-emerald-50', // Fase 8
  ];
  return colors[order - 1] || 'bg-gray-50';
}

function getPhaseIcon(order: number) {
  const icons = [
    FileText,      // Fase 1
    FileSearch,    // Fase 2
    DollarSign,    // Fase 3
    FileSignature, // Fase 4
    Calendar,      // Fase 5
    ClipboardCheck,// Fase 6
    Users,         // Fase 7
    Award,         // Fase 8
  ];
  return icons[order - 1] || FileText;
}

// Substituir getProcessesByStatus por getProcessesByPhase
const getProcessesByPhase = (phaseId: string): Process[] => {
  return filteredProcesses.filter((p) => p.currentPhase === phaseId);
};

// No render
<div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-4">
  {PHASE_COLUMNS.map((column) => {
    const columnProcesses = getProcessesByPhase(column.id);
    const isOver = overId === column.id;

    return (
      <KanbanColumn
        key={column.id}
        id={column.id}
        title={column.title}
        subtitle={column.responsibility}
        processes={columnProcesses}
        color={column.color}
        bgColor={column.bgColor}
        icon={column.icon}
        isOver={isOver}
      />
    );
  })}
</div>
```

### 4.2 Atualizar ProcessCard para mostrar Status

**Arquivo:** `frontend/src/components/kanban/ProcessCard.tsx`

```typescript
// Adicionar badge de status dentro do card
<div className="flex items-center justify-between">
  <Badge variant={getStatusVariant(process.status)}>
    {getStatusLabel(process.status)}
  </Badge>
  <span className="text-xs text-text-muted">
    {process.daysInStage} dias
  </span>
</div>

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    rascunho: 'Rascunho',
    pendente: 'Pendente',
    em_andamento: 'Em Andamento',
    aguardando_documentos: 'Aguardando Docs',
    analise_documental: 'Analisando',
    analise_tecnica: 'Análise Técnica',
    aguardando_auditoria: 'Aguardando',
    proposta_enviada: 'Proposta Enviada',
    aguardando_assinatura: 'Aguardando Assinatura',
    em_auditoria: 'Em Auditoria',
    concluido: 'Concluído',
    aprovado: 'Aprovado',
    reprovado: 'Reprovado',
    certificado: 'Certificado',
    cancelado: 'Cancelado',
    suspenso: 'Suspenso',
  };
  return labels[status] || status;
}
```

### 4.3 Atualizar Drag & Drop para Fases

**Arquivo:** `frontend/src/pages/analyst/AnalystDashboard.tsx`

```typescript
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;

  if (!over || !activeProcess) {
    setActiveProcess(null);
    setActiveColumn(null);
    setOverId(null);
    return;
  }

  const newPhaseId = over.data.current?.columnId || over.id;

  // Only update if dropped in different phase
  if (activeProcess.currentPhase !== newPhaseId) {
    try {
      // Verificar se pode mover manualmente
      const currentPhaseOrder = PHASE_COLUMNS.findIndex(c => c.id === activeProcess.currentPhase);
      const newPhaseOrder = PHASE_COLUMNS.findIndex(c => c.id === newPhaseId);

      // Só permite mover para fase seguinte ou anterior (não pular fases)
      if (Math.abs(newPhaseOrder - currentPhaseOrder) > 1) {
        toast.error('Não é possível pular fases. Use o botão "Avançar Fase"');
        return;
      }

      // Se for próxima fase, usar endpoint de avanço
      if (newPhaseOrder === currentPhaseOrder + 1) {
        await processService.advancePhase(activeProcess.id);
        toast.success('Fase avançada com sucesso!');
      } else {
        toast.error('Só é possível avançar para a próxima fase');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao mover processo');
    } finally {
      queryClient.invalidateQueries({ queryKey: ['analyst-processes'] });
    }
  }

  setActiveProcess(null);
  setActiveColumn(null);
  setOverId(null);
};
```

---

## 📋 IMPLEMENTAÇÃO - FASE 5: DASHBOARDS ESPECÍFICOS

### 5.1 Dashboard do Auditor

**Novo arquivo:** `frontend/src/pages/auditor/AuditorDashboard.tsx`

```typescript
export default function AuditorDashboard() {
  const { data: processes = [] } = useQuery({
    queryKey: ['auditor-processes'],
    queryFn: () => processService.getProcesses(),
  });

  // Filtrar apenas fases 5 e 6
  const auditProcesses = processes.filter(
    (p) =>
      p.currentPhase === 'auditoria_agendada' ||
      p.currentPhase === 'auditoria_realizada'
  );

  const agendadas = auditProcesses.filter(p => p.currentPhase === 'auditoria_agendada');
  const realizadas = auditProcesses.filter(p => p.currentPhase === 'auditoria_realizada');

  return (
    <div>
      <h1>Dashboard do Auditor</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Auditorias Agendadas */}
        <Card>
          <CardHeader>
            <CardTitle>Auditorias Agendadas ({agendadas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {agendadas.map(process => (
              <AuditCard key={process.id} process={process} type="agendada" />
            ))}
          </CardContent>
        </Card>

        {/* Auditorias em Execução */}
        <Card>
          <CardHeader>
            <CardTitle>Auditorias em Execução ({realizadas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {realizadas.map(process => (
              <AuditCard key={process.id} process={process} type="realizada" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 5.2 Dashboard do Gestor

**Novo arquivo:** `frontend/src/pages/gestor/GestorDashboard.tsx`

```typescript
export default function GestorDashboard() {
  const { data: processes = [] } = useQuery({
    queryKey: ['gestor-processes'],
    queryFn: () => processService.getProcesses(),
  });

  const comiteTecnico = processes.filter(p => p.currentPhase === 'comite_tecnico');
  const aguardandoDecisao = comiteTecnico.filter(p => p.status === 'em_andamento');
  const aprovados = processes.filter(p => p.status === 'aprovado');
  const reprovados = processes.filter(p => p.status === 'reprovado');

  return (
    <div>
      <h1>Dashboard do Gestor</h1>

      {/* Comitê Técnico */}
      <Card>
        <CardHeader>
          <CardTitle>
            Aguardando Decisão do Comitê ({aguardandoDecisao.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aguardandoDecisao.map(process => (
            <CommitteeDecisionCard key={process.id} process={process} />
          ))}
        </CardContent>
      </Card>

      {/* Overview Geral */}
      <ProcessOverviewByPhase processes={processes} />
    </div>
  );
}
```

---

## 📋 ORDEM DE EXECUÇÃO

### Sprint 1 (Semana 1) - Correções Críticas
1. ✅ Remover status `em_analise` do frontend
2. ✅ Adicionar todos os 16 status ao STATUS_CONFIG
3. ✅ Adicionar validação de status no backend
4. ✅ Remover fluxo hardcoded do ProcessDetails
5. ✅ Criar endpoint `advancePhase`

### Sprint 2 (Semana 2) - Lógica de Transição
6. ✅ Criar ProcessPhaseTransitionService
7. ✅ Implementar validações por fase
8. ✅ Implementar transições automáticas
9. ✅ Integrar no controller e routes
10. ✅ Testar todas as 7 transições

### Sprint 3 (Semana 3) - Unificação de Status
11. ✅ Implementar sincronização Request ↔ Process
12. ✅ Atualizar todos os pontos que alteram status
13. ✅ Migrar dados existentes (se necessário)
14. ✅ Validar consistência

### Sprint 4 (Semana 4) - Kanban Redesenhado
15. ✅ Redesenhar colunas do Kanban (8 fases)
16. ✅ Atualizar ProcessCard com badges de status
17. ✅ Ajustar drag & drop para fases
18. ✅ Atualizar filtros e métricas
19. ✅ Testes de usabilidade

### Sprint 5 (Semana 5) - Dashboards Específicos
20. ✅ Criar AuditorDashboard
21. ✅ Criar GestorDashboard
22. ✅ Melhorar dashboard da Empresa
23. ✅ Criar componentes reutilizáveis
24. ✅ Testes finais

---

## 🧪 PLANO DE TESTES

### Testes Unitários
- [ ] ProcessPhaseTransitionService.canAdvancePhase()
- [ ] ProcessPhaseTransitionService.advancePhase()
- [ ] Validação de status inválido
- [ ] Sincronização Request.status

### Testes de Integração
- [ ] Fluxo completo: Fase 1 → Fase 8
- [ ] Transições automáticas após ações
- [ ] Transições manuais pelo analista
- [ ] Drag & drop no Kanban

### Testes de Regressão
- [ ] Processos existentes continuam funcionando
- [ ] APIs antigas ainda respondem
- [ ] Frontend backward compatible

### Testes de Usabilidade
- [ ] Analista consegue visualizar todas as fases
- [ ] Auditor vê apenas suas auditorias
- [ ] Gestor tem visão completa
- [ ] Empresa vê progresso claramente

---

## 📊 MÉTRICAS DE SUCESSO

1. ✅ **Zero status inválidos** em produção
2. ✅ **100% das fases visíveis** no Kanban
3. ✅ **Transições automáticas funcionando** em todas as ações
4. ✅ **Dashboards específicos** para todos os atores
5. ✅ **Redução de bugs** relacionados a status
6. ✅ **Melhoria na UX** medida por feedback dos usuários

---

## 📝 DOCUMENTAÇÃO NECESSÁRIA

1. [ ] Atualizar README com novo fluxo de fases
2. [ ] Documentar API de transições
3. [ ] Criar guia do usuário por perfil
4. [ ] Diagramas de fluxo de fases
5. [ ] Changelog das alterações

---

**Início Previsto:** 2025-11-18
**Conclusão Prevista:** 2025-12-23 (5 semanas)
**Responsável:** Equipe de Desenvolvimento
