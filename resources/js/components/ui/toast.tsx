import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
    title?: string;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, title?: string) => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Standalone global trigger helper
let globalToastHandler: ((message: string, type?: ToastType, title?: string) => void) | null = null;

export const toast = {
    show: (message: string, type: ToastType = 'success', title?: string) => {
        if (globalToastHandler) {
            globalToastHandler(message, type, title);
        }
    },
    success: (message: string, title?: string) => {
        if (globalToastHandler) {
            globalToastHandler(message, 'success', title);
        }
    },
    error: (message: string, title?: string) => {
        if (globalToastHandler) {
            globalToastHandler(message, 'error', title);
        }
    },
    info: (message: string, title?: string) => {
        if (globalToastHandler) {
            globalToastHandler(message, 'info', title);
        }
    },
    warning: (message: string, title?: string) => {
        if (globalToastHandler) {
            globalToastHandler(message, 'warning', title);
        }
    },
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const recentToastsRef = React.useRef<Map<string, number>>(new Map());

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'success', title?: string) => {
        if (!message || typeof message !== 'string') return;

        const cleanMsg = message.trim();
        const now = Date.now();
        const key = `${type}:${cleanMsg.toLowerCase()}`;
        const lastTime = recentToastsRef.current.get(key);

        // Prevent identical toast within 2.5 seconds
        if (lastTime && now - lastTime < 2500) {
            return;
        }
        recentToastsRef.current.set(key, now);

        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastItem = { id, message: cleanMsg, type, title };

        setToasts((prev) => {
            // Keep at most 2 active toasts to prevent screen clutter
            const filtered = prev.filter((t) => t.message.toLowerCase() !== cleanMsg.toLowerCase());
            const updated = [...filtered, newToast];
            return updated.slice(-2);
        });

        // Auto dismiss after 4 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);

    useEffect(() => {
        globalToastHandler = showToast;
        return () => {
            globalToastHandler = null;
        };
    }, [showToast]);

    const contextValue: ToastContextType = useMemo(
        () => ({
            showToast,
            success: (msg, title) => showToast(msg, 'success', title),
            error: (msg, title) => showToast(msg, 'error', title),
            info: (msg, title) => showToast(msg, 'info', title),
            warning: (msg, title) => showToast(msg, 'warning', title),
        }),
        [showToast]
    );

    return (
        <ToastContext.Provider value={contextValue}>
            {children}

            {/* Floating Toast Notification Container */}
            <div className="fixed top-3 inset-x-0 mx-auto max-w-md px-3 z-[9999] pointer-events-none flex flex-col gap-2 items-center">
                {toasts.map((t) => {
                    const isSuccess = t.type === 'success';
                    const isError = t.type === 'error';
                    const isWarning = t.type === 'warning';

                    return (
                        <div
                            key={t.id}
                            className={`pointer-events-auto w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-top-4 duration-200 transition-all ${
                                isSuccess
                                    ? 'bg-emerald-950 text-white border-emerald-500/50 shadow-emerald-950/40 ring-1 ring-emerald-500/20'
                                    : isError
                                    ? 'bg-rose-950 text-white border-rose-500/60 shadow-rose-950/50 ring-1 ring-rose-500/30'
                                    : isWarning
                                    ? 'bg-amber-950 text-white border-amber-500/50 shadow-amber-950/40'
                                    : 'bg-slate-950 text-white border-slate-700/60 shadow-slate-950/40'
                            }`}
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div
                                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                                        isSuccess
                                            ? 'bg-emerald-500 text-emerald-950'
                                            : isError
                                            ? 'bg-rose-600 text-white animate-pulse'
                                            : isWarning
                                            ? 'bg-amber-400 text-amber-950'
                                            : 'bg-blue-400 text-slate-950'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[18px] font-bold">
                                        {isSuccess
                                            ? 'check_circle'
                                            : isError
                                            ? 'error'
                                            : isWarning
                                            ? 'warning'
                                            : 'info'}
                                    </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                    {t.title && (
                                        <p className={`text-[11px] font-extrabold leading-tight mb-0.5 ${
                                            isError ? 'text-rose-200' : isSuccess ? 'text-emerald-200' : 'text-zinc-200'
                                        }`}>
                                            {t.title}
                                        </p>
                                    )}
                                    <p className="text-xs font-semibold leading-snug break-words">
                                        {t.message}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => removeToast(t.id)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 shrink-0 cursor-pointer transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        return {
            showToast: toast.show,
            success: toast.success,
            error: toast.error,
            info: toast.info,
            warning: toast.warning,
        };
    }
    return context;
}
