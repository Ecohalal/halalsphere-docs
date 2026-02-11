# Plano do Mockup HalalSphere (5 Dias)

> **DOCUMENTO HISTORICO (Nov 2025)** - Plano original do mockup. Exemplos de codigo referem-se ao Fastify, que foi substituido por NestJS 11 + Express em Jan 2026.

**Objetivo**: Criar um mockup funcional e apresentável do HalalSphere em 5 dias de trabalho (8h/dia).

---

## 🎯 Escopo do Mockup

### ✅ O QUE INCLUIR (7 telas demonstráveis)

**Jornada Completa**:
1. **Login** - Autenticação simples (email + senha)
2. **Dashboard Empresa** - Visão geral dos processos
3. **Wizard de Solicitação** (US-002) - Criar certificação (9 etapas completas)
4. **Dashboard Analista** - Kanban de processos (US-018)
5. **Detalhes do Processo** - Timeline de fases
6. **Chat IA** - Chatbot simulado (respostas mockadas)
7. **Certificado Gerado** - PDF de exemplo

### ❌ O QUE DEIXAR DE FORA (por enquanto)

- Gestão de contratos completa
- Auditorias presenciais
- Comitê técnico
- Pagamentos (Stripe)
- IA real (usar mocks)
- Upload real de arquivos
- MFA (apenas login/senha)

---

## 📅 Cronograma Detalhado

### **DIA 1: Setup e Estrutura Base** (8h)

#### Checklist Dia 1

**1.1 Setup do Ambiente** (1h)
```bash
# Verificar instalações
node --version    # Precisa v20+
npm --version
docker --version
git --version

# Estrutura de pastas
mkdir halalsphere && cd halalsphere
git init
```

**1.2 Criar Estrutura de Pastas** (30min)
```
halalsphere/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── processes/
│   │   │   ├── users/
│   │   ├── shared/
│   │   ├── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   ├── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── lib/
│   ├── package.json
├── docker-compose.yml
└── README.md
```

**1.3 Docker Compose** (30min)
```yaml
# docker-compose.yml
version: '3.9'
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: halalsphere
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

Executar: `docker-compose up -d`

**1.4 Backend Base** (2h)
```bash
cd backend
npm init -y
npm install fastify @fastify/cors @fastify/jwt typescript ts-node @types/node
npm install prisma @prisma/client zod bcrypt
npm install -D tsx nodemon

# package.json scripts
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

Criar `src/server.ts`:
```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: 'http://localhost:5173' });
fastify.register(jwt, { secret: 'your-secret-key-change-in-prod' });

fastify.get('/health', async () => ({ status: 'ok' }));

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('🚀 Server running on http://localhost:3000');
});
```

**1.5 Frontend Base** (2h)
```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Dependências do projeto
npm install @tanstack/react-query zustand react-router-dom
npm install zod react-hook-form @hookform/resolvers
npm install axios

# shadcn/ui
npx shadcn-ui@latest init
```

Configurar `tailwind.config.ts` com cores do HalalSphere:
```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#2D5016',      // Verde Halal
        secondary: '#D4AF37',    // Dourado premium
        accent: '#8B4513',       // Marrom terracota
        neutral: '#F5F5DC',      // Bege claro
      }
    }
  }
}
```

**1.6 Prisma Schema** (2h)
```bash
cd backend
npx prisma init

# Copiar schema básico (5 tabelas para mockup)
```

Criar `prisma/schema.prisma` simplificado:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  empresa
  analista
  auditor
  gestor
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  role          UserRole
  name          String
  createdAt     DateTime @default(now())

  company       Company?
  processes     CertificationProcess[] @relation("analyst")
}

model Company {
  id              String   @id @default(uuid())
  userId          String   @unique
  cnpj            String   @unique
  razaoSocial     String
  nomeFantasia    String?
  createdAt       DateTime @default(now())

  user            User     @relation(fields: [userId], references: [id])
  processes       CertificationProcess[]
}

