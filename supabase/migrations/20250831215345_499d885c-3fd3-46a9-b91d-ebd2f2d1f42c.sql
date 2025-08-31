
-- 1) Enum para status dos leads (criação segura caso ainda não exista)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE public.lead_status AS ENUM ('aguardando', 'entrou');
  END IF;
END$$;

-- 2) Tabela principal de leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo TEXT NOT NULL,
  telefone TEXT NOT NULL,
  fonte_lead TEXT NULL,
  utm_source TEXT NULL,
  utm_medium TEXT NULL,
  utm_campaign TEXT NULL,
  data_cadastro TIMESTAMPTZ NOT NULL DEFAULT now(),
  status public.lead_status NOT NULL DEFAULT 'aguardando',
  data_entrada TIMESTAMPTZ NULL
);

-- 3) Índices úteis para buscas e filtros
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_data_cadastro ON public.leads (data_cadastro DESC);
CREATE INDEX IF NOT EXISTS idx_leads_fonte_lead ON public.leads (fonte_lead);
CREATE INDEX IF NOT EXISTS idx_leads_telefone ON public.leads (telefone);
CREATE INDEX IF NOT EXISTS idx_leads_nome_lower ON public.leads ((lower(nome_completo)));

-- 4) RLS e políticas
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Permite que visitantes anônimos (landing page) insiram registros
CREATE POLICY "Allow anonymous inserts to leads"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Permite acesso completo para usuários autenticados (painel/admin)
CREATE POLICY "Allow authenticated full access to leads"
ON public.leads
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
