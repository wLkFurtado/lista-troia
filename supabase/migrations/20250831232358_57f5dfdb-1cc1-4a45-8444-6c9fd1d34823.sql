
-- Permite que clientes anônimos atualizem registros na tabela leads
-- (necessário para o Painel, que não usa autenticação)
create policy "Allow anonymous updates to leads"
on public.leads
for update
to anon
using (true)
with check (true);
