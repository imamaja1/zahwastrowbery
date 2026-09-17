import React from 'react';
import { Button } from '@/components/ui/button';

export default function HomeHeroBanner() {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#b80035] via-[#e11d48] to-[#bf5300] text-white p-6 shadow-md">
            <div className="relative z-10 flex flex-col justify-between max-w-sm space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit">
                    <span className="material-symbols-outlined text-[#6ffbbe] text-[16px]">eco</span>
                    <span className="text-[11px] font-bold text-white tracking-wide uppercase">Petik Tiap Pagi</span>
                </div>
                <h2 className="font-extrabold text-2xl sm:text-3xl leading-tight tracking-tight text-white">
                    Buah Segar Pilihan Untuk Hari Sehat Anda
                </h2>
                <p className="text-xs sm:text-sm text-white/90 line-clamp-2">
                    Pilih variasi kemasan Mika, Box, atau timbang Kg dengan jaminan manis dan rantai dingin 0-4°C!
                </p>
                <div className="pt-2">
                    <Button asChild className="bg-white text-rose-700 hover:bg-zinc-100 font-bold text-xs h-10 px-5 rounded-xl shadow-xs gap-1.5">
                        <a href="#catalog">
                            <span>Belanja Sekarang</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </a>
                    </Button>
                </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-48 h-48 md:w-64 md:h-64 opacity-90 pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80"
                    alt="Fresh Strawberries"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover rounded-full filter drop-shadow-2xl"
                />
            </div>
        </section>
    );
}
