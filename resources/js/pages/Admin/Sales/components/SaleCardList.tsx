import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sale } from '../types';

interface Props {
    sales: Sale[];
    search: string;
    onExamineProof: (proofUrl: string) => void;
    onStartApprove: (sale: Sale) => void;
    onStartReject: (id: number) => void;
}

export default function SaleCardList({
    sales,
    search,
    onExamineProof,
    onStartApprove,
    onStartReject,
}: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        LUNAS
                    </span>
                );
            case 'WAITING_VERIFICATION':
                return (
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                        VERIFIKASI
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        DITOLAK
                    </span>
                );
            default:
                return (
                    <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        PENDING
                    </span>
                );
        }
    };

    if (sales.length === 0) {
        return (
            <Card className="border-zinc-200">
                <CardContent className="p-8 text-center">
                    <span className="material-symbols-outlined text-[48px] text-zinc-300">
                        receipt_long
                    </span>
                    <p className="text-sm font-bold text-zinc-700 mt-2">Tidak ada transaksi</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                        {search ? `Tidak ada hasil untuk pencarian "${search}".` : 'Belum ada data pesanan masuk.'}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-2.5">
            {sales.map((sale) => (
                <div
                    key={sale.id}
                    className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-3.5 flex flex-col gap-2.5 transition-all hover:border-zinc-300"
                >
                    {/* Header: Invoice & Status */}
                    <div className="flex items-start justify-between gap-2 border-b border-zinc-100 pb-2">
                        <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                                    {sale.invoice_number}
                                </span>
                                <span className="text-[10px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded">
                                    {sale.payment_method}
                                </span>
                            </div>
                            <span className="text-[10px] text-zinc-400 block mt-1">
                                {sale.created_at}
                            </span>
                        </div>
                        {getStatusBadge(sale.payment_status)}
                    </div>

                    {/* Customer Info */}
                    <div className="flex flex-col gap-0.5 text-xs">
                        <span className="font-extrabold text-zinc-900">{sale.customer_name}</span>
                        <span className="text-zinc-500 text-[11px]">📞 {sale.customer_phone}</span>
                        {sale.customer_address && (
                            <span className="text-zinc-500 text-[11px] line-clamp-1">
                                📍 {sale.customer_address}
                            </span>
                        )}
                        {sale.notes && (
                            <span className="text-amber-800 bg-amber-50/70 p-1.5 rounded-lg text-[10px] border border-amber-200/60 mt-1">
                                📝 Catatan: {sale.notes}
                            </span>
                        )}
                    </div>

                    {/* Items Summary Table */}
                    <div className="bg-[#fbf8fc] rounded-xl p-2.5 border border-zinc-100 flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                            Rincian Buah ({sale.items_count} item)
                        </span>
                        <div className="flex flex-col gap-1 divide-y divide-zinc-200/50">
                            {sale.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between items-center text-[11px] pt-1 first:pt-0">
                                    <span className="text-zinc-700 font-medium truncate max-w-[200px]">
                                        {it.product_name} ({it.variant_name}) x{it.quantity}
                                    </span>
                                    <span className="text-zinc-900 font-bold shrink-0">
                                        {formatRupiah(it.subtotal)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Amount & Rejection Reason */}
                    <div className="flex items-center justify-between pt-1">
                        <div>
                            <span className="text-[10px] text-zinc-400 block leading-none">Total Bayar</span>
                            <span className="font-black text-sm text-rose-600">
                                {formatRupiah(sale.total_amount)}
                            </span>
                        </div>

                        {sale.payment_proof && (
                            <button
                                type="button"
                                onClick={() => onExamineProof(sale.payment_proof!)}
                                className="text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[14px]">visibility</span>
                                <span>Lihat Bukti</span>
                            </button>
                        )}
                    </div>

                    {sale.rejection_reason && (
                        <div className="text-[10px] text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-200">
                            <span className="font-bold block">Alasan Ditolak:</span>
                            <span>{sale.rejection_reason}</span>
                        </div>
                    )}

                    {/* Action verification buttons if WAITING_VERIFICATION */}
                    {sale.payment_status === 'WAITING_VERIFICATION' && (
                        <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onStartReject(sale.id)}
                                className="flex-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200 h-8 font-bold text-xs rounded-xl cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[15px] mr-1">close</span>
                                <span>Tolak</span>
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                onClick={() => onStartApprove(sale)}
                                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white h-8 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[15px] mr-1">check_circle</span>
                                <span>Setujui (Lunas)</span>
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
