
import { supabase } from "@/integrations/supabase/client";
import type { ListaTipo, LeadStatus } from "@/types/lead";

// ==========================================
// LISTAS (novo sistema)
// ==========================================

export type ListaInsert = {
  tipo: ListaTipo;
  nome_responsavel: string;
  telefone: string;
  fonte_lead?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  data_evento: string;
};

/**
 * Insere uma nova lista e seus convidados.
 * Retorna o ID da lista criada.
 */
export async function insertListaComConvidados(
  lista: ListaInsert,
  convidados: string[]
): Promise<{ id: string | null; error: unknown }> {
  // 1) Inserir a lista
  const { data: listaData, error: listaError } = await supabase
    .from("listas")
    .insert([{
      tipo: lista.tipo,
      nome_responsavel: lista.nome_responsavel,
      telefone: lista.telefone,
      fonte_lead: lista.fonte_lead ?? null,
      utm_source: lista.utm_source ?? null,
      utm_medium: lista.utm_medium ?? null,
      utm_campaign: lista.utm_campaign ?? null,
      data_evento: lista.data_evento,
    }])
    .select("id")
    .single();

  if (listaError || !listaData) {
    console.error("[Supabase] Erro ao inserir lista:", listaError);
    return { id: null, error: listaError };
  }

  const listaId = listaData.id;

  // 2) Inserir convidados (se houver)
  if (convidados.length > 0) {
    const rows = convidados.map((nome) => ({
      lista_id: listaId,
      nome,
    }));

    const { error: convError } = await supabase
      .from("lista_convidados")
      .insert(rows);

    if (convError) {
      console.error("[Supabase] Erro ao inserir convidados:", convError);
      return { id: listaId, error: convError };
    }
  }

  return { id: listaId, error: null };
}

/**
 * Verifica se um telefone já existe na tabela listas.
 */
export async function checkDuplicatePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const { data, error } = await supabase
    .from("listas")
    .select("id")
    .eq("telefone", digits)
    .limit(1);

  if (error) {
    console.error("[Supabase] Erro ao verificar duplicata:", error);
    return { isDuplicate: false, error };
  }

  return { isDuplicate: (data?.length ?? 0) > 0, error: null };
}

// ==========================================
// PAINEL DE CONTROLE
// ==========================================

export type ListaRow = {
  id: string;
  tipo: ListaTipo;
  nome_responsavel: string;
  telefone: string;
  fonte_lead: string | null;
  data_cadastro: string;
  status: LeadStatus;
  data_entrada: string | null;
  data_evento: string | null;
  total_convidados: number;
};

/**
 * Busca listas do Supabase com filtros e paginação.
 */
