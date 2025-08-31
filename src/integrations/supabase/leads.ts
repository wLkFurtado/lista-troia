
import { supabase } from "@/integrations/supabase/client";

export type LeadInsert = {
  nome_completo: string;
  telefone: string;
  fonte_lead?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  data_cadastro?: string; // ISO
  status?: "aguardando" | "entrou";
  data_entrada?: string | null; // ISO | null
};

/**
 * Insere um lead na tabela 'leads' do Supabase.
 * Observação: o ID é gerado pelo banco, então não envie 'id' aqui.
 */
export async function insertLeadSupabase(payload: LeadInsert) {
  console.log("[Supabase] Inserindo lead...", payload);
  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        ...payload,
        // Normaliza undefined -> null para colunas opcionais
        fonte_lead: payload.fonte_lead ?? null,
        utm_source: payload.utm_source ?? null,
        utm_medium: payload.utm_medium ?? null,
        utm_campaign: payload.utm_campaign ?? null,
        data_entrada: payload.data_entrada ?? null,
      },
    ])
    .select()
    .maybeSingle();

  if (error) {
    console.error("[Supabase] Erro ao inserir lead:", error);
    return { data: null, error };
  }

  console.log("[Supabase] Lead inserido com sucesso:", data);
  return { data, error: null };
}
