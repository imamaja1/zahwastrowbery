import React from 'react';
import { Button } from '@/components/ui/button';
import { ProductItem } from '../types';

interface Props {
    products: ProductItem[];
    searchTerm: string;
    onToggleProduct: (id: number) => void;
    onOpenManageVariants: (product: ProductItem) => void;
    onOpenEditModal: (product: ProductItem) => void;
    onDeleteProduct: (id: number, name: string) => void;
}

export default function ProductCardList({
    products,
    searchTerm,
    onToggleProduct,
    onOpenManageVariants,
    onOpenEditModal,
    onDeleteProduct,
}: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    if (products.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200 p-6">
                <span className="material-symbols-outlined text-zinc-300 text-4xl mb-1">inventory_2</span>
                <h3 className="font-bold text-zinc-700 text-xs">Tidak ada buah ditemukan</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                    {searchTerm
                        ? `Tidak ada hasil yang cocok dengan "${searchTerm}".`
                        : 'Coba ubah filter atau tambahkan buah baru.'}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2.5">
            {products.map((p) => (
                <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-3 flex flex-col gap-2.5 transition-all hover:border-rose-200"
                >
                    <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1.5">
                                <div>
                                    <h3 className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                                        {p.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                            {p.category_name}
                                        </span>
                                        <span className="text-[10px] text-zinc-500 font-semibold">
                                            {p.variants_count} varian
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onToggleProduct(p.id)}
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full cursor-pointer shrink-0 transition-colors ${
                                        p.is_active
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-zinc-100 text-zinc-500'
                                    }`}
                                >
                                    {p.is_active ? 'Tampil' : 'Sembunyi'}
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-zinc-100">
                                <span className="font-black text-xs text-rose-600">
                                    {p.min_price === p.max_price
                                        ? formatRupiah(p.min_price)
                                        : `${formatRupiah(p.min_price)} - ${formatRupiah(p.max_price)}`}
                                </span>

                                <span
                                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                        p.total_stock <= 5
                                            ? 'bg-rose-100 text-rose-800'
                                            : 'bg-emerald-50 text-emerald-800'
                                    }`}
                                >
                                    Stok: {p.total_stock} unit
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions Bottom: + Varian, Edit, Delete */}
                    <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-zinc-100">
                        {/* Manage Variants Button beside Edit */}
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => onOpenManageVariants(p)}
                            className="h-7 px-2.5 text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl gap-1 cursor-pointer shadow-2xs"
                        >
                            <span className="material-symbols-outlined text-[14px]">style</span>
                            <span>Varian ({p.variants_count})</span>
                        </Button>

                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onOpenEditModal(p)}
                                className="h-7 px-2.5 text-[11px] font-semibold text-zinc-700 border-zinc-200 hover:bg-zinc-100 rounded-xl cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[13px] mr-1">edit</span>
                                <span>Edit</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteProduct(p.id, p.name)}
                                className="h-7 px-2 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