export async function fetchListasSupabase(params: {
  search?: string;
  status?: LeadStatus | "todos";
  tipo?: ListaTipo | "todos";
  dateRange?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: ListaRow[]; count: number; error: unknown }> {
  const {
    search = "",
    status = "todos",
    tipo = "todos",
    dateRange = "todos",
    page = 0,
    pageSize = 25,
  } = params;

  // Usamos uma query com contagem de convidados
  let query = supabase
    .from("listas")
    .select("*, lista_convidados(count)", { count: "exact" });

  if (status !== "todos") {
    query = query.eq("status", status);
  }

  if (tipo !== "todos") {
    query = query.eq("tipo", tipo);
  }

  const toISODateYMD = (d: Date) => {
    const ano = d.getFullYear();
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const dia = d.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  if (dateRange && dateRange !== "todos") {
    // Check if it's a specific YYYY-MM-DD date
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateRange)) {
      query = query.eq("data_evento", dateRange);
    } else {
      const now = new Date();
      switch (dateRange) {
        case "hoje":
          query = query.eq("data_evento", toISODateYMD(now));
          break;
        case "ontem": {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          query = query.eq("data_evento", toISODateYMD(yesterday));
          break;
        }
        case "7dias": {
          const d = new Date(now);
          d.setDate(now.getDate() - 7);
          query = query.gte("data_evento", toISODateYMD(d));
          break;
        }
        case "30dias": {
          const d = new Date(now);
          d.setDate(now.getDate() - 30);
          query = query.gte("data_evento", toISODateYMD(d));
          break;
        }
      }
    }
  }

  if (search.trim()) {
    const q = search.trim();
    const digits = q.replace(/\D/g, "");

    // Deep search for guest names (lista_convidados) matching query
    const { data: guestsListIds } = await supabase
      .from('lista_convidados')
      .select('lista_id')
      .ilike('nome', `%${q}%`);
      
    const matchingIds = guestsListIds?.map(g => g.lista_id) || [];
    const inFilter = matchingIds.length > 0 ? `,id.in.(${matchingIds.join(',')})` : '';

    if (digits.length > 0) {
      query = query.or(`nome_responsavel.ilike.%${q}%,telefone.ilike.%${digits}%${inFilter}`);
    } else {
      if (matchingIds.length > 0) {
        query = query.or(`nome_responsavel.ilike.%${q}%${inFilter}`);
      } else {
        query = query.ilike("nome_responsavel", `%${q}%`);
      }
    }
  }

  query = query
    .order("data_cadastro", { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("[Supabase] Erro ao buscar listas:", error);
    return { data: [], count: 0, error };
  }

  // Mapear resultado para incluir total_convidados
  const rows: ListaRow[] = (data ?? []).map((row: Record<string, unknown>) => {
    const convidadosArr = row.lista_convidados as Array<{ count: number }> | undefined;
    return {
      id: row.id as string,
      tipo: row.tipo as ListaTipo,
      nome_responsavel: row.nome_responsavel as string,
      telefone: row.telefone as string,
      fonte_lead: row.fonte_lead as string | null,
      data_cadastro: row.data_cadastro as string,
      status: row.status as LeadStatus,
      data_entrada: row.data_entrada as string | null,
      data_evento: row.data_evento as string | null,
      total_convidados: convidadosArr?.[0]?.count ?? 0,
    };
  });

  return { data: rows, count: count ?? 0, error: null };
}

/**
 * Busca os convidados de uma lista específica.
 */
export async function fetchConvidados(listaId: string) {
  const { data, error } = await supabase
    .from("lista_convidados")
    .select("id, nome, status, data_entrada")
    .eq("lista_id", listaId)
    .order("status", { ascending: false }) // 'aguardando' vem antes de 'entrou'
    .order("nome");

  if (error) {
    console.error("[Supabase] Erro ao buscar convidados:", error);
    return { data: [], error };
  }

  return { data: data ?? [], error: null };
}

/**
 * Atualiza o status de uma lista pelo ID.
 */
export async function updateListaStatus(params: {
  id: string;
  status: LeadStatus;
  data_entrada: string | null;
}) {
  const { data, error } = await supabase
    .from("listas")
    .update({
      status: params.status,
      data_entrada: params.data_entrada ?? null,
    })
    .eq("id", params.id);

  if (error) {
    console.error("[Supabase] Erro ao atualizar status:", error);
    return { data: null, error } as const;
  }

  return { data, error: null } as const;
}

/**
 * Atualiza o status de um convidado específico.
 */
export async function updateConvidadoStatus(params: {
  id: string;
  status: LeadStatus;
  data_entrada: string | null;
}) {
  const { data, error } = await supabase
    .from("lista_convidados")
    .update({
      status: params.status,
      data_entrada: params.data_entrada ?? null,
    })
    .eq("id", params.id);

  if (error) {
    console.error("[Supabase] Erro ao atualizar status do convidado:", error);
    return { data: null, error } as const;
  }

  return { data, error: null } as const;
}

/**
 * Busca todas as listas para exportação (sem paginação).
 */
export async function fetchAllListasForExport(params: {
  search?: string;
  status?: LeadStatus | "todos";
  tipo?: ListaTipo | "todos";
  dateRange?: string;
}): Promise<{ data: ListaRow[]; error: unknown }> {
  const {
    search = "",
    status = "todos",
    tipo = "todos",
    dateRange = "todos",
  } = params;

  let query = supabase
    .from("listas")
    .select("*, lista_convidados(count)");

  if (status !== "todos") query = query.eq("status", status);
  if (tipo !== "todos") query = query.eq("tipo", tipo);

  const toISODateYMD = (d: Date) => {
    const ano = d.getFullYear();
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const dia = d.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  if (dateRange && dateRange !== "todos") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateRange)) {
      query = query.eq("data_evento", dateRange);
    } else {
      const now = new Date();
      switch (dateRange) {
        case "hoje":
          query = query.eq("data_evento", toISODateYMD(now));
          break;
        case "ontem": {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          query = query.eq("data_evento", toISODateYMD(yesterday));
          break;
        }
        case "7dias": {
          const d = new Date(now);
          d.setDate(now.getDate() - 7);
          query = query.gte("data_evento", toISODateYMD(d));
          break;
        }
      }
    }
  }

  if (search.trim()) {
    const q = search.trim();
    const digits = q.replace(/\D/g, "");

    const { data: guestsListIds } = await supabase
      .from('lista_convidados')
      .select('lista_id')
      .ilike('nome', `%${q}%`);

    const matchingIds = guestsListIds?.map(g => g.lista_id) || [];
    const inFilter = matchingIds.length > 0 ? `,id.in.(${matchingIds.join(',')})` : '';

    if (digits.length > 0) {
      query = query.or(`nome_responsavel.ilike.%${q}%,telefone.ilike.%${digits}%${inFilter}`);
    } else if (matchingIds.length > 0) {
      query = query.or(`nome_responsavel.ilike.%${q}%${inFilter}`);
    } else {
      query = query.ilike("nome_responsavel", `%${q}%`);
    }
  }

  query = query.order("data_cadastro", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("[Supabase] Erro ao exportar listas:", error);
    return { data: [], error };
  }

  const rows: ListaRow[] = (data ?? []).map((row: Record<string, unknown>) => {
    const convidadosArr = row.lista_convidados as Array<{ count: number }> | undefined;
    return {
      id: row.id as string,
      tipo: row.tipo as ListaTipo,
      nome_responsavel: row.nome_responsavel as string,
      telefone: row.telefone as string,
      fonte_lead: row.fonte_lead as string | null,
      data_cadastro: row.data_cadastro as string,
      status: row.status as LeadStatus,
      data_entrada: row.data_entrada as string | null,
      data_evento: row.data_evento as string | null,
      total_convidados: convidadosArr?.[0]?.count ?? 0,
    };
  });

  return { data: rows, error: null };
}