model CertificationProcess {
  id            String   @id @default(uuid())
  companyId     String
  analystId     String?
  currentPhase  Int      @default(1)
  status        String   @default("em_andamento")
  createdAt     DateTime @default(now())

  company       Company  @relation(fields: [companyId], references: [id])
  analyst       User?    @relation("analyst", fields: [analystId], references: [id])
  products      Product[]
}

model Product {
  id          String   @id @default(uuid())
  processId   String
  name        String
  category    String
  origin      String

  process     CertificationProcess @relation(fields: [processId], references: [id])
}

model Certificate {
  id                String   @id @default(uuid())
  processId         String   @unique
  certificateNumber String   @unique
  issuedDate        DateTime
  validFrom         DateTime
  validUntil        DateTime
  pdfUrl            String?
  createdAt         DateTime @default(now())
}
```

Executar migration:
```bash
npx prisma migrate dev --name init
```

---

### **DIA 2: Autenticação + Design System** (8h)

#### Checklist Dia 2

**2.1 Backend: Auth Endpoints** (3h)

Criar `src/modules/auth/auth.controller.ts`:
```typescript
import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import { prisma } from '../../shared/database';

export async function login(
  request: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return reply.code(401).send({ error: 'Credenciais inválidas' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return reply.code(401).send({ error: 'Credenciais inválidas' });
  }

  const token = await reply.jwtSign({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  return { token, user: { id: user.id, email, role: user.role, name: user.name } };
}

export async function me(request: FastifyRequest, reply: FastifyReply) {
  // Protegido por middleware
  return request.user;
}
```

Registrar rotas em `src/server.ts`:
```typescript
fastify.post('/api/auth/login', login);
fastify.get('/api/auth/me', { onRequest: [fastify.authenticate] }, me);
```

**2.2 Frontend: Tela de Login** (2h)

Instalar componentes shadcn/ui:
```bash
npx shadcn-ui@latest add button input card label
```

Criar `src/pages/Login.tsx`:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

export function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const { token, user } = await response.json();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = user.role === 'empresa' ? '/dashboard-empresa' : '/dashboard-analista';
    }
  };

  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center">
      <Card className="w-96 p-8">
        <h1 className="text-2xl font-bold text-primary mb-6">HalalSphere</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register('email')} placeholder="Email" className="mb-4" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <Input {...register('password')} type="password" placeholder="Senha" className="mb-4" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <Button type="submit" className="w-full bg-primary">Entrar</Button>
        </form>
      </Card>
    </div>
  );
}
```

**2.3 Design System** (3h)

Instalar componentes necessários:
```bash
npx shadcn-ui@latest add badge toast dialog dropdown-menu avatar separator
```

Criar constantes de design:
```typescript
// src/lib/constants.ts
export const COLORS = {
  primary: '#2D5016',
  secondary: '#D4AF37',
  accent: '#8B4513',
  neutral: '#F5F5DC'
};

export const PHASES = [
  { id: 1, name: 'Solicitação Recebida' },
  { id: 2, name: 'Análise Documental' },
  { id: 3, name: 'Proposta Enviada' },
  { id: 4, name: 'Contrato Assinado' },
  { id: 5, name: 'Auditoria Agendada' },
  { id: 6, name: 'Auditoria Realizada' },
  { id: 7, name: 'Comitê Técnico' },
  { id: 8, name: 'Certificado Emitido' }
];

export const CATEGORIES = [
  { code: 'C1', name: 'Carne e Derivados' },
  { code: 'C2', name: 'Leite e Derivados' },
  { code: 'C3', name: 'Produtos Vegetais' },
  { code: 'C4', name: 'Aditivos e Ingredientes' },
  { code: 'C5', name: 'Cosméticos' },
  { code: 'C6', name: 'Farmacêuticos' }
];
```

---

### **DIA 3: Dashboards + Wizard** (8h)

#### Checklist Dia 3

**3.1 Dashboard Empresa** (3h)

Backend - `GET /api/processes`:
```typescript
export async function listProcesses(request: FastifyRequest, reply: FastifyReply) {
  const { userId } = request.user;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { company: true }
  });

  const processes = await prisma.certificationProcess.findMany({
    where: { companyId: user.company.id },
    include: { products: true }
  });

  return processes;
}
```

Frontend - `src/pages/DashboardEmpresa.tsx`:
```typescript
export function DashboardEmpresa() {
  const { data: processes } = useQuery(['processes'], fetchProcesses);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-4">
        <h1 className="text-2xl font-bold">HalalSphere</h1>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card><h3>Ativos</h3><p className="text-4xl">{activeCount}</p></Card>
          <Card><h3>Pendentes</h3><p className="text-4xl">{pendingCount}</p></Card>
          <Card><h3>Concluídos</h3><p className="text-4xl">{completedCount}</p></Card>
        </div>

        <Button onClick={() => navigate('/wizard')}>+ Nova Solicitação</Button>

        <div className="mt-6">
          <h2 className="text-xl mb-4">Seus Processos</h2>
          <table className="w-full">
            {/* Tabela de processos */}
          </table>
        </div>
      </main>
    </div>
  );
}
```

**3.2 Wizard de Solicitação** (4h)

Frontend - `src/pages/Wizard.tsx` (3 etapas):
```typescript
export function Wizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const renderStep = () => {
    switch(step) {
      case 1:
        return <StepCategory />;  // Selecionar C1-C6
      case 2:
        return <StepCompany />;   // Dados da empresa (pré-preenchido)
      case 3:
        return <StepProducts />; // Produtos (formulário dinâmico)
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Stepper currentStep={step} />
      {renderStep()}
      <div className="flex justify-between mt-6">
        <Button onClick={() => setStep(step - 1)} disabled={step === 1}>Voltar</Button>
        <Button onClick={handleNext}>
          {step === 3 ? 'Enviar' : 'Avançar'}
        </Button>
      </div>
    </div>
  );
}
```

Tela de sucesso após envio:
```typescript
<Card className="text-center p-12">
  <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
  <h2 className="text-2xl mb-2">Solicitação Enviada!</h2>
  <p>Custo estimado: <strong>R$ 12.500,00</strong></p>
  <p className="text-sm text-gray-600">Você receberá a proposta em até 48h</p>
</Card>
```

**3.3 API Endpoints** (1h)
- `POST /api/requests` - Criar solicitação
- `GET /api/product-categories` - Listar categorias C1-C6

---

### **DIA 4: Kanban Analista + Detalhes** (8h)

#### Checklist Dia 4

**4.1 Dashboard Analista (Kanban)** (5h)

Instalar biblioteca de drag & drop:
```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

Frontend - `src/pages/DashboardAnalista.tsx`:
```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export function DashboardAnalista() {
  const [processes, setProcesses] = useState(mockProcesses);

  const columns = [
    { id: 1, title: 'Recebidas' },
    { id: 2, title: 'Em Análise' },
    { id: 3, title: 'Aguardando Proposta' },
    { id: 4, title: 'Aguardando Assinatura' },
    { id: 5, title: 'Agendamento' },
    { id: 6, title: 'Auditoria' },
    { id: 7, title: 'Comitê' }
  ];

  return (
    <div className="h-screen bg-gray-50">
      <header className="bg-primary text-white p-4">
        <h1 className="text-2xl">Dashboard Analista</h1>
      </header>

      <div className="flex overflow-x-auto p-4 gap-4">
        {columns.map(column => (
          <KanbanColumn key={column.id} column={column} processes={processesInColumn(column.id)} />
        ))}
      </div>
    </div>
  );
}
```

Componente `KanbanColumn`:
```typescript
function KanbanColumn({ column, processes }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 w-80 flex-shrink-0">
      <h3 className="font-bold mb-4">{column.title} ({processes.length})</h3>
      <div className="space-y-2">
        {processes.slice(0, 5).map(process => (
          <ProcessCard key={process.id} process={process} />
        ))}
        {processes.length > 5 && (
          <button className="text-sm text-blue-500">Carregar mais ({processes.length - 5})</button>
        )}
      </div>
    </div>
  );
}
```

**4.2 Tela de Detalhes do Processo** (2h)

Frontend - `src/pages/ProcessDetails.tsx`:
```typescript
export function ProcessDetails() {
  const { id } = useParams();
  const { data: process } = useQuery(['process', id], () => fetchProcess(id));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-6">Processo #{process.id.slice(0,8)}</h1>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h2>Timeline</h2>
          <Stepper currentPhase={process.currentPhase} />
        </Card>

        <Card>
          <h2>Informações da Empresa</h2>
          <p>{process.company.razaoSocial}</p>
          <p>CNPJ: {process.company.cnpj}</p>
        </Card>
      </div>

      <Card className="mt-6">
        <h2>Produtos</h2>
        <ul>
          {process.products.map(p => <li key={p.id}>{p.name} - {p.category}</li>)}
        </ul>
      </Card>

      <div className="mt-6 flex gap-2">
        <Button>Avançar Fase</Button>
        <Button variant="outline">Solicitar Documentos</Button>
      </div>
    </div>
  );
}
```

**4.3 API Endpoints** (1h)
- `GET /api/processes/:id` - Detalhes do processo
- `PATCH /api/processes/:id/phase` - Avançar fase

---

### **DIA 5: Chat IA + Certificado + Polish** (8h)

#### Checklist Dia 5

**5.1 Chat IA (Mockado)** (3h)

Frontend - `src/pages/Chat.tsx`:
```typescript
const MOCKED_RESPONSES = {
  "halal": "Halal significa 'permitido' em árabe. São produtos que seguem as diretrizes islâmicas...",
  "prazo": "O prazo médio de certificação é de 60-90 dias após envio da documentação completa.",
  "custo": "O custo varia entre R$ 8.000 e R$ 25.000 dependendo da categoria (C1-C6) e número de produtos.",
  "default": "Desculpe, não entendi. Pode reformular? Ou fale com um analista."
};

export function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou o assistente virtual da HalalSphere. Como posso ajudar?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    setMessages([...messages, { role: 'user', content: input }]);

    setTimeout(() => {
      const response = findResponse(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1500);  // Simular delay

    setInput('');
  };

  const findResponse = (msg) => {
    const lower = msg.toLowerCase();
    for (let [key, value] of Object.entries(MOCKED_RESPONSES)) {
      if (lower.includes(key)) return value;
    }
    return MOCKED_RESPONSES.default;
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-primary text-white p-4">Chat com IA</header>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} />
        <Button onClick={sendMessage}>Enviar</Button>
      </div>
    </div>
  );
}
```

**5.2 Certificado PDF (Mockado)** (2h)

Frontend - `src/pages/Certificate.tsx`:
```typescript
export function Certificate() {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white border-4 border-secondary p-12 max-w-4xl mx-auto" id="certificate">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Certificado Halal</h1>
          <p className="text-secondary text-xl">HalalSphere Certification</p>
        </div>

        <div className="border-t-2 border-b-2 border-secondary py-6 my-6">
          <p className="text-center text-lg">
            Certificamos que a empresa <strong>Exemplo Alimentos Ltda</strong><br/>
            CNPJ: 12.345.678/0001-99<br/>
            está em conformidade com os requisitos Halal
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p><strong>Número:</strong> HS-2025-00001</p>
            <p><strong>Emissão:</strong> 13/11/2025</p>
            <p><strong>Validade:</strong> 13/11/2025 - 13/11/2028</p>
          </div>
          <div className="text-right">
            <img src="/qr-code-mock.png" alt="QR Code" className="w-24 h-24 ml-auto" />
            <p className="text-xs text-gray-500">Verifique em halalsphere.com/verify</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <Button onClick={downloadPDF}>Download PDF</Button>
      </div>
    </div>
  );
}
```

**5.3 Seed de Dados** (2h)

Backend - `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Usuário empresa
  const empresa = await prisma.user.create({
    data: {
      email: 'empresa@demo.com',
      passwordHash: await bcrypt.hash('demo123', 12),
      role: 'empresa',
      name: 'Exemplo Alimentos Ltda',
      company: {
        create: {
          cnpj: '12345678000199',
          razaoSocial: 'Exemplo Alimentos Ltda',
          nomeFantasia: 'Exemplo Foods'
        }
      }
    },
    include: { company: true }
  });

  // Usuário analista
  const analista = await prisma.user.create({
    data: {
      email: 'analista@demo.com',
      passwordHash: await bcrypt.hash('demo123', 12),
      role: 'analista',
      name: 'Ana Silva'
    }
  });

  // 5 processos em fases diferentes
  for (let i = 1; i <= 5; i++) {
    await prisma.certificationProcess.create({
      data: {
        currentPhase: i,
        status: 'em_andamento',
        companyId: empresa.company.id,
        analystId: analista.id,
        products: {
          create: [
            { name: `Produto ${i}A`, category: 'C1', origin: 'animal' },
            { name: `Produto ${i}B`, category: 'C2', origin: 'vegetal' }
          ]
        }
      }
    });
  }

  console.log('✅ Seed completo!');
}

