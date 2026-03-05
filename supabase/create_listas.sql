-- Tabela de listas VIP (aniversário ou convencional)
CREATE TABLE listas (
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

-- Caso a tabela já exista e precise adicionar a coluna:
-- ALTER TABLE listas ADD COLUMN data_evento DATE;

ALTER TABLE listas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert listas" ON listas FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read listas" ON listas FOR SELECT USING (true);
CREATE POLICY "Anyone can update listas" ON listas FOR UPDATE USING (true);

-- Tabela de convidados vinculados a uma lista
CREATE TABLE lista_convidados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lista_id UUID NOT NULL REFERENCES listas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL
);

ALTER TABLE lista_convidados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert convidados" ON lista_convidados FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read convidados" ON lista_convidados FOR SELECT USING (true);
CREATE POLICY "Anyone can delete convidados" ON lista_convidados FOR DELETE USING (true);
CREATE POLICY "Anyone can update convidados" ON lista_convidados FOR UPDATE USING (true);
