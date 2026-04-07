

## Problem Analysis

There are two distinct issues to fix:

### 1. Build Errors — Missing `listas` and `lista_convidados` in Supabase types

The `types.ts` file doesn't have the `listas` and `lista_convidados` tables defined. The code in `leads.ts` references these tables via the typed Supabase client, causing "not assignable to parameter of type 'never'" errors. Additionally, there are unused import warnings in `VipForm.tsx` and `Index.tsx`.

### 2. Contrast Issues in Painel de Controle

Looking at the current dark theme, several elements have low contrast:
- Select dropdown items (dark text on dark background)
- Badge "Não conferido" uses `text-zinc-400` on `bg-zinc-800`
- "Cadastrado" timestamp uses `text-zinc-600` which is nearly invisible on dark backgrounds
- The `text-zinc-500` empty state message is hard to read

---

## Plan

### Step 1: Add `listas` and `lista_convidados` tables to `types.ts`

Add both table definitions inside the `Tables` section of `types.ts`, matching the SQL schema from `create_listas.sql`:

- **listas**: id (uuid), tipo (text), nome_responsavel (text), telefone (text), fonte_lead (text|null), utm_source/medium/campaign (text|null), data_cadastro (timestamptz), status (text), data_entrada (timestamptz|null), data_evento (date string|null)
- **lista_convidados**: id (uuid), lista_id (uuid), nome (text), status (text, default 'aguardando'), data_entrada (timestamptz|null)

### Step 2: Fix unused imports

- `VipForm.tsx` line 7: Remove `Users` and `Phone` from the lucide-react import
- `Index.tsx` line 1: Remove unused `React` import

### Step 3: Fix contrast issues in PainelControle.tsx

- Change `text-zinc-600` (timestamp "Cadastrado") to `text-zinc-400`
- Ensure select dropdown content has proper contrast with explicit text colors
- Improve badge contrast for "Não conferido" status

### Technical Details

The `lista_convidados` table in Supabase was extended with `status` and `data_entrada` columns (used in the code), so the type definition must include those even though the original SQL doesn't show them — the code clearly uses them. The types will use string types matching the actual Supabase column types.

