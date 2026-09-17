import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Variant } from '../types';

interface PurchaseActionCardProps {
    activeVariant: Variant | undefined;
    isKgUnit: boolean;
    quantity: number;
    subtotal: number;
    isAdded: boolean;
    onQtyMinus: () => void;
    onQtyPlus: () => void;
    onAddToCart: () => void;
    onBuyNow: () => void;
}

export default function PurchaseActionCard({
    activeVariant,
    isKgUnit,
    quantity,
    subtotal,
    isAdded,
    onQtyMinus,
    onQtyPlus,
    onAddToCart,
    onBuyNow,
}: PurchaseActionCardProps) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    const isAvailable = activeVariant && activeVariant.stock > 0;

    return (
        <Card className="border-rose-100 shadow-xs">
            <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#1b1b1e]">Jumlah Pembelian</span>
                        <span className="text-[11px] text-zinc-500">
                            {isKgUnit
                                ? 'Kelipatan timbang 0.5 Kg'
                                : `Satuan per ${activeVariant?.unit_symbol || 'Pcs'}`}
                        </span>
                    </div>

                    <div className="flex items-center bg-slate-100 rounded-full p-1 shadow-inner">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onQtyMinus}
                            className="w-8 h-8 p-0 rounded-full bg-white text-zinc-800 border-0 shadow-2xs"
                        >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                        </Button>
                        <span className="w-12 text-center text-sm font-extrabold text-[#1b1b1e]">
                            {quantity}
                        </span>
                        <Button
                            type="button"
                            size="sm"
                            onClick={onQtyPlus}
                            className="w-8 h-8 p-0 rounded-full bg-rose-600 hover:bg-rose-700 text-white border-0 shadow-2xs"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                        </Button>
                    </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-medium">Estimasi Subtotal</span>
                    <span className="font-extrabold text-base text-rose-600">
                        {formatRupiah(subtotal)}
                    </span>
                </div>

                <div className="flex gap-2 pt-1">
                    <Button
                        type="button"
                        onClick={onAddToCart}
                        disabled={!isAvailable}
                        className={`flex-1 h-11 rounded-2xl font-bold text-xs gap-1.5 shadow-md cursor-pointer ${
                            isAdded
                                ? 'bg-[#006c49] hover:bg-[#005236] text-white'
                                : 'bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            {isAdded ? 'check' : 'add_shopping_cart'}
                        </span>
                        <span>
                            {isAdded
                                ? 'Berhasil Ditambahkan! ✓'
                                : `+ Tambah ke Keranjang`}
                        </span>
                    </Button>
                    <Button
                        type="button"
                        onClick={onBuyNow}
                        disabled={!isAvailable}
                        className="h-11 px-4 rounded-2xl bg-[#006c49] hover:bg-[#005236] text-white text-xs font-bold shadow-md cursor-pointer shrink-0"
                    >
                        Beli Langsung
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
