import { useCallback, useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { LeadStatus, ListaTipo, Convidado } from '@/types/lead'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp, Cake, PartyPopper, CheckCircle, Search, Calendar, RefreshCw, Download, X, CheckCheck } from 'lucide-react'
import {
  fetchListasSupabase,
  fetchListaStats,
  fetchConvidados,
  updateListaStatus,
  updateConvidadoStatus,
  type ListaRow,
} from '@/integrations/supabase/leads'
import { Logo } from '@/components/Logo'
import { GradientText } from '@/components/GradientText'

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

function getTodayISO() {
  const now = new Date()
  const y = now.getFullYear()
  const m = (now.getMonth() + 1).toString().padStart(2, '0')
  const d = now.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${d}`
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

const PAGE_SIZE = 25

function ExpandableConvidados({ listaId, onStatusChange }: { listaId: string, onStatusChange?: () => void }) {
  const [open, setOpen] = useState(false)
  const [guests, setGuests] = useState<Convidado[]>([])
  const [loading, setLoading] = useState(false)

  const pendingCount = guests.filter(g => g.status === 'aguardando').length

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

  const handleConfirmAll = async () => {
    const pending = guests.filter(g => g.status === 'aguardando')
    if (pending.length === 0) return

    const prevGuests = [...guests]
    setGuests(guests.map(g => g.status === 'aguardando' ? { ...g, status: 'entrou' as LeadStatus } : g))

    const now = new Date().toISOString()
    const results = await Promise.all(
      pending.map(g => updateConvidadoStatus({ id: g.id, status: 'entrou', data_entrada: now }))
    )

    const hasError = results.some(r => r.error)
    if (hasError) {
      setGuests(prevGuests)
      toast.error('Erro ao confirmar alguns convidados.')
    } else {
      toast.success(`${pending.length} convidado${pending.length > 1 ? 's' : ''} confirmado${pending.length > 1 ? 's' : ''}!`)
      if (onStatusChange) onStatusChange()
    }
  }

  return (
    <div className="mt-4 border-t border-brand-gold/10 pt-3">
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-sm font-semibold text-brand-gold/80 hover:text-brand-gold transition-colors"
      >
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {open ? 'Ocultar convidados' : `Ver convidados`}
      </button>
      
      {open && (
        <div className="mt-3 space-y-2">
          {loading ? (
            <p className="text-sm text-brand-gold/50 italic pl-6">Carregando lista...</p>
          ) : guests.length === 0 ? (
            <p className="text-sm text-zinc-500 italic pl-6">Nenhum convidado nessa lista.</p>
          ) : (
            <>
              {pendingCount > 0 && (
                <div className="pl-2 mb-3">
                  <Button
                    size="sm"
                    onClick={handleConfirmAll}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-[11px] tracking-wider px-4 h-9 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  >
                    <CheckCheck size={15} className="mr-1.5" />
                    Confirmar todos ({pendingCount})
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-1 gap-2.5 pl-2 mt-2">
                {guests.map((g) => (
                  <div 
                    key={g.id} 
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-3 px-4 rounded-xl border transition-all ${
                      g.status === 'entrou' 
                        ? 'bg-emerald-950/40 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                        : 'bg-black/40 border-white/5 hover:bg-black/60 hover:border-brand-gold/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full shrink-0 shadow-sm ${g.status === 'entrou' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-brand-gold shadow-brand-gold/50'}`} />
                      <span className={`text-sm font-bold uppercase tracking-wide ${g.status === 'entrou' ? 'text-emerald-400' : 'text-zinc-200'}`}>
                        {g.nome}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      {g.status === 'aguardando' ? (
                        <Badge variant="secondary" className="bg-zinc-900 text-zinc-400 font-bold uppercase tracking-wider text-[10px] border border-white/5 px-2 py-0.5">
                          Não conferido
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-none font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 shadow-none">
                          Já entrou
                        </Badge>
                      )}

                      {g.status === 'aguardando' ? (
                        <Button
                          size="sm"
                          className="h-8 shadow-[0_0_10px_rgba(255,215,0,0.2)] bg-brand-gold hover:bg-brand-gold-light text-black font-bold uppercase text-[10px] tracking-wider px-4 ml-auto sm:ml-0 border-0 transition-all"
                          onClick={() => handleUpdateGuestStatus(g, 'entrou')}
                        >
                          <CheckCircle size={14} className="mr-1.5" />
                          Confirmar
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-white/10 hover:bg-zinc-800 hover:text-white hover:border-white/20 text-zinc-400 font-bold uppercase text-[10px] tracking-wider px-4 ml-auto sm:ml-0 bg-transparent transition-all"
                          onClick={() => handleUpdateGuestStatus(g, 'aguardando')}
                        >
                          Desfazer
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
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
  const [autoRefresh, setAutoRefresh] = useState(false)
  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400)
    return () => clearTimeout(timer)
  }, [query])

  const hasActiveFilters = debouncedQuery !== '' || status !== 'todos' || tipo !== 'todos' || dateRange !== 'todos'

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

  const refreshAll = useCallback(() => {
    loadListas()
    loadStats()
  }, [loadListas, loadStats])

  useEffect(() => {
    document.title = 'Painel de Controle - Lista VIP'
    loadStats()
  }, [loadStats])

  useEffect(() => { loadListas() }, [loadListas])

  useEffect(() => { setPage(0) }, [debouncedQuery, status, tipo, dateRange])

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      autoRefreshRef.current = setInterval(() => {
        refreshAll()
      }, 30000)
    } else {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current)
        autoRefreshRef.current = null
      }
    }
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current)
    }
  }, [autoRefresh, refreshAll])

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

  const clearFilters = () => {
    setQuery('')
    setStatus('todos')
    setTipo('todos')
    setDateRange('todos')
  }

  const handleExportCSV = async () => {
    toast.info('Gerando CSV...')
    // Fetch all results matching current filters (no pagination)
    const result = await fetchListasSupabase({
      search: debouncedQuery,
      status,
      tipo,
      dateRange,
      page: 0,
      pageSize: 10000,
    })
    if (result.error || !result.data.length) {
      toast.error('Nenhum dado para exportar.')
      return
    }

    const BOM = '\uFEFF'
    const headers = ['Nome', 'Telefone', 'Tipo', 'Data Evento', 'Status', 'Convidados', 'Fonte', 'Cadastrado']
    const rows = result.data.map(r => [
      r.nome_responsavel,
      formatPhoneBR(r.telefone),
      r.tipo === 'aniversario' ? 'Aniversário' : 'Convencional',
      r.data_evento ? r.data_evento.split('-').reverse().join('/') : '',
      r.status === 'entrou' ? 'Já entrou' : 'Não conferido',
      r.total_convidados.toString(),
      r.fonte_lead || '',
      r.data_cadastro ? formatDateTime(r.data_cadastro) : '',
    ])

    const csv = BOM + [headers, ...rows].map(row => row.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `listas_vip_${getTodayISO()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exportado!')
  }

  return (
    <div className="relative min-h-screen w-screen bg-[#020202] text-zinc-100 font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-gold/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-gold-dark/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 container py-8 md:py-12 px-4 max-w-6xl mx-auto">
        <header className="w-full flex flex-col justify-center items-center gap-6 mb-10">
          <Logo 
            src="https://api.builder.io/api/v1/image/assets/TEMP/12556187b358de88b421d0ac6400ce3914355c56?width=426" 
            alt="Tróia Logo" 
            className="w-40 sm:w-56 drop-shadow-2xl brightness-125"
          />
          <GradientText className="text-2xl sm:text-4xl md:text-5xl mt-2 tracking-tight">PAINEL DE CONTROLE</GradientText>
        </header>

        <section className="bg-zinc-950/70 backdrop-blur-2xl border border-brand-gold/20 rounded-3xl p-5 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {/* Toolbar: Filters + Actions */}
          <div className="flex flex-col gap-5 mb-8">
            {/* Row 1: Search + Action buttons */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold/60" size={18} />
                <Input
                  placeholder="Buscar por nome, telefone ou convidado..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 bg-black/50 border-brand-gold/20 text-white placeholder:text-zinc-500 focus-visible:ring-brand-gold/40 focus-visible:border-brand-gold rounded-xl h-11"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Today button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDateRange(getTodayISO())}
                  className={`h-9 text-xs font-bold uppercase tracking-wider border-brand-gold/20 transition-all ${
                    dateRange === getTodayISO()
                      ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/50'
                      : 'text-zinc-400 hover:text-brand-gold hover:border-brand-gold/40 bg-transparent'
                  }`}
                >
                  <Calendar size={14} className="mr-1.5" />
                  Hoje
                </Button>

                {/* Manual refresh */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={refreshAll}
                  className="h-9 text-xs font-bold uppercase tracking-wider border-brand-gold/20 text-zinc-400 hover:text-brand-gold hover:border-brand-gold/40 bg-transparent transition-all"
                >
                  <RefreshCw size={14} className="mr-1.5" />
                  Atualizar
                </Button>

                {/* Auto-refresh toggle */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`h-9 text-xs font-bold uppercase tracking-wider border-brand-gold/20 transition-all ${
                    autoRefresh
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'text-zinc-400 hover:text-brand-gold hover:border-brand-gold/40 bg-transparent'
                  }`}
                >
                  {autoRefresh && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />}
                  {autoRefresh ? 'Live' : 'Auto'}
                </Button>

                {/* Export CSV */}
                <Button
                  size="sm"
                  onClick={handleExportCSV}
                  className="h-9 text-xs font-bold uppercase tracking-wider bg-brand-gold hover:bg-brand-gold-light text-black transition-all shadow-[0_0_10px_rgba(218,165,32,0.2)]"
                >
                  <Download size={14} className="mr-1.5" />
                  Exportar CSV
                </Button>
              </div>
            </div>

            {/* Row 2: Filters */}
            <div className="flex gap-3 flex-wrap items-center">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold/60 pointer-events-none" size={18} />
                <Input
                  type="date"
                  value={dateRange === 'todos' ? '' : dateRange}
                  onChange={(e) => setDateRange(e.target.value || 'todos')}
                  className="w-[160px] pl-10 cursor-pointer bg-black/50 border-brand-gold/20 text-white focus-visible:ring-brand-gold/40 focus-visible:border-brand-gold rounded-xl h-11 [&::-webkit-calendar-picker-indicator]:opacity-0"
                  title="Filtrar por data específica da lista"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <Select value={status} onValueChange={(v) => setStatus(v as 'todos' | LeadStatus)}>
                <SelectTrigger className="w-[160px] bg-black/50 border-brand-gold/20 text-white focus:ring-brand-gold/40 focus:border-brand-gold rounded-xl h-11">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-brand-gold/20 text-white rounded-xl">
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="focus:bg-brand-gold/20 focus:text-white cursor-pointer">{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tipo} onValueChange={(v) => setTipo(v as 'todos' | ListaTipo)}>
                <SelectTrigger className="w-[160px] bg-black/50 border-brand-gold/20 text-white focus:ring-brand-gold/40 focus:border-brand-gold rounded-xl h-11">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-brand-gold/20 text-white rounded-xl">
                  {TIPO_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="focus:bg-brand-gold/20 focus:text-white cursor-pointer">{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-11 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <X size={14} className="mr-1" />
                  Limpar filtros
                </Button>
              )}

              {/* Results counter */}
              <div className="ml-auto">
                <Badge variant="outline" className="border-white/10 text-zinc-400 font-bold text-xs px-3 py-1.5">
                  {totalCount} resultado{totalCount !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-8">
            <Card className="bg-gradient-to-br from-zinc-900/90 to-black border-brand-gold/20 rounded-2xl overflow-hidden shadow-lg"><CardContent className="p-5 flex flex-col justify-center items-center">
              <div className="text-xs font-bold text-brand-gold/70 tracking-widest uppercase mb-1">Total</div>
              <div className="text-3xl font-black text-white">{stats.total}</div>
            </CardContent></Card>
            <Card className="bg-gradient-to-br from-zinc-900/90 to-black border-brand-gold/20 rounded-2xl overflow-hidden shadow-lg"><CardContent className="p-5 flex flex-col justify-center items-center">
              <div className="text-xs font-bold text-brand-gold/70 tracking-widest uppercase mb-1">Hoje</div>
              <div className="text-3xl font-black text-white">{stats.today}</div>
            </CardContent></Card>
            <Card className="bg-gradient-to-br from-zinc-900/90 to-black border-brand-gold/20 rounded-2xl overflow-hidden shadow-lg"><CardContent className="p-5 flex flex-col justify-center items-center">
              <div className="text-xs font-bold text-emerald-500/80 tracking-widest uppercase mb-1">Já Entraram</div>
              <div className="text-3xl font-black text-emerald-400">{stats.entered}</div>
            </CardContent></Card>
            <Card className="bg-gradient-to-br from-zinc-900/90 to-black border-brand-gold/20 rounded-2xl overflow-hidden shadow-lg"><CardContent className="p-5 flex flex-col justify-center items-center">
              <div className="text-xs font-bold text-blue-400/80 tracking-widest uppercase mb-1">Aguardando</div>
              <div className="text-3xl font-black text-blue-300">{stats.waiting}</div>
            </CardContent></Card>
          </div>

          {/* List */}
          <div className="mt-6 grid gap-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-brand-gold/60">
                <div className="w-8 h-8 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin mb-4" />
                <p className="font-medium tracking-wider text-sm">CARREGANDO DADOS...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center text-zinc-400 py-16 font-medium bg-black/30 rounded-2xl border border-white/5">Nenhuma lista encontrada com os filtros atuais.</div>
            ) : (
              items.map((p) => (
                <Card key={p.id} className="bg-gradient-to-r from-zinc-900/80 to-zinc-900/40 border-brand-gold/10 hover:border-brand-gold/30 transition-all duration-300 rounded-2xl shadow-md overflow-hidden">
                  <CardContent className="p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          {p.tipo === 'aniversario'
                            ? <Cake size={18} className="text-brand-gold filter drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]" />
                            : <PartyPopper size={18} className="text-emerald-400 filter drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />}
                          <span className="font-bold text-lg text-white tracking-wide">{p.nome_responsavel}</span>
                          <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${p.tipo === 'aniversario' ? 'border-brand-gold/50 text-brand-gold' : 'border-emerald-500/50 text-emerald-400'} bg-transparent rounded-full`}>
                            {p.tipo === 'aniversario' ? 'Aniversário' : 'Convencional'}
                          </Badge>
                          {p.fonte_lead && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-none font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 shadow-none">
                              {p.fonte_lead}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                          <span className="text-brand-gold/70">✆</span> {formatPhoneBR(p.telefone)}
                        </div>
                        <div className="text-sm text-zinc-500 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="bg-black/40 px-2.5 py-1 rounded-md text-xs font-semibold text-zinc-300 border border-white/5">
                            {p.total_convidados} convidado{p.total_convidados !== 1 ? 's' : ''}
                          </span>
                          {p.data_evento && (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-brand-gold/70">
                              <Calendar size={13} />
                              Para: {p.data_evento.split('-').reverse().join('/')}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-3 font-medium uppercase tracking-wider">
                          Cadastrado: {formatDateTime(p.data_cadastro)}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {p.status === 'entrou' ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-none px-3 py-1.5 font-bold uppercase tracking-wider text-[11px]">
                            Já entrou
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-white/5 px-3 py-1.5 font-bold uppercase tracking-wider text-[11px]">
                            Não conferido
                          </Badge>
                        )}
                        {p.status === 'aguardando' ? (
                          <Button
                            onClick={() => setStatusFor(p.id, 'entrou')}
                            className="bg-brand-gold hover:bg-brand-gold-light text-black font-black uppercase tracking-wider text-xs px-5 h-10 shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all"
                          >
                            <CheckCircle size={15} className="mr-2" />
                            Confirmar
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={() => setStatusFor(p.id, 'aguardando')} className="border-zinc-700 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800 uppercase tracking-wider font-bold text-xs h-10 transition-all">
                            ↺ Desfazer
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Expandable guests */}
                    <div className="mt-4 opacity-90">
                      <ExpandableConvidados listaId={p.id} onStatusChange={loadStats} />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 p-4 bg-black/40 border border-white/5 rounded-2xl w-full flex-wrap gap-4">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} className="border-brand-gold/20 text-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold-light font-semibold uppercase text-xs tracking-wider transition-all">
                ← Anterior
              </Button>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest bg-zinc-900 px-4 py-2 rounded-full border border-white/5">
                <span className="text-white">Pág {page + 1}</span> de {totalPages} <span className="text-brand-gold/50 mx-2">•</span> {totalCount} listas
              </div>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="border-brand-gold/20 text-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold-light font-semibold uppercase text-xs tracking-wider transition-all">
                Próxima →
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
