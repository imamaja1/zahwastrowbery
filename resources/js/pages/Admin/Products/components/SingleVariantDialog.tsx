import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MasterOption, ProductItem, ProductVariantItem } from '../types';

interface Props {
    isOpen: boolean;
    activeProduct: ProductItem | null;
    editingVariantItem: ProductVariantItem | null;
    variantPackaging: string;
    variantSize: string;
    variantUnit: string;
    variantSku: string;
    variantPrice: string;
    variantStock: string;
    variantIsActive: boolean;
    variantFormError: string | null;
    isSubmittingVariant: boolean;
    packaging_types: MasterOption[];
    sizes: MasterOption[];
    units: MasterOption[];
    onClose: () => void;
    onSetVariantPackaging: (val: string) => void;
    onSetVariantSize: (val: string) => void;
    onSetVariantUnit: (val: string) => void;
    onSetVariantSku: (val: string) => void;
    onSetVariantPrice: (val: string) => void;
    onSetVariantStock: (val: string) => void;
    onSetVariantIsActive: (val: boolean) => void;
    onSaveVariant: (e: React.FormEvent) => void;
}

export default function SingleVariantDialog({
    isOpen,
    activeProduct,
    editingVariantItem,
    variantPackaging,
    variantSize,
    variantUnit,
    variantSku,
    variantPrice,
    variantStock,
    variantIsActive,
    variantFormError,
    isSubmittingVariant,
    packaging_types,
    sizes,
    units,
    onClose,
    onSetVariantPackaging,
    onSetVariantSize,
    onSetVariantUnit,
    onSetVariantSku,
    onSetVariantPrice,
    onSetVariantStock,
    onSetVariantIsActive,
    onSaveVariant,
}: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xs sm:max-w-md w-[92vw] max-h-[85vh] overflow-y-auto rounded-2xl p-4">
                <DialogHeader className="pb-2 border-b border-zinc-100 text-left">
                    <DialogTitle className="text-sm font-bold text-zinc-900">
                        {editingVariantItem ? 'Edit Spesifikasi Varian' : 'Tambah Varian Baru'}
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-zinc-500">
                        {activeProduct?.name} • Atur kemasan, ukuran, harga & stok.
                    </DialogDescription>
                </DialogHeader>

                {variantFormError && (
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-700 font-medium">
                        {variantFormError}
                    </div>
                )}

                <form onSubmit={onSaveVariant} className="space-y-2.5 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label htmlFor="pop_packaging" className="text-[11px] font-semibold text-zinc-700">
                                Kemasan
                            </Label>
                            <Select value={variantPackaging} onValueChange={onSetVariantPackaging}>
                                <SelectTrigger id="pop_packaging" className="h-8.5 text-xs font-medium rounded-xl">
                                    <SelectValue placeholder="Tanpa Kemasan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">(Tanpa Kemasan)</SelectItem>
                                    {packaging_types.map((pkg) => (
                                        <SelectItem key={pkg.id} value={pkg.id.toString()}>
                                            {pkg.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="pop_size" className="text-[11px] font-semibold text-zinc-700">
                                Ukuran (Size)
                            </Label>
                            <Select value={variantSize} onValueChange={onSetVariantSize}>
                                <SelectTrigger id="pop_size" className="h-8.5 text-xs font-medium rounded-xl">
                                    <SelectValue placeholder="Standard" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">(Standard / Campur)</SelectItem>
                                    {sizes.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label htmlFor="pop_unit" className="text-[11px] font-semibold text-zinc-700">
                                Satuan Dasar *
                            </Label>
                            <Select value={variantUnit} onValueChange={onSetVariantUnit}>
                                <SelectTrigger id="pop_unit" className="h-8.5 text-xs font-medium rounded-xl">
                                    <SelectValue placeholder="Pilih Satuan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((u) => (
                                        <SelectItem key={u.id} value={u.id.toString()}>
                                            {u.name} ({u.symbol})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="pop_sku" className="text-[11px] font-semibold text-zinc-700">
                                SKU / Kode
                            </Label>
                            <Input
                                id="pop_sku"
                                value={variantSku}
                                onChange={(e) => onSetVariantSku(e.target.value.toUpperCase())}
                                placeholder="Otomatis"
                                className="h-8.5 text-xs rounded-xl uppercase font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label htmlFor="pop_price" className="text-[11px] font-semibold text-zinc-700">
                                Harga Jual (Rp) *
                            </Label>
                            <Input
                                id="pop_price"
                                type="number"
                                step="500"
                                min="0"
                                value={variantPrice}
                                onChange={(e) => onSetVariantPrice(e.target.value)}
                                placeholder="18000"
                                className="h-8.5 text-xs rounded-xl"
                                required
                            />
                        </div>

                        {!editingVariantItem && (
                            <div className="space-y-1">
                                <Label htmlFor="pop_stock" className="text-[11px] font-semibold text-zinc-700">
                                    Stok Awal
                                </Label>
                                <Input
                                id="pop_stock"
                                type="number"
                                step="0.1"
                                min="0"
                                value={variantStock}
                                onChange={(e) => onSetVariantStock(e.target.value)}
                                placeholder="0"
                                className="h-8.5 text-xs rounded-xl"
                            />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="pop_active"
                            checked={variantIsActive}
                            onChange={(e) => onSetVariantIsActive(e.target.checked)}
                            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                        <Label htmlFor="pop_active" className="text-xs text-zinc-700 cursor-pointer">
                            Aktifkan varian agar dapat dibeli oleh pelanggan
                        </Label>
                    </div>

                    <DialogFooter className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            className="h-8 text-xs rounded-xl"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isSubmittingVariant}
                            className="h-8 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                        >
                            {isSubmittingVariant
                                ? 'Menyimpan...'
                                : editingVariantItem
                                ? 'Perbarui Varian'
                                : 'Simpan Varian'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
