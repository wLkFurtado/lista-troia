export type LeadStatus = 'aguardando' | 'entrou'

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
