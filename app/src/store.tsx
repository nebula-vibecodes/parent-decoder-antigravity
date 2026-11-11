/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type SavedMessage = { id: string; text: string; savedAt: number }

export type SavedAIOutput = {
  id: string
  type: 'tone-analysis' | 'roleplay' | 'playbook'
  title: string
  content: string
  summary?: string
  savedAt: number
  metadata?: Record<string, string>
}

type Toast = { id: number; message: string }

export type AppState = {
  savedTerms: string[]
  savedMessages: SavedMessage[]
  savedAIOutputs: SavedAIOutput[]
  toggleTerm: (slug: string) => void
  saveMessage: (text: string) => void
  removeMessage: (id: string) => void
  clearMessages: () => void
  clearTerms: () => void
  saveAIOutput: (output: Omit<SavedAIOutput, 'id' | 'savedAt'>) => void
  removeAIOutput: (id: string) => void
  clearAIOutputs: (type?: 'tone-analysis' | 'roleplay' | 'playbook') => void
  isAIOutputSaved: (title: string, type: 'tone-analysis' | 'roleplay' | 'playbook') => boolean
  notify: (message: string) => void
  openSearch: () => void
  closeSearch: () => void
  searchOpen: boolean
}

const AppContext = createContext<AppState | null>(null)

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      if (!stored) return initial
      const parsed = JSON.parse(stored)
      if (Array.isArray(initial) && !Array.isArray(parsed)) {
        return initial
      }
      return parsed
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage may be unavailable or quota exceeded */
    }
  }, [key, value])
  return [value, setValue] as const
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [savedTerms, setSavedTerms] = useStored<string[]>('parent-decoder-saved-terms', [])
  const [savedMessages, setSavedMessages] = useStored<SavedMessage[]>('parent-decoder-saved-messages', [])
  const [savedAIOutputs, setSavedAIOutputs] = useStored<SavedAIOutput[]>('parent-decoder-saved-ai-outputs', [])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [searchOpen, setSearchOpen] = useState(false)

  const notify = useCallback((message: string) => {
    const id = Date.now()
    setToasts((items) => [...items, { id, message }])
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 2800)
  }, [])

  const isAIOutputSaved = useCallback(
    (title: string, type: 'tone-analysis' | 'roleplay' | 'playbook') => {
      const normalized = title.trim().toLowerCase()
      return savedAIOutputs.some(
        (item) => item.type === type && item.title.trim().toLowerCase() === normalized
      )
    },
    [savedAIOutputs]
  )

  const saveAIOutput = useCallback(
    (output: Omit<SavedAIOutput, 'id' | 'savedAt'>) => {
      const cleanTitle = output.title.trim().slice(0, 200)
      const cleanContent = output.content.trim().slice(0, 10000)
      if (!cleanTitle || !cleanContent) return

      const cleanSummary = output.summary ? output.summary.trim().slice(0, 500) : undefined
      const id = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const newItem: SavedAIOutput = {
        id,
        type: output.type,
        title: cleanTitle,
        content: cleanContent,
        summary: cleanSummary,
        savedAt: Date.now(),
        metadata: output.metadata,
      }

      setSavedAIOutputs((items) => [
        newItem,
        ...items.filter(
          (item) =>
            !(item.type === output.type && item.title.trim().toLowerCase() === cleanTitle.toLowerCase())
        ),
      ].slice(0, 50))

      notify('Saved in this browser')
    },
    [notify, setSavedAIOutputs]
  )

  const removeAIOutput = useCallback(
    (id: string) => {
      setSavedAIOutputs((items) => items.filter((item) => item.id !== id))
    },
    [setSavedAIOutputs]
  )

  const clearAIOutputs = useCallback(
    (type?: 'tone-analysis' | 'roleplay' | 'playbook') => {
      if (type) {
        setSavedAIOutputs((items) => items.filter((item) => item.type !== type))
      } else {
        setSavedAIOutputs([])
      }
    },
    [setSavedAIOutputs]
  )

  const value = useMemo<AppState>(() => ({
    savedTerms,
    savedMessages,
    savedAIOutputs,
    toggleTerm: (slug) => {
      const removing = savedTerms.includes(slug)
      setSavedTerms((items) => removing ? items.filter((item) => item !== slug) : [...items, slug])
      notify(removing ? 'Removed from your saved terms' : 'Saved in this browser')
    },
    saveMessage: (text) => {
      const clean = text.trim().slice(0, 600)
      if (!clean) return
      setSavedMessages((items) => [{ id: `${Date.now()}`, text: clean, savedAt: Date.now() }, ...items.filter((item) => item.text !== clean)].slice(0, 20))
      notify('Message saved only in this browser')
    },
    removeMessage: (id) => setSavedMessages((items) => items.filter((item) => item.id !== id)),
    clearMessages: () => setSavedMessages([]),
    clearTerms: () => setSavedTerms([]),
    saveAIOutput,
    removeAIOutput,
    clearAIOutputs,
    isAIOutputSaved,
    notify,
    openSearch: () => setSearchOpen(true),
    closeSearch: () => setSearchOpen(false),
    searchOpen,
  }), [
    savedTerms,
    savedMessages,
    savedAIOutputs,
    setSavedTerms,
    setSavedMessages,
    saveAIOutput,
    removeAIOutput,
    clearAIOutputs,
    isAIOutputSaved,
    notify,
    searchOpen,
  ])

  return <AppContext.Provider value={value}>
    {children}
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => <div className="toast" key={toast.id}>{toast.message}</div>)}
    </div>
  </AppContext.Provider>
}

export function useApp() {
  const value = useContext(AppContext)
  if (!value) throw new Error('useApp must be used within AppProvider')
  return value
}

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text)
}
