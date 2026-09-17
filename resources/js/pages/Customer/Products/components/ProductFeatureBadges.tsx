import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductFeatureBadges() {
    return (
        <div className="grid grid-cols-2 gap-2.5">
            <Card className="border-slate-200 shadow-2xs">
                <CardContent className="p-3 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#006c49] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-[#1b1b1e]">Instant Delivery</span>
                        <span className="text-[10px] text-zinc-500">Tiba 1-2 Jam</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-2xs">
                <CardContent className="p-3 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">sentiment_very_satisfied</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-[#1b1b1e]">Garansi Segar</span>
                        <span className="text-[10px] text-zinc-500">100% Ganti Baru</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
