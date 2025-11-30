---
description: Validação para operações críticas (SQL, deploy, migrations)
---

# Checklist de Validação - OBRIGATÓRIO seguir antes de operações críticas

## Para SQL Migrations:

1. **SEMPRE** ver o arquivo fonte completo primeiro usando `view_file`
2. **NUNCA** reescrever SQL de memória - copiar exatamente do arquivo
3. Mostrar o SQL completo ao usuário para revisão
4. Listar TODAS as colunas/campos sendo adicionados
5. Aguardar confirmação explícita antes de pedir execução

## Para API Routes:

1. Ver o schema do banco de dados completo
2. Mapear TODOS os campos necessários
3. Verificar se há campos obrigatórios faltando
4. Testar localmente antes de fazer push

## Para Deploy/Push:

1. Revisar todos os arquivos modificados
2. Verificar se há erros de typescript/lint
3. Confirmar que testes passaram (se houver)
4. Aguardar aprovação do usuário

## Quando houver erro:

1. Ler a mensagem de erro COMPLETA
2. Ver o arquivo/schema relacionado
3. Verificar a diferença entre o esperado e o atual
4. Corrigir com base em fatos, não suposições
