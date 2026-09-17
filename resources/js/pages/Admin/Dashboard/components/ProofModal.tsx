import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Props {
    selectedProof: string | null;
    onClose: () => void;
}

export default function ProofModal({ selectedProof, onClose }: Props) {
    return (
        <Dialog open={selectedProof !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xs sm:max-w-md w-[90vw] rounded-2xl p-4">
                <DialogHeader>
                    <DialogTitle className="text-sm font-bold text-zinc-900">
                        Pratinjau Bukti Transfer
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-zinc-500">
                        Periksa nominal dan rekening pengirim.
                    </DialogDescription>
                </DialogHeader>
                {selectedProof && (
                    <div className="py-2">
                        <img
                            src={selectedProof}
                            alt="Bukti Transfer"
                            className="max-h-[50vh] w-full object-contain rounded-xl border border-zinc-200"
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
