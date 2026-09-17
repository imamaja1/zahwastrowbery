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
import { StockItem } from '../types';

interface Props {
    adjustingStock: StockItem | null;
    data: {
        variant_id: string;
        type: string;
        quantity: string;
        notes: string;
    };
    processing: boolean;
    errors: Partial<Record<string, string>>;
    onClose: () => void;
    onSetData: (key: string, value: string) => void;
    onSaveAdjustment: (e: React.FormEvent) => void;
}

export default function StockAdjustmentDialog({
    adjustingStock,
    data,
    processing,
    errors,
    onClose,
    onSetData,
    onSaveAdjustment,
}: Props) {
    const calcStockAfter = () => {
        if (!adjustingStock || !data.quantity) return adjustingStock?.stock || 0;
        const current = adjustingStock.stock;
        const qty = parseFloat(data.quantity) || 0;
        if (data.type === 'IN') return current + qty;
        if (data.type === 'OUT') return Math.max(0, current - qty);
        if (data.type === 'ADJUSTMENT') return qty;
        return current;
    };

    return (
        <Dialog open={adjustingStock !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xs sm:max-w-sm w-[92vw] rounded-2xl p-4">
                <DialogHeader className="pb-2 border-b border-slate-100 text-left">
                    <DialogTitle className="text-sm font-bold text-slate-900">
                        Penyesuaian Stok Fisik
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500">
                        {adjustingStock?.product_name} ({adjustingStock?.variant_label})
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSaveAdjustment} className="space-y-3 pt-1">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">
                                Stok Saat Ini
                            </span>
                            <span className="font-extrabold text-slate-800">
                                {adjustingStock?.stock} {adjustingStock?.unit_symbol}
                            </span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">
                            arrow_forward
                        </span>
                        <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">
                                Estimasi Akhir
                            </span>
                            <span className="font-extrabold text-emerald-700">
                                {calcStockAfter()} {adjustingStock?.unit_symbol}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="type" className="text-xs font-semibold text-slate-700">
                            Jenis Penyesuaian
                        </Label>
                        <Select value={data.type} onValueChange={(val) => onSetData('type', val)}>
                            <SelectTrigger id="type" className="h-8.5 text-xs rounded-xl">
                                <SelectValue placeholder="Pilih Jenis" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IN">Stok Masuk / Panen Baru (IN)</SelectItem>
                                <SelectItem value="OUT">Stok Keluar / Buah Rusak (OUT)</SelectItem>
                                <SelectItem value="ADJUSTMENT">
                                    Koreksi Opname Fisik (SET EXACT)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="quantity" className="text-xs font-semibold text-slate-700">
                            Jumlah ({adjustingStock?.unit_symbol}) *
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={data.quantity}
                            onChange={(e) => onSetData('quantity', e.target.value)}
                            placeholder="cth: 5"
                            className="h-8.5 text-xs rounded-xl"
                            required
                        />
                        {errors.quantity && (
                            <p className="text-[10px] text-rose-600 font-medium">{errors.quantity}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="notes" className="text-xs font-semibold text-slate-700">
                            Catatan / Alasan
                        </Label>
                        <Input
                            id="notes"
                            type="text"
                            value={data.notes}
                            onChange={(e) => onSetData('notes', e.target.value)}
                            placeholder="cth: Panen pagi 5kg / Sortir busuk..."
                            className="h-8.5 text-xs rounded-xl"
                        />
                    </div>

                    <DialogFooter className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">
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
                            disabled={processing}
                            className="h-8 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                        >
                            {processing ? 'Menyimpan...' : 'Terapkan Stok'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
