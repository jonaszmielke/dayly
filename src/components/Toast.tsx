'use client'

import { cn } from '@/lib/utils'
import { createContext, useCallback, useContext, useState } from 'react'

type ToastVariant = 'error'

type Toast = {
    id: number
    variant: ToastVariant
    message: string
}

type ToastContextValue = {
    show: (toast: { variant: ToastVariant; message: string }) => void
    error: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const AUTO_DISMISS_MS = 5000

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const show = useCallback(
        ({ variant, message }: { variant: ToastVariant; message: string }) => {
            const id = Date.now() + Math.random()
            setToasts((prev) => [...prev, { id, variant, message }])
            setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
        },
        [dismiss]
    )

    const error = useCallback((message: string) => show({ variant: 'error', message }), [show])

    return (
        <ToastContext.Provider value={{ show, error }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex w-[320px] max-w-[calc(100vw-2rem)] flex-col gap-2">
                {toasts.map((toast) => (
                    <ToastCard key={toast.id} toast={toast} onClose={() => dismiss(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

const ToastCard = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => (
    <div
        role="alert"
        className={cn(
            'animate-toast-in flex items-stretch gap-3 bg-paper-2 border-brutal shadow-brutal-danger',
            'font-mono'
        )}
    >
        <div className="w-[6px] shrink-0 bg-danger" />
        <div className="flex-1 py-2.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-danger">Error</div>
            <div className="mt-1 text-[12px] leading-snug text-ink">{toast.message}</div>
        </div>
        <button
            onClick={onClose}
            aria-label="Dismiss"
            className="shrink-0 px-3 text-[14px] text-ink/50 hover:text-ink transition-colors"
        >
            ✕
        </button>
    </div>
)

export const useToast = (): ToastContextValue => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within a ToastProvider')
    return ctx
}