/**
 * Confirma todos os convidados pendentes de uma lista.
 */
export async function confirmAllConvidados(listaId: string) {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("lista_convidados")
    .update({ status: 'entrou', data_entrada: now })
    .eq("lista_id", listaId)
    .eq("status", "aguardando");

  if (error) {
    console.error("[Supabase] Erro ao confirmar todos os convidados:", error);
    return { error };
  }

  return { error: null };
}

/**
 * Busca estatísticas de listas.
 */
export async function fetchListaStats() {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = (now.getMonth() + 1).toString().padStart(2, '0');
  const dia = now.getDate().toString().padStart(2, '0');
  const todayStr = `${ano}-${mes}-${dia}`;

  const [
    todayRes, 
    enteredRes, 
    waitingRes, 
    totalRes,
    todayConvidadosRes,
    enteredConvidadosRes,
    waitingConvidadosRes,
    totalConvidadosRes,
  ] = await Promise.all([
    supabase.from("listas").select("id", { count: "exact", head: true }).eq("data_evento", todayStr),
    supabase.from("listas").select("id", { count: "exact", head: true }).eq("status", "entrou"),
    supabase.from("listas").select("id", { count: "exact", head: true }).eq("status", "aguardando"),
    supabase.from("listas").select("id", { count: "exact", head: true }),
    supabase.from("lista_convidados").select("id, listas!inner(id)", { count: "exact", head: true }).eq("listas.data_evento", todayStr),
    supabase.from("lista_convidados").select("id", { count: "exact", head: true }).eq("status", "entrou"),
    supabase.from("lista_convidados").select("id", { count: "exact", head: true }).eq("status", "aguardando"),
    supabase.from("lista_convidados").select("id", { count: "exact", head: true }),
  ]);

  return {
    today: (todayRes.count ?? 0) + (todayConvidadosRes.count ?? 0),
    entered: (enteredRes.count ?? 0) + (enteredConvidadosRes.count ?? 0),
    waiting: (waitingRes.count ?? 0) + (waitingConvidadosRes.count ?? 0),
    total: (totalRes.count ?? 0) + (totalConvidadosRes.count ?? 0),
  };
}