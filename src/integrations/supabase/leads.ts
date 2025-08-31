
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
    ]);

  if (error) {
    console.error("[Supabase] Erro ao inserir lead:", error);
    return { data: null, error };
  }

  console.log("[Supabase] Lead inserido com sucesso:", data);
  return { data, error: null };
}

/**
 * Atualiza o status de um lead usando os campos locais (telefone + data_cadastro) como filtro.
 * Evita necessidade do ID do banco, que não está disponível no Painel.
 */
export async function updateLeadStatusSupabase(params: {
  telefone: string;
  data_cadastro: string; // ISO
  status: "aguardando" | "entrou";
  data_entrada: string | null; // ISO | null
}) {
  const payload: Partial<LeadInsert> = {
    status: params.status,
    data_entrada: params.data_entrada ?? null,
  };

  console.log("[Supabase] Atualizando status do lead...", {
    telefone: params.telefone,
    data_cadastro: params.data_cadastro,
    payload,
  });

  const { data, error } = await supabase
    .from("leads")
    .update(payload)
    .eq("telefone", params.telefone)
    .eq("data_cadastro", params.data_cadastro);

  if (error) {
    console.error("[Supabase] Erro ao atualizar status do lead:", error);
    return { data: null, error } as const;
  }

  console.log("[Supabase] Status atualizado com sucesso:", data);
  return { data, error: null } as const;
}