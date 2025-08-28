import { useMemo } from 'react'

export type UTMParams = {
  utm_source: string
  utm_medium: string
  utm_campaign: string
}

export function mapLeadSource(utmSource: string): string {
  const src = (utmSource || '').toLowerCase()
  if (!src) return 'Direto'
  if (src.includes('instagram')) return 'Instagram'
  if (src.includes('facebook')) return 'Facebook'
  if (src.includes('whatsapp')) return 'WhatsApp'
  if (src.includes('influencer') || src.includes('influenciador')) return 'Influencer'
  return 'Outros'
}

export function useUTM(): UTMParams & { fonte_lead: string } {
  return useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const utm_source = urlParams.get('utm_source') || 'Direto'
    const utm_medium = urlParams.get('utm_medium') || ''
    const utm_campaign = urlParams.get('utm_campaign') || ''
    const fonte_lead = mapLeadSource(utm_source)
    return { utm_source, utm_medium, utm_campaign, fonte_lead }
  }, [])
}
