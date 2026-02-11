# Troubleshooting - Perfil de Administrador

## Problema: Tela em branco no frontend

### Erro: "does not provide an export named 'User'"

**Causa:** Cache do Vite ou problema com módulos TypeScript.

**Solução:**

1. **Limpar cache do Vite:**
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   npm run dev
   ```

2. **Se ainda não funcionar, limpar tudo:**
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   rm -rf dist
   npm run dev
   ```

3. **Hard refresh no navegador:**
   - Chrome/Edge: `Ctrl + Shift + R`
   - Firefox: `Ctrl + F5`

## Problema: Erro ao importar admin.service

**Causa:** Caminho de importação incorreto.

**Verificar:**
- Arquivo: `frontend/src/services/admin.service.ts`
- Linha 1 deve ser: `import api from '@/lib/api';`
- NÃO deve ser: `import api from './api';`

## Problema: Tipos TypeScript não reconhecidos

**Solução:**
1. Verificar se todas as interfaces estão exportadas com `export type` ou `export interface`
2. Reiniciar o servidor TypeScript no VS Code: `Ctrl + Shift + P` → "TypeScript: Restart TS Server"

## Problema: Backend não responde nas rotas /api/admin/*

**Verificar:**

1. **Server.ts atualizado:**
   ```typescript
   // admin.module.ts registrado automaticamente via NestJS:
   @Module({
     controllers: [AdminController],
     providers: [AdminService],
   })
   export class AdminModule {}
   // Rotas registradas via decorators @Controller('api/admin')
   ```

2. **Backend rodando:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Testar endpoint diretamente:**
   ```bash
   # Com token válido
   curl -H "Authorization: Bearer SEU_TOKEN" http://localhost:3333/api/admin/users/stats
   ```

## Problema: "Acesso negado" ao tentar acessar rotas admin

**Causa:** Token JWT não tem role 'admin'

**Verificar:**
1. Decodificar o token JWT em jwt.io
2. Verificar se o payload tem: `"role": "admin"`
3. Recriar o usuário admin se necessário:
   ```bash
   cd backend
   npx ts-node create-admin.ts
   ```

## Problema: Migration não roda

**Erro:** "Migration failed to apply cleanly to the shadow database"

**Solução:**
Use `db push` ao invés de migrate:
```bash
cd backend
npx prisma db push
```

## Problema: Prisma Client desatualizado

**Erro:** "Property 'admin' does not exist on type 'UserRole'"

**Solução:**
```bash
cd backend
npx prisma generate
npm run dev
```

## Problema: CORS ao fazer requisições

**Sintomas:** Erro no console do navegador sobre CORS

**Verificar:**
1. Backend configurado para aceitar origem do frontend
2. Arquivo `backend/src/server.ts` deve ter:
   ```typescript
   // main.ts - CORS configurado via NestJS:
   app.enableCors({
     origin: true,
     credentials: true,
   });
   ```

## Checklist de Verificação Rápida

- [ ] Backend rodando em `http://localhost:3333`
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] Usuário admin criado no banco
- [ ] Cache do Vite limpo
- [ ] Navegador com cache limpo (hard refresh)
- [ ] Token JWT válido e com role 'admin'
- [ ] Imports corretos (`@/lib/api` não `@/services/api`)

## Logs Úteis

### Backend
```bash
cd backend
npm run dev
# Observar logs do NestJS
```

### Frontend
- Abrir DevTools (F12)
- Aba Console: Ver erros JavaScript
- Aba Network: Ver requisições HTTP falhando
- Aba Application > Local Storage: Verificar se o token está salvo

## Contato

Se nenhuma solução funcionar:
1. Verificar logs completos do erro
2. Verificar se todos os arquivos foram criados corretamente
3. Comparar com a estrutura da documentação em `PERFIL-ADMINISTRADOR.md`
