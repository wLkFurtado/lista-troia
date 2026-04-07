
CREATE TABLE public.listas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('aniversario', 'convencional')),
  nome_responsavel TEXT NOT NULL,
  telefone TEXT NOT NULL,
  fonte_lead TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  data_cadastro TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'entrou')),
  data_entrada TIMESTAMPTZ,
  data_evento DATE
);

ALTER TABLE public.listas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert listas" ON public.listas FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read listas" ON public.listas FOR SELECT USING (true);
CREATE POLICY "Anyone can update listas" ON public.listas FOR UPDATE USING (true);

CREATE TABLE public.lista_convidados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lista_id UUID NOT NULL REFERENCES public.listas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  status TEXT DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'entrou')),
  data_entrada TIMESTAMPTZ
);

ALTER TABLE public.lista_convidados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert convidados" ON public.lista_convidados FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read convidados" ON public.lista_convidados FOR SELECT USING (true);
CREATE POLICY "Anyone can update convidados" ON public.lista_convidados FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete convidados" ON public.lista_convidados FOR DELETE USING (true);
