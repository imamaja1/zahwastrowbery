import React from 'react';
import { Button } from '@/components/ui/button';
import { PendingItem } from '../types';

interface Props {
    pendingVerifications: PendingItem[];
    onExamineProof: (proofUrl: string) => void;
    onStartReject: (id: number) => void;
    onApprove: (id: number) => void;
}

export default function PendingVerificationSection({
    pendingVerifications,
    onExamineProof,
    onStartReject,
    onApprove,
}: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    return (
        <div className="flex flex-col gap-2" id="section-verifikasi">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-rose-600 text-[17px]">
                        verified
                    </span>
                    <h2 className="font-extrabold text-xs sm:text-sm text-zinc-900">
                        Verifikasi Pembayaran
                    </h2>
                </div>
                <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        pendingVerifications.length > 0
                            ? 'bg-rose-600 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                    }`}
                >
                    {pendingVerifications.length} Antrean
                </span>
            </div>

            {pendingVerifications.length === 0 ? (
                <div className="p-3 text-center border border-emerald-100 bg-emerald-50/30 rounded-2xl shadow-2xs flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">
                        task_alt
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                        Semua pembayaran beres terverifikasi!
                    </span>
                </div>
            ) : (
                <div className="flex flex-col gap-2.5">
                    {pendingVerifications.map((item) => (
                        <div
                            key={item.id}
                            className="border border-amber-200 bg-white shadow-2xs rounded-2xl p-3 flex flex-col gap-2"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-[11px] font-bold text-rose-600">
                                            {item.invoice_number}
                                        </span>
                                        <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded text-[9px] font-bold">
                                            {item.payment_method}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-xs text-zinc-900 mt-0.5">
                                        {item.customer_name}
                                    </h4>
                                    <span className="text-[10px] text-zinc-500">
                                        📞 {item.customer_phone}
                                    </span>
                                </div>

                                <div className="text-right shrink-0">
                                    <span className="font-black text-xs sm:text-sm text-rose-600 block">
                                        {formatRupiah(item.total_amount)}
                                    </span>
                                    <span className="text-[9px] text-zinc-400">{item.created_at}</span>
                                </div>
                            </div>

                            {/* Proof thumbnail & action */}
                            {item.payment_proof && (
                                <div className="flex items-center justify-between gap-2 bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-zinc-200 shrink-0 border border-zinc-300">
                                            <img
                                                src={item.payment_proof}
                                                alt="Bukti"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="text-[10px] font-semibold text-zinc-700">
                                            Foto Bukti Transfer
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onExamineProof(item.payment_proof!)}
                                        className="text-[10px] font-bold text-rose-600 hover:underline bg-white px-2 py-1 rounded-lg border border-rose-200 cursor-pointer"
                                    >
                                        Periksa
                                    </button>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onStartReject(item.id)}
                                    className="flex-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200 h-7.5 font-bold text-[11px] rounded-xl cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[14px] mr-1">
                                        close
                                    </span>
                                    <span>Tolak</span>
                                </Button>

                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => onApprove(item.id)}
                                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white h-7.5 font-bold text-[11px] rounded-xl shadow-xs cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[14px] mr-1">
                                        check_circle
                                    </span>
                                    <span>Setujui (LUNAS)</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
