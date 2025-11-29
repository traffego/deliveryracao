# 🐾 Sistema de Delivery - Loja de Ração

Sistema completo de delivery para loja de ração com suporte a múltiplas filiais, pedidos por peso ou valor, e integrações de pagamento.

## 🚀 Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL + Auth + Storage)
- **shadcn/ui**
- **Mercado Pago** + **Efibank**
- **PWA**

## 🎯 Features Principais

### Para Clientes
- ✅ Catálogo de produtos (granel e saco fechado)
- ✅ **Pedido por valor ou quantidade** ("Me dê R$20 de ração X")
- ✅ **Repetir último pedido** (destaque na home)
- ✅ Múltiplas formas de pagamento
- ✅ Rastreamento de pedido em tempo real
- ✅ PWA instalável

### Para Lojistas
- ✅ Dashboard com métricas
- ✅ Gestão de pedidos em tempo real
- ✅ Gestão de produtos e estoque
- ✅ Configuração de frete (fixa/zona/distância)
- ✅ Gestão de entregadores
- ✅ Múltiplas filiais

## 📦 Deploy na Vercel

### Passo 1: Conectar Repositório
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe o repositório: `traffego/deliveryracao`

### Passo 2: Configurar Variáveis de Ambiente
Configure as seguintes variáveis no painel da Vercel:

```bash
# Supabase (configure depois de criar o projeto)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mercado Pago
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=
MERCADO_PAGO_ACCESS_TOKEN=

# Efibank
NEXT_PUBLIC_EFIBANK_CLIENT_ID=
EFIBANK_CLIENT_SECRET=

# App
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

### Passo 3: Deploy
1. Clique em "Deploy"
2. Aguarde o build
3. Acesse a URL gerada!

## 🏗️ Próximos Passos de Desenvolvimento

1. ✅ Setup inicial do Next.js
2. ⏳ Configurar Supabase e criar database
3. ⏳ Instalar e configurar shadcn/ui
4. ⏳ Implementar autenticação
5. ⏳ Criar estrutura multi-tenant
6. ⏳ Implementar CRUD de produtos
7. ⏳ Sistema de pedidos
8. ⏳ Integrações de pagamento
9. ⏳ PWA

## 📱 Estrutura de URLs

- `/` - Landing page
- `/loja/[slug]` - Página da loja específica
- `/loja/[slug]/produtos` - Catálogo
- `/loja/[slug]/checkout` - Checkout
- `/admin` - Painel do lojista
- `/super-admin` - Gestão de lojas (admin principal)

## 🔧 Desenvolvimento Local (quando npm estiver funcionando)

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

---

**Status**: 🟢 Em desenvolvimento ativo
**Última atualização**: 2025-11-29
