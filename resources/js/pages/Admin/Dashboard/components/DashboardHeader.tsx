import React from 'react';

export default function DashboardHeader() {
    return (
        <div className="rounded-2xl bg-gradient-to-r from-[#b80035] via-[#a0002e] to-[#7f0020] text-white p-3.5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-sm">
                        🍓
                    </div>
                    <div>
                        <h1 className="text-sm font-extrabold leading-tight">Halo, Admin Zahwa</h1>
                        <span className="text-[10px] text-rose-100/90 block leading-tight">
                            Pantau penjualan & stok buah
                        </span>
                    </div>
                </div>

                <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-semibold text-rose-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live
                </div>
            </div>
        </div>
    );
}
