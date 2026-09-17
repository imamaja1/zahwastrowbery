import React from 'react';
import { Link } from '@inertiajs/react';

export default function QuickShortcuts() {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-zinc-600 px-1">Pintasan Cepat</span>
            <div className="grid grid-cols-3 gap-2">
                <Link
                    href="/admin/products"
                    className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-rose-100 hover:border-rose-300 hover:bg-rose-50/40 shadow-2xs transition-all text-center active:scale-95"
                >
                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#b80035] flex items-center justify-center mb-1">
                        <span className="material-symbols-outlined text-[16px]">add_box</span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-700 leading-tight">Master Buah</span>
                </Link>

                <Link
                    href="/admin/stocks"
                    className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-zinc-200/80 hover:border-rose-200 hover:bg-rose-50/40 shadow-2xs transition-all text-center active:scale-95"
                >
                    <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center mb-1">
                        <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-700 leading-tight">Stok</span>
                </Link>

                <Link
                    href="/admin/sales"
                    className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-zinc-200/80 hover:border-rose-200 hover:bg-rose-50/40 shadow-2xs transition-all text-center active:scale-95"
                >
                    <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center mb-1">
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-700 leading-tight">Pesanan</span>
                </Link>
            </div>
        </div>
    );
}
