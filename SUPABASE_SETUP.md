# 🔧 Configuração do Supabase

## ✅ Credenciais Obtidas

Suas credenciais do Supabase estão prontas! 

## 📋 Próximos Passos

### 1️⃣ Executar Migrations no Supabase

Acesse o painel do Supabase e execute as migrations:

**URL:** https://supabase.com/dashboard/project/ctuptroylgansswbgcpu

1. Vá em **SQL Editor** no menu lateral
2. Clique em **New Query**
3. Cole o conteúdo do arquivo `supabase/migrations/001_initial_schema.sql`
4. Clique em **Run** (ou Ctrl+Enter)
5. Aguarde a confirmação ✅

6. Repita o processo com `supabase/migrations/002_rls_policies.sql`

### 2️⃣ Configurar Variáveis de Ambiente na Vercel

Acesse: https://vercel.com/seu-usuario/deliveryracao/settings/environment-variables

Adicione as seguintes variáveis:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ctuptroylgansswbgcpu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dXB0cm95bGdhbnNzd2JnY3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDY0MDAsImV4cCI6MjA3OTk4MjQwMH0.q7TDVjN9hkGtpl5iMo6KDbbEsgyGLljwY-blJjEzOgY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dXB0cm95bGdhbnNzd2JnY3B1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQwNjQwMCwiZXhwIjoyMDc5OTgyNDAwfQ.pVKQOvh72dRMSfuaiUR7KdGADUJJmcrjuJQD21M3uis

# App URL (ajustar para a URL da Vercel)
NEXT_PUBLIC_APP_URL=https://seu-projeto.vercel.app
```

**⚠️ IMPORTANTE:**
- Cole cada variável separadamente
- Marque "All Environments" para aplicar em todos os ambientes
- Clique em "Save" após adicionar todas

### 3️⃣ Redeployar na Vercel

Após adicionar as variáveis, force um novo deploy:
- No painel da Vercel, vá em **Deployments**
- Clique em **Redeploy** no último deployment
- Ou faça um novo commit no GitHub (deploy automático)

---

## 🎯 Depois da Configuração

Assim que o deploy terminar, o sistema estará pronto com:
- ✅ Banco de dados Supabase configurado
- ✅ Autenticação funcionando
- ✅ Multi-tenant pronto
- ✅ Todas as tabelas e políticas de segurança

**Me avise quando terminar de executar as migrations!**
Vou então continuar com os componentes da interface.
