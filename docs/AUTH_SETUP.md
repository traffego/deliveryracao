# 🔐 Sistema de Autenticação - Guia de Setup

## 📋 Passos para Configurar

### 1. Executar Migration no Supabase

Acesse o painel do Supabase e execute o SQL:

```bash
Dashboard Supabase → SQL Editor → New Query
```

Copie e cole o conteúdo de: `/supabase/migrations/003_auth_system.sql`

### 2. Criar Primeiro Usuário Admin

No SQL Editor do Supabase, execute:

```sql
-- Substituir EMAIL e SENHA pelos seus dados!
SELECT extensions.create_admin_user(
    'seu-email@exemplo.com',
    'SuaSenhaSegura123!'
);
```

Ou criar manualmente via Dashboard:
1. Authentication → Users → Add User
2. Email: `admin@doglivery.com`
3.Senha: (sua senha segura)
4. Metadata (raw JSON):
```json
{
  "role": "admin",
  "full_name": "Administrador",
  "phone": ""
}
```

### 3. Configurar Variáveis de Ambiente

Certifique-se que `.env.local` tem:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
```

### 4. Testar Sistema

#### 4.1 Cadastro de Cliente:
- Ir para checkout
- Preencher dados
- Ver modal de cadastro rápido
- Senha é gerada automaticamente

#### 4.2 Login de Admin:
- Acessar `/admin/login`
- Entrar com email e senha

## 🎯 Fluxos Implementados

### Cliente (Super Simples):
1. **Checkout** → Preenche nome + telefone
2. **Modal aparece** → "Criar conta rápida?"
3. **Clica "Criar"** → Senha gerada automaticamente e mostrada
4. **Senha exibida** por 5 segundos
5. **Login automático** → Pedido vinculado ao usuário
6. **Próximos pedidos** → Reconhece pelo telefone

### Admin (Seguro):
1. **Acessa** `/admin/login`
2. **Digite** email + senha
3. **Verificação** de role
4. **Acesso** ao dashboard

## 🔒 Segurança Implementada

- ✅ Row Level Security (RLS) no Supabase
- ✅ Senhas criptografadas
- ✅ Sessões persistentes
- ✅ Roles separados (customer/admin)
- ✅ Policies de acesso por role
- ✅ Pedidos vinculados a usuários

## 📊 Estrutura do Banco

### Tabela: `profiles`
- `id` (UUID) - FK para auth.users
- `email` (TEXT)
- `phone` (TEXT) - UNIQUE
- `full_name` (TEXT)
- `role` (TEXT) - 'customer' ou 'admin'

### Tabela: `orders` (atualizada)
- `user_id` (UUID) - FK para auth.users
- Outros campos existentes...

## 🚀 Próximos Passos

1. Integrar QuickAuthModal no checkout
2. Proteger rotas de admin com middleware
3. Mostrar "Meus Pedidos" apenas para usuários autenticados
4. Adicionar botão de logout

## 🐛 Troubleshooting

**Erro: "User not found"**
- Verificar se migration foi executada
- Verificar se RLS está habilitado

**Erro: "Access denied"**
- Verificar role do usuário
- Verificar policies

**Cliente não consegue criar conta:**
- Verificar se telefone já está cadastrado
- Ver logs no Supabase Dashboard
