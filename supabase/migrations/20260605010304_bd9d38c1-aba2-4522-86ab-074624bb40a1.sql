CREATE TABLE public.datas_bloqueadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.datas_bloqueadas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.datas_bloqueadas TO authenticated;
GRANT ALL ON public.datas_bloqueadas TO service_role;

ALTER TABLE public.datas_bloqueadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read datas_bloqueadas" ON public.datas_bloqueadas FOR SELECT USING (true);
CREATE POLICY "Anyone can insert datas_bloqueadas" ON public.datas_bloqueadas FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete datas_bloqueadas" ON public.datas_bloqueadas FOR DELETE USING (true);