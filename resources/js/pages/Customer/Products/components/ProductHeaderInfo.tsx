import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductDetail, Variant } from '../types';

interface ProductHeaderInfoProps {
    product: ProductDetail;
    activeVariant: Variant | undefined;
}

export default function ProductHeaderInfo({
    product,
    activeVariant,
}: ProductHeaderInfoProps) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    const isAvailable = activeVariant && activeVariant.stock > 0;

    return (
        <div className="pt-4 flex flex-col">
            <h1 className="font-extrabold text-2xl text-[#1b1b1e] tracking-tight">
                {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1.5 leading-relaxed">
                {product.description || 'Buah segar kualitas premium dipetik langsung dari kebun dengan perlakuan higienis dan rantai dingin.'}
            </p>

            {/* Price and Stock Summary Card */}
            <Card className="mt-4 border-rose-100 shadow-xs">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-zinc-500">Harga Satuan Varian</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="font-extrabold text-2xl text-rose-600">
                                {formatRupiah(activeVariant?.price || 0)}
                            </span>
                            <span className="text-xs font-medium text-zinc-500">
                                / {activeVariant?.unit_symbol || 'Pcs'}
                            </span>
                        </div>
                    </div>

                    <Badge variant={isAvailable ? 'secondary' : 'destructive'} className="font-bold text-xs py-1 px-3">
                        {isAvailable
                            ? `Tersedia ${activeVariant.stock} ${activeVariant.unit_symbol}`
                            : 'Stok Habis'}
                    </Badge>
                </CardContent>
            </Card>
        </div>
    );
}
