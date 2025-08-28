export const STORAGE_KEY = 'lista_vip'

export function getLeads<T = any>(): T[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

export function saveLeads<T = any>(items: T[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function addLead<T = any>(item: T) {
  const all = getLeads<T>()
  all.unshift(item)
  saveLeads(all)
}

export function updateLead<T = any>(id: string, updater: (item: T) => T) {
  const all = getLeads<T>()
  const updated = all.map((it: any) => (it.id === id ? updater(it) : it))
  saveLeads(updated)
}
