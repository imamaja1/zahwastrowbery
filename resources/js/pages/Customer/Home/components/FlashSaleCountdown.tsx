import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '../types';

function FlashSaleTimer() {
    const [timeLeft, setTimeLeft] = useState(3 * 3600 + 45 * 60 + 12);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const h = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
    const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
    const s = String(timeLeft % 60).padStart(2, '0');

    return (
        <span className="font-mono bg-[#f0edf1] px-1.5 py-0.5 rounded text-rose-600 font-bold">
            {h}:{m}:{s}
        </span>
    );
}

interface FlashSaleCountdownProps {
    products: Product[];
}

export default function FlashSaleCountdown({ products }: FlashSaleCountdownProps) {
    const formatCurrency = (val: number) => {
        return 'Rp' + Number(val).toLocaleString('id-ID');
    };

    if (products.length === 0) return null;

    const featuredProduct = products[0];

    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="font-extrabold uppercase tracking-wide gap-1 text-[11px]">
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                        Flash Sale
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <FlashSaleTimer />
                    </div>
                </div>
                <Badge variant="warning" className="font-bold text-[11px]">
                    Diskon s/d 35%
                </Badge>
            </div>

            <Card className="hover:shadow-md transition-all group border-rose-100 overflow-hidden bg-white">
                <CardContent className="p-3 flex items-center gap-3">
                    <Link
                        href={`/products/${featuredProduct.slug}`}
                        className="relative w-28 h-28 rounded-2xl overflow-hidden bg-zinc-100 shrink-0 block"
                    >
                        <img
                            src={featuredProduct.image || 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600'}
                            alt={featuredProduct.name}
                            loading="eager"
                            decoding="async"
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                                featuredProduct.total_stock <= 0 ? 'grayscale opacity-75' : ''
                            }`}
                        />
                        {featuredProduct.total_stock <= 0 ? (
                            <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white px-1.5 py-0.5 rounded-lg text-[9px] font-extrabold shadow-2xs z-20">
                                Habis
                            </span>
                        ) : (
                            <span className="absolute top-1.5 left-1.5 bg-[#b80035] text-white px-1.5 py-0.5 rounded-lg text-[9px] font-extrabold shadow-2xs z-20">
                                -35%
                            </span>
                        )}
                        {featuredProduct.total_stock <= 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                <span className="bg-rose-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Stok Habis
                                </span>
                            </div>
                        )}
                    </Link>

                    <div className="flex flex-col justify-between flex-1 min-w-0 h-28 py-0.5">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="inline-block text-[10px] text-[#006c49] font-bold uppercase tracking-wider">
                                    Pilihan Terbaik Hari Ini
                                </span>
                                {featuredProduct.total_stock <= 0 && (
                                    <Badge variant="destructive" className="text-[9px] font-bold px-1.5 py-0">
                                        Stok Habis
                                    </Badge>
                                )}
                            </div>
                            <Link href={`/products/${featuredProduct.slug}`}>
                                <h4 className="font-bold text-sm text-[#1b1b1e] group-hover:text-rose-600 transition-colors truncate">
                                    {featuredProduct.name}
                                </h4>
                            </Link>
                            <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                                {featuredProduct.description || 'Buah segar kualitas premium dipetik langsung dari kebun.'}
                            </p>
                        </div>

                        <div className="flex items-end justify-between mt-1 pt-1 border-t border-zinc-100">
                            <div>
                                <span className="text-[10px] text-zinc-400 line-through block leading-none">
                                    {formatCurrency(featuredProduct.min_price * 1.35)}
                                </span>
                                <div className="flex items-baseline gap-0.5 mt-0.5">
                                    <span className="text-base font-extrabold text-[#b80035] leading-none">
                                        {formatCurrency(featuredProduct.min_price)}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 font-medium">
                                        /{featuredProduct.default_unit}
                                    </span>
                                </div>
                            </div>

                            <Button
                                asChild
                                size="sm"
                                className="h-8 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs gap-1 shadow-xs"
                            >
                                <Link href={`/products/${featuredProduct.slug}`}>
                                    <span>{featuredProduct.total_stock <= 0 ? 'Lihat' : 'Pilih'}</span>
                                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