main().finally(() => prisma.$disconnect());
```

Executar: `npm run db:seed`

**5.4 Polish & Testes** (1h)

- Testar jornada completa:
  1. Login empresa → Dashboard → Wizard → Criar solicitação ✅
  2. Login analista → Kanban → Detalhes → Avançar fase ✅
  3. Chat mockado ✅
  4. Certificado mockado ✅

- Corrigir bugs visuais
- Adicionar toasts de feedback
- Tirar screenshots para apresentação

---

## 🎨 Preparação da Apresentação

### Screenshots (tirar no final do Dia 5)

1. Login (desktop)
2. Dashboard Empresa com cards de estatísticas
3. Wizard - Etapa 1 (seleção de categoria)
4. Wizard - Tela de sucesso (com custo)
5. Kanban Analista (tela cheia, 7 colunas)
6. Detalhes do Processo (timeline)
7. Chat IA (conversa)
8. Certificado (layout final)

### Roteiro de Demo (10-15 min)

**1. Intro** (2min)
- Problema: Certificação manual = 7-8 meses
- Solução: HalalSphere = 2-3 meses

**2. Demo Empresa** (4min)
- Login → Dashboard
- Nova solicitação (wizard 3 etapas)
- Custo calculado: R$ 12.500

**3. Demo Analista** (4min)
- Login → Kanban (700 processos organizados)
- Drag & drop
- Detalhes → Avançar fase

**4. Diferenciais** (3min)
- Chat IA (demo rápido)
- Certificado digital (QR code)

**5. Roadmap** (2min)
- MVP: 22 semanas
- Custos: $170/mês → $1.510/mês

---

## ✅ Critérios de Sucesso do Mockup

Mockup está pronto quando:
- ✅ 7 telas funcionando
- ✅ Jornada completa navegável
- ✅ Dados mockados realistas
- ✅ Design system aplicado (cores HalalSphere)
- ✅ Screenshots tirados
- ✅ Demo de 10-15min ensaiado

---

## 🔗 Próximos Passos Após Mockup

1. **Apresentação para stakeholders**
2. **Feedback e ajustes**
3. **Kickoff Sprint 0: Fundação** (2 semanas)
4. **Início do desenvolvimento do MVP** (22 semanas)

---

**Boa sorte!** 🚀
