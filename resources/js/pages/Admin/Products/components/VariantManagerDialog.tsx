import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ProductItem, ProductVariantItem } from '../types';

interface Props {
    activeProduct: ProductItem | null;
    onClose: () => void;
    onOpenAddVariantModal: () => void;
    onOpenEditVariantModal: (variant: ProductVariantItem) => void;
    onToggleVariant: (variant: ProductVariantItem) => void;
    onDeleteVariant: (variantId: number, sku: string) => void;
}

export default function VariantManagerDialog({
    activeProduct,
    onClose,
    onOpenAddVariantModal,
    onOpenEditVariantModal,
    onToggleVariant,
    onDeleteVariant,
}: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    return (
        <Dialog open={activeProduct !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xs sm:max-w-md w-[92vw] max-h-[88vh] overflow-y-auto rounded-2xl p-4">
                <DialogHeader className="pb-2 border-b border-zinc-100 text-left">
                    <div className="flex items-center gap-2.5">
                        {activeProduct && (
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                                <img
                                    src={activeProduct.image}
                                    alt={activeProduct.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <DialogTitle className="text-sm font-bold text-zinc-900 truncate">
                                Varian: {activeProduct?.name}
                            </DialogTitle>
                            <DialogDescription className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                                <span className="bg-rose-50 text-rose-700 font-bold px-1.5 py-0.2 rounded text-[9px]">
                                    {activeProduct?.category_name}
                                </span>
                                <span>{activeProduct?.variants?.length || 0} varian terdaftar</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-col gap-3 pt-2">
                    {/* Popup trigger for Add Variant */}
                    <Button
                        type="button"
                        size="sm"
                        onClick={onOpenAddVariantModal}
                        className="w-full h-8.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl gap-1 shadow-2xs cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        <span>+ Tambah Varian Baru</span>
                    </Button>

                    {/* List of existing variants */}
                    <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-zinc-500 px-0.5">
                            Daftar Varian Terdaftar ({activeProduct?.variants?.length || 0})
                        </span>

                        {!activeProduct?.variants || activeProduct.variants.length === 0 ? (
                            <div className="text-center py-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <span className="material-symbols-outlined text-zinc-300 text-3xl mb-1">
                                    style
                                </span>
                                <p className="text-xs font-semibold text-zinc-600">Belum ada varian</p>
                                <p className="text-[10px] text-zinc-400 mt-0.5">
                                    Klik tombol "+ Tambah Varian Baru" di atas untuk menambahkan kemasan & harga.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {activeProduct.variants.map((v) => (
                                    <div
                                        key={v.id}
                                        className="bg-white rounded-xl border border-zinc-200/90 p-2.5 flex flex-col gap-1.5 shadow-2xs transition-all hover:border-rose-200"
                                    >
                                        <div className="flex items-start justify-between gap-1">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="font-mono font-bold text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-100">
                                                        {v.sku}
                                                    </span>
                                                    <span className="text-[10px] font-semibold text-zinc-700">
                                                        {v.packaging_name} • {v.size_name}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => onToggleVariant(v)}
                                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded cursor-pointer shrink-0 transition-colors ${
                                                    v.is_active
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                                                }`}
                                            >
                                                {v.is_active ? 'Aktif' : 'Non-aktif'}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-zinc-900">
                                                    {formatRupiah(v.price)}
                                                </span>
                                                <span
                                                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                                        v.stock <= 5
                                                            ? 'bg-rose-100 text-rose-800'
                                                            : 'bg-emerald-50 text-emerald-800'
                                                    }`}
                                                >
                                                    Stok: {v.stock} {v.unit_symbol}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => onOpenEditVariantModal(v)}
                                                    className="text-[10px] font-bold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 px-2 py-0.5 rounded-lg border border-zinc-200 cursor-pointer flex items-center gap-0.5"
                                                >
                                                    <span className="material-symbols-outlined text-[12px]">edit</span>
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteVariant(v.id, v.sku)}
                                                    className="text-[10px] font-bold text-rose-600 hover:bg-rose-50 px-1.5 py-0.5 rounded-lg cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="pt-2 border-t border-zinc-100">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="w-full h-8 text-xs rounded-xl"
                    >
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
