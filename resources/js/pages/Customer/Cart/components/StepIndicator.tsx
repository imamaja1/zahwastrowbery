import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function StepIndicator() {
    return (
        <Card className="border-rose-100 shadow-xs mb-5">
            <CardContent className="p-4">
                <div className="flex items-center justify-between max-w-sm mx-auto">
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                            <span className="material-symbols-outlined text-[14px]">check</span>
                        </div>
                        <span className="text-xs font-bold text-zinc-700">Pilih Buah</span>
                    </div>
                    <div className="h-[2px] w-8 bg-emerald-600"></div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                            <span className="material-symbols-outlined text-[14px]">check</span>
                        </div>
                        <span className="text-xs font-bold text-zinc-700">Keranjang</span>
                    </div>
                    <div className="h-[2px] w-8 bg-rose-600"></div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                            3
                        </div>
                        <span className="text-xs font-bold text-rose-600">Bayar</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
