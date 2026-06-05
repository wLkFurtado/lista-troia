## Objetivo

Permitir bloquear datas em que não haverá lista, e avisar o cliente no formulário VIP quando ele escolher uma dessas datas (sem impedir o envio).

## Etapas

### 1. Banco de dados
Criar tabela `datas_bloqueadas`:
- `data` (DATE, único) — o dia bloqueado
- `created_at` (timestamptz)
- RLS aberta (igual a `listas`): qualquer um lê, insere e deleta, para manter o padrão atual do painel sem login.

### 2. Painel de controle — nova aba "Datas sem lista"
No topo do `/painel-controle`, adicionar abas: **Listas** (atual) e **Datas sem lista** (nova).

Na nova aba:
- Calendário em destaque (componente `Calendar` do shadcn, mode multiple).
- Clique em um dia: alterna entre bloqueado (dourado/riscado) e livre.
- Lista lateral das próximas datas bloqueadas com botão "X" para remover.
- Botão "Bloquear" e "Desbloquear" para feedback imediato.
- Toast confirmando cada ação.

### 3. Formulário VIP — aviso visual
Em `VipForm.tsx`, na etapa "Data":
- Carregar as datas bloqueadas ao montar o componente.
- Marcar os dias bloqueados no calendário com estilo diferente (cinza/riscado), mas ainda **selecionáveis**.
- Quando o cliente seleciona um dia bloqueado, exibir um alerta dourado abaixo do calendário: *"⚠ Não haverá lista nesse dia. Confira se a data está correta antes de continuar."*
- O fluxo continua normalmente — o cliente pode prosseguir.

## Detalhes técnicos

- Nova tabela `public.datas_bloqueadas` com GRANTs para `anon`, `authenticated` e `service_role` (mesmo padrão de `listas`).
- Novas funções em `src/integrations/supabase/leads.ts`: `fetchDatasBloqueadas()`, `addDataBloqueada(data)`, `removeDataBloqueada(data)`.
- Regenerar `types.ts` automaticamente após a migration.
- Novo componente `src/components/DatasBloqueadasPanel.tsx` para a aba.
- `PainelControle.tsx` ganha estado `activeTab` ("listas" | "bloqueadas") e o componente `Tabs` do shadcn.
- `VipForm.tsx`: usar `modifiers` + `modifiersClassNames` do `Calendar` para riscar dias bloqueados, e renderizar o aviso condicional.
