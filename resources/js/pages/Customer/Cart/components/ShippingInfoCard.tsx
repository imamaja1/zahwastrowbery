import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { CheckoutUser } from '../types';

interface Props {
    currentUser?: CheckoutUser | null;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    notes: string;
    errors: Partial<Record<string, string>>;
    onUpdateField: (field: string, value: string) => void;
    onOpenAuthModal: () => void;
}

export default function ShippingInfoCard({
    currentUser,
    customerName,
    customerPhone,
    customerAddress,
    notes,
    errors,
    onUpdateField,
    onOpenAuthModal,
}: Props) {
    return (
        <Card className="border-rose-100 shadow-xs">
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-600 text-[22px]">location_on</span>
                        <h2 className="font-bold text-base text-[#1b1b1e]">Informasi Pengiriman</h2>
                    </div>
                    {!currentUser && (
                        <button
                            type="button"
                            onClick={onOpenAuthModal}
                            className="text-[11px] font-bold text-[#b80035] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[14px]">login</span>
                            <span>Masuk Akun</span>
                        </button>
                    )}
                </div>

                {!currentUser && (
                    <div className="mb-4 p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-amber-900">
                            <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0">info</span>
                            <span className="text-[11px]">
                                Anda belum login. Silakan <strong>masuk akun</strong> agar pesanan tersimpan di riwayat akun Anda.
                            </span>
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={onOpenAuthModal}
                            className="text-[10px] font-bold text-[#b80035] border-rose-200 hover:bg-rose-50 rounded-xl h-7 px-2.5 shrink-0"
                        >
                            Login
                        </Button>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="customer_name">
                                Nama Penerima <span className="text-rose-600">*</span>
                            </Label>
                            <Input
                                id="customer_name"
                                value={customerName}
                                onChange={(e) => onUpdateField('customer_name', e.target.value)}
                                placeholder="cth: Muhammad Budi"
                                required
                                className="h-11 text-xs"
                            />
                            {errors.customer_name && (
                                <span className="text-rose-600 text-[11px] font-medium">{errors.customer_name}</span>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="customer_phone">
                                No. WhatsApp / HP <span className="text-rose-600">*</span>
                            </Label>
                            <Input
                                id="customer_phone"
                                value={customerPhone}
                                onChange={(e) => onUpdateField('customer_phone', e.target.value)}
                                placeholder="cth: 081234567890"
                                required
                                className="h-11 text-xs"
                            />
                            {errors.customer_phone && (
                                <span className="text-rose-600 text-[11px] font-medium">{errors.customer_phone}</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="customer_address">Alamat Pengantaran</Label>
                        <Textarea
                            id="customer_address"
                            rows={2}
                            value={customerAddress}
                            onChange={(e) => onUpdateField('customer_address', e.target.value)}
                            placeholder="Jl. Buah Segar No. 12, RT 02/04, Bandung / Jakarta..."
                            className="text-xs resize-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="notes">Catatan Khusus (Opsional)</Label>
                        <Input
                            id="notes"
                            value={notes}
                            onChange={(e) => onUpdateField('notes', e.target.value)}
                            placeholder="cth: Mohon pilih yang buahnya tidak terlalu matang / kirim pagi..."
                            className="h-11 text-xs"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
