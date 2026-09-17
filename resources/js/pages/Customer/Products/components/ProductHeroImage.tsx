import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductDetail, Variant } from '../types';

interface ProductHeroImageProps {
    product: ProductDetail;
    activeVariant: Variant | undefined;
    isWishlisted: boolean;
    onToggleWishlist: () => void;
}

export default function ProductHeroImage({
    product,
    activeVariant,
    isWishlisted,
    onToggleWishlist,
}: ProductHeroImageProps) {
    const isOutOfStock = !activeVariant || activeVariant.stock <= 0;

    return (
        <>
            {/* Category & Breadcrumbs */}
            <div className="flex items-center justify-between mb-3">
                <Button asChild variant="outline" size="sm" className="bg-emerald-50 text-[#006c49] border-emerald-200 hover:bg-emerald-100 rounded-full h-8 text-xs font-bold gap-1">
                    <Link href="/">
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        <span>{product.category?.name || 'Katalog Buah'}</span>
                    </Link>
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onToggleWishlist}
                    className={`w-9 h-9 p-0 rounded-full border-zinc-200 ${
                        isWishlisted ? 'text-rose-600 border-rose-200 bg-rose-50' : 'text-zinc-400'
                    }`}
                    title="Simpan Favorit"
                >
                    <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                    >
                        favorite
                    </span>
                </Button>
            </div>

            {/* Main Hero Image */}
            <div className="relative w-full aspect-square rounded-3xl bg-white overflow-hidden shadow-sm border border-[#eae7eb] flex items-center justify-center">
                <img
                    src={product.image || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600'}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform ${
                        isOutOfStock ? 'grayscale opacity-75' : ''
                    }`}
                />
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] flex items-center justify-center p-3 z-20">
                        <span className="bg-rose-600/95 text-white font-extrabold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">block</span>
                            Stok Habis
                        </span>
                    </div>
                )}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <Badge variant="default" className="text-[11px] font-bold shadow-xs gap-1">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Grade A Super
                    </Badge>
                    <Badge variant="secondary" className="text-[11px] font-bold gap-1 bg-white/95 backdrop-blur text-[#006c49]">
                        <span className="material-symbols-outlined text-[13px]">ac_unit</span>
                        Cold-Chain 0-4°C
                    </Badge>
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[#1b1b1e] text-xs font-bold shadow-xs flex items-center gap-1 border border-zinc-200">
                    <span className="material-symbols-outlined text-amber-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                    </span>
                    <span>4.9</span>
                    <span className="text-zinc-400 text-[10px]">(Panen Segar)</span>
                </div>
            </div>
        </>
    );
}
