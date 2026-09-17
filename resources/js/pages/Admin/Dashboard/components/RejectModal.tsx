import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Props {
    rejectingId: number | null;
    rejectionReason: string;
    onClose: () => void;
    onReasonChange: (reason: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function RejectModal({
    rejectingId,
    rejectionReason,
    onClose,
    onReasonChange,
    onSubmit,
}: Props) {
    return (
        <Dialog open={rejectingId !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xs sm:max-w-md w-[90vw] rounded-2xl p-4">
                <DialogHeader>
                    <DialogTitle className="text-sm font-bold text-zinc-900">
                        Tolak Pembayaran
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-zinc-500">
                        Berikan alasan penolakan untuk pelanggan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-3 pt-1">
                    <Textarea
                        rows={3}
                        value={rejectionReason}
                        onChange={(e) => onReasonChange(e.target.value)}
                        placeholder="cth: Bukti transfer tidak jelas / dana belum masuk..."
                        className="rounded-xl border-zinc-300 text-xs"
                        required
                    />

                    <DialogFooter className="flex items-center justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl text-xs font-bold h-8"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            className="rounded-xl text-xs font-bold h-8"
                        >
                            Kirim
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
