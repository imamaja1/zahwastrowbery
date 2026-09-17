import React from 'react';
import { Summary } from '../types';

interface Props {
    summary: Summary;
}

export default function StockSummaryMetrics({ summary }: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    return (
        <div className="grid grid-cols-2 gap-2">
            {/* Safe Stock */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-2.5 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                        Stok Aman
                    </span>
                    <span className="text-sm font-extrabold text-emerald-700 leading-tight block">
                        {summary.safe_count}{' '}
                        <span className="text-[10px] font-semibold text-slate-400">Varian</span>
                    </span>
                </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-2.5 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                </div>
                <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                        Stok Menipis
                    </span>
                    <span className="text-sm font-extrabold text-amber-600 leading-tight block">
                        {summary.low_count}{' '}
                        <span className="text-[10px] font-semibold text-slate-400">Varian</span>
                    </span>
                </div>
            </div>

            {/* Out of Stock */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-2.5 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                </div>
                <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                        Stok Habis
                    </span>
                    <span className="text-sm font-extrabold text-rose-600 leading-tight block">
                        {summary.out_count}{' '}
                        <span className="text-[10px] font-semibold text-slate-400">Varian</span>
                    </span>
                </div>
            </div>

            {/* Total Asset Valuation */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-2.5 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                </div>
                <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                        Valuasi Aset
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-800 leading-tight block truncate">
                        {formatRupiah(summary.total_valuation)}
                    </span>
                </div>
            </div>
        </div>
    );
}
