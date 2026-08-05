DROP POLICY IF EXISTS "Authenticated can insert datas_bloqueadas" ON public.datas_bloqueadas;
DROP POLICY IF EXISTS "Authenticated can delete datas_bloqueadas" ON public.datas_bloqueadas;

CREATE POLICY "Anyone can insert datas_bloqueadas"
  ON public.datas_bloqueadas FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can delete datas_bloqueadas"
  ON public.datas_bloqueadas FOR DELETE TO anon, authenticated USING (true);

GRANT SELECT, INSERT, DELETE ON public.datas_bloqueadas TO anon;
GRANT SELECT, INSERT, DELETE ON public.datas_bloqueadas TO authenticated;