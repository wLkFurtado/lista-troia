import { useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { LeadStatus, ListaTipo, Convidado } from '@/types/lead'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp, Cake, PartyPopper, CheckCircle } from 'lucide-react'
import {
  fetchListasSupabase,
  fetchListaStats,
  fetchConvidados,
  updateListaStatus,
  updateConvidadoStatus,
  type ListaRow,
} from '@/integrations/supabase/leads'

function formatPhoneBR(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length >= 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  if (digits.length >= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`
  return phone
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
}

const STATUS_OPTIONS: { label: string; value: 'todos' | LeadStatus }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Não conferido', value: 'aguardando' },
  { label: 'Já entrou', value: 'entrou' },
]

const TIPO_OPTIONS: { label: string; value: 'todos' | ListaTipo }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Aniversário', value: 'aniversario' },
  { label: 'Convencional', value: 'convencional' },
]

// DATE_OPTIONS removed in favor of native date picker

const PAGE_SIZE = 25

function ExpandableConvidados({ listaId, onStatusChange }: { listaId: string, onStatusChange?: () => void }) {
  const [open, setOpen] = useState(false)
  const [guests, setGuests] = useState<Convidado[]>([])
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    if (!open && guests.length === 0) {
      setLoading(true)
      const { data } = await fetchConvidados(listaId)
      setGuests(data as Convidado[])
      setLoading(false)
    }
    setOpen(!open)
  }

  const handleUpdateGuestStatus = async (guest: Convidado, newStatus: LeadStatus) => {
    const prevGuests = [...guests]
    setGuests(guests.map(g => g.id === guest.id ? { ...g, status: newStatus } : g))

    const dataEntrada = newStatus === 'entrou' ? new Date().toISOString() : null
    const { error } = await updateConvidadoStatus({
      id: guest.id,
      status: newStatus,
      data_entrada: dataEntrada
    })

    if (error) {
      setGuests(prevGuests)
      toast.error('Erro ao atualizar status do convidado.')
    } else {
      toast.success(`Convidado ${guest.nome} atualizado!`)
      if (onStatusChange) onStatusChange()
    }
  }

  return (
    <div className="mt-4 border-t border-gray-800/50 pt-3">
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
      >
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {open ? 'Ocultar convidados' : `Ver convidados`}
      </button>
      
      {open && (
        <div className="mt-3 space-y-2">
          {loading ? (
            <p className="text-sm text-gray-400 italic pl-6">Carregando lista...</p>
          ) : guests.length === 0 ? (
            <p className="text-sm text-gray-400 italic pl-6">Nenhum convidado nessa lista.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 pl-2 mt-4">
              {guests.map((g) => (
                <div 
                  key={g.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-3 px-4 rounded-lg border shadow-sm transition-all ${
                    g.status === 'entrou' 
                      ? 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${g.status === 'entrou' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <span className={`text-sm font-bold uppercase tracking-wide ${g.status === 'entrou' ? 'text-emerald-900' : 'text-gray-800'}`}>
                      {g.nome}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    {g.status === 'aguardando' ? (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-500 font-medium border border-gray-200">
                        Não conferido
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold px-2.5 py-0.5 shadow-none">
                        Já entrou
                      </Badge>
                    )}

                    {g.status === 'aguardando' ? (
                      <Button
                        size="sm"
                        className="h-8 shadow-sm bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 ml-auto sm:ml-0 border-0"
                        onClick={() => handleUpdateGuestStatus(g, 'entrou')}
                      >
                        <CheckCircle size={15} className="mr-1.5" />
                        Confirmar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-gray-300 hover:bg-gray-100 hover:text-gray-900 text-gray-600 px-4 ml-auto sm:ml-0 shadow-sm bg-white"
                        onClick={() => handleUpdateGuestStatus(g, 'aguardando')}
                      >
                        Desfazer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function PainelControle() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'todos' | LeadStatus>('todos')
  const [tipo, setTipo] = useState<'todos' | ListaTipo>('todos')
  const [dateRange, setDateRange] = useState('todos')
  const [items, setItems] = useState<ListaRow[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ today: 0, entered: 0, waiting: 0, total: 0 })

  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400)
    return () => clearTimeout(timer)
  }, [query])

  const loadStats = useCallback(async () => {
    const s = await fetchListaStats()
    setStats(s)
  }, [])

  const loadListas = useCallback(async () => {
    setIsLoading(true)
    const result = await fetchListasSupabase({
      search: debouncedQuery,
      status,
      tipo,
      dateRange,
      page,
      pageSize: PAGE_SIZE,
    })
    if (result.error) {
      toast.error('Erro ao carregar listas.')
    } else {
      setItems(result.data)
      setTotalCount(result.count)
    }
    setIsLoading(false)
  }, [debouncedQuery, status, tipo, dateRange, page])

  useEffect(() => {
    document.title = 'Painel de Controle - Lista VIP'
    loadStats()
  }, [loadStats])

  useEffect(() => { loadListas() }, [loadListas])

  useEffect(() => { setPage(0) }, [debouncedQuery, status, tipo, dateRange])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  async function setStatusFor(id: string, next: LeadStatus) {
    const now = new Date().toISOString()
    const nextEntrada = next === 'entrou' ? now : null

    const prevItems = items
    setItems(items.map((i) =>
      i.id === id ? { ...i, status: next, data_entrada: nextEntrada } : i
    ))

    try {
      const { error } = await updateListaStatus({ id, status: next, data_entrada: nextEntrada })
      if (error) {
        setItems(prevItems)
        toast.error('Falha ao atualizar. Tente novamente.')
        return
      }
      toast.success('Status atualizado!')
      loadStats()
    } catch {
      setItems(prevItems)
      toast.error('Erro inesperado ao atualizar.')
    }
  }

  return (
    <div className="min-h-screen w-screen bg-black text-foreground">
      <main className="container py-6">
        <header className="w-full py-6">
          <h1 className="text-2xl font-bold text-center">PAINEL DE CONTROLE - LISTA VIP</h1>
        </header>

        <section className="bg-card rounded-xl p-4 md:p-6 shadow">
          {/* Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="md:max-w-sm"
            />
            <div className="flex gap-2 flex-wrap">
              <Input
                type="date"
                value={dateRange === 'todos' ? '' : dateRange}
                onChange={(e) => setDateRange(e.target.value || 'todos')}
                className="w-[150px] cursor-pointer"
                title="Filtrar por data específica da lista"
              />

              <Select value={status} onValueChange={(v) => setStatus(v as 'todos' | LeadStatus)}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tipo} onValueChange={(v) => setTipo(v as 'todos' | ListaTipo)}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  {TIPO_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <Card><CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Hoje</div>
              <div className="text-2xl font-bold">{stats.today}</div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Já entraram</div>
              <div className="text-2xl font-bold">{stats.entered}</div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Aguardando</div>
              <div className="text-2xl font-bold">{stats.waiting}</div>
            </CardContent></Card>
          </div>

          {/* List */}
          <div className="mt-6 grid gap-3">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-10">Carregando...</div>
            ) : items.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">Nenhuma lista encontrada.</div>
            ) : (
              items.map((p) => (
                <Card key={p.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          {p.tipo === 'aniversario'
                            ? <Cake size={16} className="text-pink-400" />
                            : <PartyPopper size={16} className="text-green-400" />}
                          <span className="font-semibold text-brand-neutral700">{p.nome_responsavel}</span>
                          <Badge variant="outline" className="text-xs">
                            {p.tipo === 'aniversario' ? 'Aniversário' : 'Convencional'}
                          </Badge>
                        </div>
                        <div className="text-sm text-brand-neutral500 mt-1">{formatPhoneBR(p.telefone)}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {p.total_convidados} convidado{p.total_convidados !== 1 ? 's' : ''} 
                          {p.data_evento && ` • Para: ${p.data_evento.split('-').reverse().join('/')}`}
                        </div>
                        <div className="text-xs text-brand-neutral400 mt-0.5">
                          Cadastrado: {formatDateTime(p.data_cadastro)}
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
                            ✓ Confirmar
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={() => setStatusFor(p.id, 'aguardando')}>
                            ↺ Desfazer
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Expandable guests */}
                    <ExpandableConvidados listaId={p.id} onStatusChange={loadStats} />
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                ← Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page + 1} de {totalPages} ({totalCount} listas)
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                Próxima →
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
