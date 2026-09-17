import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '../../../layouts/CustomerLayout';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

interface OrderItem {
    id: number;
    invoice_number: string;
    customer_name: string;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    created_at: string;
    items_count: number;
}

interface Props {
    orders: {
        data: OrderItem[];
        links: any[];
    };
}

export default function OrderIndex({ orders }: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return (
                    <Badge variant="success" className="gap-1 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        LUNAS (PAID)
                    </Badge>
                );
            case 'WAITING_VERIFICATION':
                return (
                    <Badge variant="warning" className="gap-1 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        VERIFIKASI ADMIN
                    </Badge>
                );
            case 'REJECTED':
                return (
                    <Badge variant="destructive" className="gap-1 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                        DITOLAK
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="gap-1 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                        MENUNGGU (PENDING)
                    </Badge>
                );
        }
    };

    return (
        <CustomerLayout title="Riwayat Pesanan Saya">
            <Head title="Pesanan Saya - ZahwaStrowbery" />

            <div className="flex flex-col w-full max-w-3xl mx-auto px-4 py-4 md:py-6 pb-20">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="font-bold text-xl text-[#1b1b1e]">Riwayat Transaksi</h1>
                        <p className="text-xs text-zinc-500">Pantau status pesanan dan verifikasi pembayaran Anda</p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="rounded-xl">
                        <Link href="/">
                            <span className="material-symbols-outlined text-[16px] mr-1">add</span>
                            <span>Pesan Lagi</span>
                        </Link>
                    </Button>
                </div>

                {orders.data.length === 0 ? (
                    <Card className="rounded-3xl p-8 text-center border-[#eae7eb] shadow-xs">
                        <CardContent className="flex flex-col items-center justify-center p-0">
                            <span className="material-symbols-outlined text-[48px] text-zinc-300">receipt_long</span>
                            <h3 className="font-bold text-sm text-zinc-800 mt-2">Belum Ada Transaksi</h3>
                            <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                                Anda belum melakukan pesanan buah. Mulai jelajahi katalog segar kami!
                            </p>
                            <Button asChild className="mt-4 bg-[#b80035] hover:bg-[#9e002d] text-white rounded-xl shadow-xs">
                                <Link href="/">Mulai Belanja</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-3">
                        {orders.data.map((order) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.invoice_number}`}
                                className="block group"
                            >
                                <Card className="rounded-2xl p-4 border-[#eae7eb] shadow-xs hover:border-[#b80035]/50 hover:shadow-md transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#b80035] flex items-center justify-center shrink-0 border border-rose-100">
                                                <span className="material-symbols-outlined text-[20px]">receipt</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-extrabold text-[#b80035] group-hover:underline">
                                                        {order.invoice_number}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-400">•</span>
                                                    <span className="text-[11px] text-zinc-500 font-medium">
                                                        {order.created_at}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-bold text-zinc-800">
                                                        {formatRupiah(order.total_amount)}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-400">
                                                        ({order.items_count} item • {order.payment_method})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                                            {getStatusBadge(order.payment_status)}
                                            <span className="material-symbols-outlined text-zinc-400 group-hover:text-[#b80035] text-[18px]">
                                                chevron_right
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
