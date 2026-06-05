import { useCallback, useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CalendarOff, X, Loader2 } from 'lucide-react'
import {
  fetchDatasBloqueadas,
  addDataBloqueada,
  removeDataBloqueada,
} from '@/integrations/supabase/leads'

function toISODate(d: Date) {
  const y = d.getFullYear()
  const m = (d.getMonth() + 1).toString().padStart(2, '0')
  const dd = d.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function parseISO(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatPretty(iso: string) {
  const d = parseISO(iso)
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  return `${dias[d.getDay()]}, ${iso.split('-').reverse().join('/')}`
}

export function DatasBloqueadasPanel() {
  const [blocked, setBlocked] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const list = await fetchDatasBloqueadas()
    setBlocked(list)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const handleToggle = async (date: Date | undefined) => {
    if (!date) return
    const iso = toISODate(date)
    if (pending) return
    setPending(iso)
    const isBlocked = blocked.includes(iso)
    if (isBlocked) {
      const prev = blocked
      setBlocked(blocked.filter(d => d !== iso))
      const { error } = await removeDataBloqueada(iso)
      if (error) {
        setBlocked(prev)
        toast.error('Erro ao desbloquear data.')
      } else {
        toast.success(`Data ${formatPretty(iso)} liberada.`)
      }
    } else {
      const prev = blocked
      setBlocked([...blocked, iso].sort())
      const { error } = await addDataBloqueada(iso)
      if (error) {
        setBlocked(prev)
        toast.error('Erro ao bloquear data.')
      } else {
        toast.success(`Data ${formatPretty(iso)} bloqueada.`)
      }
    }
    setPending(null)
  }

  const blockedDates = blocked.map(parseISO)
  const upcoming = blocked
    .filter(d => parseISO(d) >= today)
    .sort()

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-6">
      {/* Calendar */}
      <div className="bg-black/40 border border-brand-gold/20 rounded-2xl p-5 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 self-start">
          <CalendarOff size={18} className="text-brand-gold" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Clique em um dia para bloquear / desbloquear
          </h3>
        </div>
        <Calendar
          mode="single"
          onSelect={handleToggle}
          disabled={(d) => {
            const cmp = new Date(d)
            cmp.setHours(0, 0, 0, 0)
            return cmp < today
          }}
          modifiers={{ blocked: blockedDates }}
          modifiersClassNames={{
            blocked:
              'bg-red-500/20 text-red-300 line-through hover:bg-red-500/30 font-bold',
          }}
          className="pointer-events-auto rounded-xl border border-white/5"
        />
        <p className="text-xs text-zinc-500 mt-4 text-center max-w-sm">
          Dias em <span className="text-red-300 font-bold">vermelho</span> não terão lista.
          Clientes verão um aviso ao escolher uma dessas datas no formulário.
        </p>
      </div>

      {/* Sidebar */}
      <div className="bg-black/40 border border-brand-gold/20 rounded-2xl p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
          Próximas datas bloqueadas
        </h3>

        {loading ? (
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Loader2 size={14} className="animate-spin" /> Carregando...
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-zinc-500 text-sm py-8 text-center border border-dashed border-white/10 rounded-xl">
            Nenhuma data bloqueada.
          </div>
        ) : (
          <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {upcoming.map(iso => (
              <li
                key={iso}
                className="flex items-center justify-between bg-zinc-900/60 border border-white/5 rounded-xl px-3 py-2"
              >
                <span className="text-sm font-semibold text-zinc-200">
                  {formatPretty(iso)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={pending === iso}
                  onClick={() => handleToggle(parseISO(iso))}
                  className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                  title="Desbloquear"
                >
                  <X size={14} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
