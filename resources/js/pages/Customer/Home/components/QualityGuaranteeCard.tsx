import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function QualityGuaranteeCard() {
    return (
        <Card className="border-rose-100/80 shadow-xs bg-gradient-to-br from-white via-rose-50/20 to-emerald-50/20 overflow-hidden">
            <CardContent className="p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-rose-100/60">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <div>
                        <h4 className="text-xs font-extrabold text-[#1b1b1e]">Jaminan & Komitmen Kualitas</h4>
                        <p className="text-[10px] text-zinc-500">Standar buah segar langsung dari kebun Ciwidey</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-white rounded-2xl border border-emerald-100/80 shadow-2xs flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[15px]">eco</span>
                            </div>
                            <span className="text-[11px] font-bold text-zinc-900 leading-tight">100% Segar & Manis</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-snug pl-0.5">
                            Buah rusak/busuk saat sampai langsung diganti baru tanpa ribet.
                        </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-2xl border border-rose-100/80 shadow-2xs flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[15px]">ac_unit</span>
                            </div>
                            <span className="text-[11px] font-bold text-zinc-900 leading-tight">Rantai Dingin 0-4°C</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-snug pl-0.5">
                            Kemasan higienis & kurir kilat menjaga kerenyahan maksimal.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
