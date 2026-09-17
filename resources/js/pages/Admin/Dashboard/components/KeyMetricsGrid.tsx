import React from 'react';
import { DashboardMetrics } from '../types';

interface Props {
    metrics: DashboardMetrics;
}

export default function KeyMetricsGrid({ metrics }: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    return (
        <div className="grid grid-cols-2 gap-2.5">
            {/* Metric 1: Omzet */}
            <div className="bg-white border border-rose-100/80 rounded-2xl p-3 shadow-2xs flex flex-col justify-between gap-1">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500">Omzet Lunas</span>
                    <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[15px]">payments</span>
                    </div>
                </div>
                <span className="font-black text-sm sm:text-base text-zinc-900 tracking-tight block">
                    {formatRupiah(metrics.total_revenue)}
                </span>
            </div>

            {/* Metric 2: Pesanan */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-3 shadow-2xs flex flex-col justify-between gap-1">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500">Pesanan</span>
                    <div className="w-6 h-6 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                    </div>
                </div>
                <span className="font-extrabold text-sm sm:text-base text-zinc-900 block">
                    {metrics.total_transactions}{' '}
                    <span className="text-[10px] font-normal text-zinc-400">Order</span>
                </span>
            </div>

            {/* Metric 3: Produk Terjual */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-3 shadow-2xs flex flex-col justify-between gap-1">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500">Buah Terjual</span>
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[15px]">shopping_basket</span>
                    </div>
                </div>
                <span className="font-extrabold text-sm sm:text-base text-zinc-900 block">
                    {metrics.total_products_sold}{' '}
                    <span className="text-[10px] font-normal text-zinc-400">Unit</span>
                </span>
            </div>

            {/* Metric 4: Verifikasi */}
            <a
                href="#section-verifikasi"
                className={`rounded-2xl p-3 border shadow-2xs flex flex-col justify-between gap-1 transition-all ${
                    metrics.pending_verifications_count > 0
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                        : 'bg-white border-zinc-200/80 text-zinc-900'
                }`}
            >
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold">Verifikasi</span>
                    <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            metrics.pending_verifications_count > 0
                                ? 'bg-amber-500 text-white animate-bounce'
                                : 'bg-zinc-100 text-zinc-500'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[15px]">pending_actions</span>
                    </div>
                </div>
                <span className="font-extrabold text-sm sm:text-base block">
                    {metrics.pending_verifications_count}{' '}
                    <span className="text-[10px] font-normal opacity-80">Antrean</span>
                </span>
            </a>
        </div>
    );
}
