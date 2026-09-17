import React from 'react';
import { StockMutationItem } from '../types';

interface Props {
    mutations: StockMutationItem[];
}

export default function StockMutationHistory({ mutations }: Props) {
    if (mutations.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-2xl border border-zinc-200 p-4">
                <span className="material-symbols-outlined text-slate-300 text-4xl mb-1">
                    history
                </span>
                <h3 className="font-bold text-slate-700 text-xs">Belum ada mutasi stok</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                    Semua transaksi penambahan, penjualan, dan penyesuaian akan tercatat di sini.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {mutations.map((m) => (
                <div
                    key={m.id}
                    className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-3 flex flex-col gap-1.5"
                >
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                                        m.type === 'IN'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : m.type === 'OUT' || m.type === 'SALE'
                                            ? 'bg-rose-100 text-rose-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}
                                >
                                    {m.type === 'IN'
                                        ? 'Masuk'
                                        : m.type === 'SALE'
                                        ? 'Penjualan'
                                        : m.type === 'OUT'
                                        ? 'Keluar'
                                        : 'Penyesuaian'}
                                </span>
                                <span className="text-xs font-bold text-slate-900 truncate">
                                    {m.product_name}
                                </span>
                            </div>
                            <span className="font-mono text-[9px] text-slate-400 block mt-0.5">
                                {m.sku} • Ref: {m.reference_number || '-'}
                            </span>
                        </div>

                        <div className="text-right shrink-0">
                            <span
                                className={`text-xs font-black block ${
                                    m.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'
                                }`}
                            >
                                {m.quantity > 0 ? `+${m.quantity}` : m.quantity} {m.unit_symbol}
                            </span>
                            <span className="text-[9px] text-slate-400">
                                {m.stock_before} &rarr; {m.stock_after}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
                        <span className="truncate max-w-[200px]">
                            {m.notes || 'Tanpa keterangan'}
                        </span>
                        <span className="text-slate-400 shrink-0">{m.created_at}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
