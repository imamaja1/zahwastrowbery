import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Option, Variant, ProductDetail } from '../types';

interface SizeSelectorProps {
    product: ProductDetail;
    sizeOptions: Option[];
    selectedPackagingId: number | null;
    selectedSizeId: number | null;
    activeVariant: Variant | undefined;
    isKgUnit: boolean;
    onSelectSize: (id: number | null) => void;
}

export default function SizeSelector({
    product,
    sizeOptions,
    selectedPackagingId,
    selectedSizeId,
    activeVariant,
    isKgUnit,
    onSelectSize,
}: SizeSelectorProps) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    if (sizeOptions.length === 0 || isKgUnit) return null;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1b1b1e]">Pilihan Ukuran</span>
                <span className="text-[11px] text-zinc-500">
                    {activeVariant?.size_name || 'Semua Ukuran'}
                </span>
            </div>
            <div className="flex flex-col gap-2">
                {sizeOptions.map((sz) => {
                    const isSelected = selectedSizeId === sz.id;
                    const variantForSize = product.variants.find(
                        (v) =>
                            v.packaging_type_id === selectedPackagingId &&
                            v.size_id === sz.id
                    );
                    const isOutOfStock = !variantForSize || variantForSize.stock <= 0;

                    return (
                        <button
                            key={sz.id}
                            type="button"
                            disabled={isOutOfStock}
                            onClick={() => onSelectSize(sz.id)}
                            className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all border cursor-pointer ${
                                isOutOfStock
                                    ? 'opacity-40 bg-zinc-50 text-zinc-400 border-zinc-200 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                    : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <span
                                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                                        isSelected
                                            ? 'bg-white text-rose-600 font-bold'
                                            : 'border border-zinc-300'
                                    }`}
                                >
                                    {isSelected ? '●' : ''}
                                </span>
                                <span className="text-xs font-bold">Ukuran {sz.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                {variantForSize && (
                                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-rose-600'}`}>
                                        {formatRupiah(variantForSize.price)}
                                    </span>
                                )}
                                {isOutOfStock && (
                                    <Badge variant="outline" className="text-[10px] font-bold">
                                        Habis
                                    </Badge>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
