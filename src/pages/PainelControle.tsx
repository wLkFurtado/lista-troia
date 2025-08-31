import React, { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Lead, LeadStatus } from '@/types/lead'
import { getLeads, saveLeads, updateLead } from '@/utils/storage'
import { toast } from 'sonner'
import { updateLeadStatusSupabase } from '@/integrations/supabase/leads'
function formatPhoneBR(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length >= 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }
  if (digits.length >= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`
  }
  return phone
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  const dd = d.toLocaleDateString('pt-BR')
  const hh = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${dd} ${hh}`
}

function withinRange(iso: string, range: string) {
  const d = new Date(iso)
  const now = new Date()
  const start = new Date()
  switch (range) {
    case 'hoje':
      return d.toDateString() === now.toDateString()
    case 'ontem':
      start.setDate(now.getDate() - 1)
      return d.toDateString() === start.toDateString()
    case '7dias':
      start.setDate(now.getDate() - 7)
      return d >= start
    case '30dias':
      start.setDate(now.getDate() - 30)
      return d >= start
    default:
      return true
  }
}

const STATUS_OPTIONS: { label: string; value: 'todos' | LeadStatus }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Não conferido', value: 'aguardando' },
  { label: 'Já entrou', value: 'entrou' },
]

const DATE_OPTIONS = [
  { label: 'Todos', value: 'todos' },
  { label: 'Hoje', value: 'hoje' },
  { label: 'Ontem', value: 'ontem' },
  { label: 'Última semana', value: '7dias' },
  { label: 'Último mês', value: '30dias' },
]

const SOURCE_ALL = 'todas'

const Header: React.FC = () => (
  <header className="w-full py-6">
    <h1 className="text-2xl font-bold text-center">PAINEL DE CONTROLE - LISTA VIP</h1>
  </header>
)

export default function PainelControle() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'todos' | LeadStatus>('todos')
  const [dateRange, setDateRange] = useState('todos')
  const [source, setSource] = useState<string>(SOURCE_ALL)
  const [items, setItems] = useState<Lead[]>([])

  useEffect(() => {
    document.title = 'Painel de Controle - Lista VIP'
    const data = getLeads<Lead>()
    setItems(data)
  }, [])

  const sources = useMemo(() => {
    const set = new Set<string>(items.map((i) => i.fonte_lead || 'Direto'))
    return [SOURCE_ALL, ...Array.from(set)]
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter((it) => (status === 'todos' ? true : it.status === status))
      .filter((it) => (source === SOURCE_ALL ? true : it.fonte_lead === source))
      .filter((it) => withinRange(it.data_cadastro, dateRange))
      .filter((it) =>
        q
          ? it.nome_completo.toLowerCase().includes(q) || it.telefone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
          : true
      )
      .sort((a, b) => (a.data_cadastro < b.data_cadastro ? 1 : -1))
      .slice(0, 50)
  }, [items, query, status, source, dateRange])

  const stats = useMemo(() => {
    const today = items.filter((i) => withinRange(i.data_cadastro, 'hoje')).length
    const entered = items.filter((i) => i.status === 'entrou').length
    const waiting = items.filter((i) => i.status === 'aguardando').length
    return { today, entered, waiting }
  }, [items])

  async function setStatusFor(id: string, next: LeadStatus) {
    const target = items.find((i) => i.id === id)
    if (!target) return

    const now = new Date().toISOString()
    const nextEntrada = next === 'entrou' ? now : null

    // Otimista: atualiza UI e storage imediatamente
    const prevItems = items
    const updated = items.map((i) =>
      i.id === id ? { ...i, status: next, data_entrada: nextEntrada } : i
    )
    setItems(updated)
    saveLeads(updated)

    try {
      const { error } = await updateLeadStatusSupabase({
        telefone: target.telefone,
        data_cadastro: target.data_cadastro,
        status: next,
        data_entrada: nextEntrada,
      })
      if (error) {
        // Reverte em caso de falha
        setItems(prevItems)
        saveLeads(prevItems)
        toast.error('Falha ao atualizar no banco. Tente novamente.')
        return
      }
      toast.success('Status atualizado!')
    } catch (err) {
      console.error('[Supabase] Erro inesperado ao atualizar status:', err)
      setItems(prevItems)
      saveLeads(prevItems)
      toast.error('Erro inesperado ao atualizar. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen w-screen bg-black text-foreground">
      <main className="container py-6">
        <Header />

        <section className="bg-card rounded-xl p-4 md:p-6 shadow">
          {/* Search and filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="md:max-w-sm"
            />

            <div className="flex gap-2 flex-wrap">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Por Data" /></SelectTrigger>
                <SelectContent>
                  {DATE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Por Status" /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Por Fonte" /></SelectTrigger>
                <SelectContent>
                  {sources.map((s) => (
                    <SelectItem key={s} value={s}>{s === SOURCE_ALL ? 'Todas as fontes' : s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Cadastros hoje</div>
                <div className="text-2xl font-bold">{stats.today}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Já entraram</div>
                <div className="text-2xl font-bold">{stats.entered}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Aguardando</div>
                <div className="text-2xl font-bold">{stats.waiting}</div>
              </CardContent>
            </Card>
          </div>

          {/* List */}
          <div className="mt-6 grid gap-3">
            {filtered.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="font-semibold text-brand-neutral700">{p.nome_completo}</div>
                    <div className="text-sm text-brand-neutral500">{formatPhoneBR(p.telefone)}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {p.fonte_lead || 'Direto'} • {formatDateTime(p.data_cadastro)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={p.status === 'entrou' ? 'default' : 'secondary'}>
                      {p.status === 'entrou' ? 'Já entrou' : 'Não conferido'}
                    </Badge>

                    {p.status === 'aguardando' ? (
                      <Button
                        onClick={() => setStatusFor(p.id, 'entrou')}
                        className="bg-gradient-to-r from-brand-success to-brand-success2 text-white"
                      >
                        ✓ Confirmar entrada
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setStatusFor(p.id, 'aguardando')}
                      >
                        ↺ Desfazer
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filtered.length === 0 && (
              <div className="text-center text-muted-foreground py-10">Nenhum registro encontrado.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
