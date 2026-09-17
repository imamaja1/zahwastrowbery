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
import { Sale } from '../types';

interface Props {
    approvingSale: Sale | null;
    isApproving: boolean;
    onClose: () => void;
    onConfirmApprove: () => void;
}

export default function SaleApproveDialog({
    approvingSale,
    isApproving,
    onClose,
    onConfirmApprove,
}: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    return (
        <Dialog open={approvingSale !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xs sm:max-w-md w-[90vw] rounded-2xl p-4">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                            verified
                        </span>
                        <span>Konfirmasi Setujui Pembayaran</span>
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-zinc-500">
                        Pastikan Anda sudah mengecek mutasi rekening atau dana QRIS yang masuk.
                    </DialogDescription>
                </DialogHeader>

                {approvingSale && (
                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 flex flex-col gap-1 text-xs my-1">
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Invoice:</span>
                            <span className="font-mono font-bold text-zinc-900">
                                {approvingSale.invoice_number}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Pelanggan:</span>
                            <span className="font-bold text-zinc-900">
                                {approvingSale.customer_name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Total Tagihan:</span>
                            <span className="font-black text-emerald-700">
                                {formatRupiah(approvingSale.total_amount)}
                            </span>
                        </div>
                    </div>
                )}

                <DialogFooter className="flex items-center justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl text-xs font-bold h-8"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirmApprove}
                        disabled={isApproving}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold h-8 cursor-pointer"
                    >
                        {isApproving ? 'Menyetujui...' : 'Ya, Setujui Lunas'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
