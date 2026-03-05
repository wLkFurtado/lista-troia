export type LeadStatus = 'aguardando' | 'entrou'

export type ListaTipo = 'aniversario' | 'convencional'

export type Lead = {
  id: string
  nome_completo: string
  telefone: string
  fonte_lead: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  data_cadastro: string // ISO string
  status: LeadStatus
  data_entrada: string | null // ISO string or null
}

export type Lista = {
  id: string
  tipo: ListaTipo
  nome_responsavel: string
  telefone: string
  fonte_lead: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  data_cadastro: string
  status: LeadStatus
  data_entrada: string | null
  data_evento: string
}

export type ListaComConvidados = Lista & {
  convidados: Convidado[]
  total_convidados: number
}

export type Convidado = {
  id: string
  lista_id: string
  nome: string
  status: LeadStatus
  data_entrada: string | null
}
