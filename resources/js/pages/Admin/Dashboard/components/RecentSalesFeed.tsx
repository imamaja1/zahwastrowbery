import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { RecentSale } from '../types';

interface Props {
    recentSales: RecentSale[];
}

export default function RecentSalesFeed({ recentSales }: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return (
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                        Lunas
                    </span>
                );
            case 'WAITING_VERIFICATION':
                return (
                    <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full text-[9px] font-bold animate-pulse">
                        Verifikasi
                    </span>
                );
            case 'PENDING':
                return (
                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                        Menunggu
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                        Ditolak
                    </span>
                );
            default:
                return (
                    <span className="bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-rose-600 text-[17px]">history</span>
                    <h2 className="font-extrabold text-xs sm:text-sm text-zinc-900">
                        Pesanan Terbaru
                    </h2>
                </div>
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-[10px] font-bold text-rose-600 hover:text-rose-700 h-6 px-1.5"
                >
                    <Link href="/admin/sales">Semua →</Link>
                </Button>
            </div>

            {recentSales.length === 0 ? (
                <div className="p-4 text-center border border-zinc-200 rounded-2xl bg-white">
                    <p className="text-[11px] text-zinc-400">Belum ada transaksi.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {recentSales.map((order) => (
                        <Link
                            key={order.id}
                            href="/admin/sales"
                            className="p-2.5 bg-white rounded-xl border border-zinc-200/80 hover:border-rose-200 hover:bg-rose-50/20 shadow-2xs transition-all flex items-center justify-between gap-2 active:scale-[0.99]"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[10px] font-bold text-rose-600">
                                        {order.invoice_number}
                                    </span>
                                    {getStatusBadge(order.payment_status)}
                                </div>
                                <h4 className="font-bold text-xs text-zinc-900 truncate mt-0.5">
                                    {order.customer_name}
                                </h4>
                                <span className="text-[9px] text-zinc-400 block truncate">
                                    {order.items_summary}
                                </span>
                            </div>

                            <div className="text-right shrink-0">
                                <span className="font-extrabold text-xs text-zinc-900 block">
                                    {formatRupiah(order.total_amount)}
                                </span>
                                <span className="text-[9px] text-zinc-400">{order.created_at}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
