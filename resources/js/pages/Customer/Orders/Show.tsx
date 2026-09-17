import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '../../../layouts/CustomerLayout';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';

interface SaleItem {
    id: number;
    product_name: string;
    variant_name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

interface SaleDetail {
    id: number;
    invoice_number: string;
    customer_name: string;
    customer_phone: string;
    customer_address?: string | null;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    payment_proof?: string | null;
    notes?: string | null;
    rejection_reason?: string | null;
    paid_at?: string | null;
    created_at: string;
    items: SaleItem[];
}

interface Props {
    sale: SaleDetail;
}

export default function OrderShow({ sale }: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    const getStatusCard = () => {
        switch (sale.payment_status) {
            case 'PAID':
                return (
                    <Card className="bg-emerald-50/70 border-emerald-200 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[24px]">verified</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-emerald-900 block">
                                    Pembayaran Lunas (PAID)
                                </span>
                                <span className="text-[11px] text-emerald-700 block">
                                    Diverifikasi pada: {sale.paid_at || sale.created_at}. Buah segar Anda sedang dikemas dan dikirim.
                                </span>
                            </div>
                        </div>
                    </Card>
                );
            case 'WAITING_VERIFICATION':
                return (
                    <Card className="bg-amber-50/70 border-amber-200 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[24px]">schedule</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-amber-900 block">
                                    Menunggu Verifikasi Admin
                                </span>
                                <span className="text-[11px] text-amber-700 block">
                                    Pesanan Anda sedang dalam antrean verifikasi dan persiapan oleh tim ZahwaStrowbery.
                                </span>
                            </div>
                        </div>
                    </Card>
                );
            case 'REJECTED':
                return (
                    <Card className="bg-rose-50/70 border-rose-200 rounded-2xl p-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[24px]">cancel</span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-rose-900 block">
                                        Pesanan Dibatalkan / Ditolak (REJECTED)
                                    </span>
                                    <span className="text-[11px] text-rose-700 block">
                                        Alasan: {sale.rejection_reason || 'Pesanan dibatalkan oleh admin toko.'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            default:
                return (
                    <Card className="bg-zinc-50 border-zinc-200 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-600 text-white flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[24px]">pending</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-zinc-900 block">
                                    Pesanan Diproses (PENDING)
                                </span>
                                <span className="text-[11px] text-zinc-600 block">
                                    {sale.payment_method === 'COD'
                                        ? 'Pesanan COD diproses. Silakan siapkan uang tunai saat kurir tiba.'
                                        : 'Pesanan telah diterima dan akan diverifikasi langsung oleh admin.'}
                                </span>
                            </div>
                        </div>
                    </Card>
                );
        }
    };

    return (
        <CustomerLayout title={`Invoice ${sale.invoice_number}`}>
            <Head title={`Invoice ${sale.invoice_number} - ZahwaStrowbery`} />

            <div className="flex flex-col w-full max-w-2xl mx-auto px-4 py-4 md:py-6 pb-20 gap-5">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs font-bold text-zinc-600 hover:text-[#b80035] -ml-2">
                        <Link href="/">
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            <span>Kembali ke Beranda</span>
                        </Link>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.print()}
                        className="rounded-xl gap-1.5 text-xs font-bold"
                    >
                        <span className="material-symbols-outlined text-[16px]">print</span>
                        <span>Cetak Invoice</span>
                    </Button>
                </div>

                {/* Status Card */}
                {getStatusCard()}

                {/* Invoice Main Card */}
                <Card className="rounded-3xl p-6 shadow-xs border-[#eae7eb] flex flex-col gap-5">
                    {/* Brand & Invoice Header */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-zinc-100 gap-2">
                        <div>
                            <span className="text-[10px] font-bold text-[#006c49] uppercase tracking-wider block">
                                INVOICE PENJUALAN BUAH SEGAR
                            </span>
                            <h2 className="font-extrabold text-xl text-[#b80035] font-mono">
                                {sale.invoice_number}
                            </h2>
                            <span className="text-xs text-zinc-500">{sale.created_at}</span>
                        </div>
                        <div className="sm:text-right">
                            <span className="text-xs font-bold text-zinc-800 block">ZahwaStrowbery</span>
                            <div className="flex items-center sm:justify-end gap-1.5 mt-0.5">
                                <span className="text-[11px] text-zinc-500">Metode:</span>
                                <Badge variant="secondary" className="uppercase text-[10px] font-bold">
                                    {sale.payment_method}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="p-4 rounded-2xl bg-[#f6f2f7] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                            <span className="text-zinc-400 font-medium block">Penerima</span>
                            <span className="font-bold text-zinc-900 block">{sale.customer_name}</span>
                            <span className="text-zinc-600">{sale.customer_phone}</span>
                        </div>
                        <div>
                            <span className="text-zinc-400 font-medium block">Alamat Pengiriman</span>
                            <span className="text-zinc-800 font-medium">
                                {sale.customer_address || 'Pengambilan di Gerai / Toko'}
                            </span>
                        </div>
                    </div>

                    {/* Itemized Snapshot Table */}
                    <div className="flex flex-col gap-2.5">
                        <span className="text-xs font-bold text-zinc-800">Rincian Item Produk</span>
                        <div className="flex flex-col divide-y divide-zinc-100 border border-zinc-100 rounded-2xl overflow-hidden">
                            {sale.items.map((item) => (
                                <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                                    <div>
                                        <h4 className="font-bold text-zinc-900">{item.product_name}</h4>
                                        <span className="text-[11px] text-[#b80035] font-semibold">
                                            {item.variant_name} × {item.quantity}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-zinc-900 block">
                                            {formatRupiah(item.subtotal)}
                                        </span>
                                        <span className="text-[10px] text-zinc-400">
                                            @{formatRupiah(item.price)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Summary */}
                    <div className="p-4 rounded-2xl bg-zinc-50 flex justify-between items-center border border-zinc-100">
                        <div>
                            <span className="text-xs font-bold text-zinc-700 block">Total Tagihan</span>
                            <span className="text-[10px] text-zinc-400">Termasuk Jaminan Segar</span>
                        </div>
                        <span className="font-extrabold text-2xl text-[#b80035]">
                            {formatRupiah(sale.total_amount)}
                        </span>
                    </div>

                    {/* Payment Proof Preview if present */}
                    {sale.payment_proof && (
                        <div className="pt-2 border-t border-zinc-100">
                            <span className="text-xs font-bold text-zinc-800 block mb-2">
                                Foto Bukti Pembayaran Terlampir:
                            </span>
                            <div className="p-2 bg-zinc-50 rounded-2xl border border-zinc-200 inline-block">
                                <a href={sale.payment_proof} target="_blank" rel="noreferrer">
                                    <img
                                        src={sale.payment_proof}
                                        alt="Bukti Transfer"
                                        className="max-h-48 rounded-xl object-contain hover:opacity-95 transition-opacity"
                                    />
                                </a>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </CustomerLayout>
    );
}
