import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckoutUser } from '../types';

interface Props {
    currentUser?: CheckoutUser | null;
    totalPrice: number;
    shippingCost: number;
    discountPromo: number;
    finalTotal: number;
    isCartEmpty: boolean;
    processing: boolean;
    authError?: string;
}

export default function OrderSummaryCard({
    currentUser,
    totalPrice,
    shippingCost,
    discountPromo,
    finalTotal,
    isCartEmpty,
    processing,
    authError,
}: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Rincian Pembayaran */}
            <Card className="border-rose-100 shadow-xs">
                <CardContent className="p-5">
                    <h2 className="font-bold text-base text-[#1b1b1e] mb-3">Rincian Pembayaran</h2>
                    <div className="flex flex-col gap-2 text-xs text-zinc-600">
                        <div className="flex justify-between items-center">
                            <span>Subtotal Produk</span>
                            <span className="font-bold text-zinc-900">{formatRupiah(totalPrice)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>Ongkos Kirim Cold-Chain</span>
                            <span className="font-bold text-zinc-900">{formatRupiah(shippingCost)}</span>
                        </div>

                        <div className="flex justify-between items-center text-emerald-700 font-semibold">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">local_offer</span>
                                <span>Voucher Diskon Petik Segar</span>
                            </div>
                            <span>-{formatRupiah(discountPromo)}</span>
                        </div>

                        <Separator className="my-1" />

                        <div className="flex justify-between items-baseline pt-1">
                            <div>
                                <span className="font-bold text-sm text-zinc-900 block">Total Tagihan</span>
                                <span className="text-[10px] text-zinc-400">Termasuk PPN & Jaminan Segar</span>
                            </div>
                            <span className="font-extrabold text-2xl text-rose-600">
                                {formatRupiah(finalTotal)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button & Auth Notice */}
            <div className="flex flex-col gap-2">
                {authError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700">
                        <span className="material-symbols-outlined text-rose-600 text-[18px]">error</span>
                        <span>{authError}</span>
                    </div>
                )}
                <Button
                    type="submit"
                    disabled={processing || isCartEmpty}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {!currentUser ? 'login' : 'lock'}
                    </span>
                    <span>
                        {processing
                            ? 'Memproses Pesanan...'
                            : `Konfirmasi & Pesan Sekarang (${formatRupiah(finalTotal)})`}
                    </span>
                </Button>
                <p className="text-[11px] text-center text-zinc-400 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-emerald-700 text-[16px]">
                        verified_user
                    </span>
                    {!currentUser
                        ? 'Akan otomatis diminta masuk akun terlebih dahulu'
                        : 'Transaksi dienkripsi aman dengan jaminan buah segar 100%'}
                </p>
            </div>
        </div>
    );
}
