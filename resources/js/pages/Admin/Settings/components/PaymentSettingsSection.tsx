import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PaymentSettings } from '../types';

interface Props {
    payment: PaymentSettings;
    activePaymentCount: number;
    qrisFile: File | null;
    qrisPreview: string | null;
    processing: boolean;
    onUpdateField: (field: keyof PaymentSettings, value: any) => void;
    onToggle: (key: string, group: string, currentValue: boolean) => void;
    onQrisFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSetQrisPreview: (url: string) => void;
    onSave: () => void;
}

export default function PaymentSettingsSection({
    payment,
    activePaymentCount,
    qrisFile,
    qrisPreview,
    processing,
    onUpdateField,
    onToggle,
    onQrisFileChange,
    onSetQrisPreview,
    onSave,
}: Props) {
    return (
        <div className="flex flex-col gap-3">
            {/* Summary Alert */}
            <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600 text-[20px]">account_balance_wallet</span>
                    <div>
                        <h3 className="text-xs font-bold text-amber-950">Metode Pembayaran Checkout</h3>
                        <p className="text-[10px] text-amber-800">
                            Metode yang aktif akan muncul di keranjang belanja pelanggan
                        </p>
                    </div>
                </div>
                <Badge className="bg-amber-600 text-white text-[10px] font-bold">
                    {activePaymentCount} Aktif
                </Badge>
            </div>

            {/* 1. QRIS Configuration */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 shadow-2xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                        </div>
                        <div>
                            <h2 className="text-xs font-bold text-zinc-900">QRIS Standar Indonesia</h2>
                            <p className="text-[10px] text-zinc-400">Pembayaran e-wallet & semua mobile banking</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onToggle('payment_qris_is_active', 'payment', payment.payment_qris_is_active)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all flex items-center gap-1.5 ${
                            payment.payment_qris_is_active
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${
                                payment.payment_qris_is_active ? 'bg-emerald-600' : 'bg-zinc-400'
                            }`}
                        />
                        <span>{payment.payment_qris_is_active ? 'Aktif' : 'Non-aktif'}</span>
                    </button>
                </div>

                <div className="space-y-2.5">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">Nama Tampilan QRIS</Label>
                        <Input
                            value={payment.payment_qris_name}
                            onChange={(e) => onUpdateField('payment_qris_name', e.target.value)}
                            placeholder="cth: QRIS Zahwa Strowbery"
                            className="h-8.5 text-xs rounded-xl"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">Gambar Kode QRIS (URL / Upload)</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input
                                value={payment.payment_qris_image}
                                onChange={(e) => {
                                    onUpdateField('payment_qris_image', e.target.value);
                                    onSetQrisPreview(e.target.value);
                                }}
                                placeholder="URL gambar (https://...)"
                                className="h-8.5 text-xs rounded-xl"
                            />
                            <label className="flex items-center justify-center px-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-xl border border-dashed border-zinc-300 cursor-pointer text-xs text-zinc-600 font-medium">
                                <span className="material-symbols-outlined text-[16px] mr-1.5 text-zinc-500">
                                    upload_file
                                </span>
                                <span>{qrisFile ? qrisFile.name : 'Upload File QRIS'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onQrisFileChange}
                                    className="sr-only"
                                />
                            </label>
                        </div>

                        {qrisPreview && (
                            <div className="mt-2 flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-zinc-200">
                                <img
                                    src={qrisPreview}
                                    alt="QRIS Preview"
                                    className="w-12 h-12 object-contain rounded-lg border border-zinc-200 bg-white"
                                />
                                <div className="text-[10px] text-zinc-500">
                                    <span className="font-bold block text-zinc-700">Preview Gambar QRIS</span>
                                    <span>Gambar ini akan ditampilkan pada layar checkout pembeli.</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">Petunjuk Pembayaran QRIS</Label>
                        <textarea
                            rows={2}
                            value={payment.payment_qris_instructions}
                            onChange={(e) => onUpdateField('payment_qris_instructions', e.target.value)}
                            placeholder="Instruksi scan QRIS untuk pembeli..."
                            className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:outline-rose-500 focus:border-rose-500 bg-transparent leading-relaxed"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Bank Transfer Configuration */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 shadow-2xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">account_balance</span>
                        </div>
                        <div>
                            <h2 className="text-xs font-bold text-zinc-900">Transfer Bank Manual</h2>
                            <p className="text-[10px] text-zinc-400">Transfer rekening bank toko & konfirmasi</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            onToggle('payment_transfer_is_active', 'payment', payment.payment_transfer_is_active)
                        }
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all flex items-center gap-1.5 ${
                            payment.payment_transfer_is_active
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${
                                payment.payment_transfer_is_active ? 'bg-emerald-600' : 'bg-zinc-400'
                            }`}
                        />
                        <span>{payment.payment_transfer_is_active ? 'Aktif' : 'Non-aktif'}</span>
                    </button>
                </div>

                <div className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-[11px] font-semibold text-zinc-700">Nama Bank</Label>
                            <Input
                                value={payment.payment_transfer_bank_name}
                                onChange={(e) => onUpdateField('payment_transfer_bank_name', e.target.value)}
                                placeholder="cth: BCA / Mandiri / BRI"
                                className="h-8.5 text-xs rounded-xl"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[11px] font-semibold text-zinc-700">Nomor Rekening</Label>
                            <Input
                                value={payment.payment_transfer_account_number}
                                onChange={(e) => onUpdateField('payment_transfer_account_number', e.target.value)}
                                placeholder="cth: 1234567890"
                                className="h-8.5 text-xs rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">Nama Pemilik Rekening (A/N)</Label>
                        <Input
                            value={payment.payment_transfer_account_holder}
                            onChange={(e) => onUpdateField('payment_transfer_account_holder', e.target.value)}
                            placeholder="cth: Zahwa Strowbery"
                            className="h-8.5 text-xs rounded-xl"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">Petunjuk Transfer</Label>
                        <textarea
                            rows={2}
                            value={payment.payment_transfer_instructions}
                            onChange={(e) => onUpdateField('payment_transfer_instructions', e.target.value)}
                            placeholder="Petunjuk upload bukti transfer setelah bayar..."
                            className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:outline-rose-500 focus:border-rose-500 bg-transparent leading-relaxed"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Cash on Delivery (COD) Configuration */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 shadow-2xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                        </div>
                        <div>
                            <h2 className="text-xs font-bold text-zinc-900">Bayar di Tempat (COD)</h2>
                            <p className="text-[10px] text-zinc-400">Bayar tunai saat kurir tiba mengantar buah</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onToggle('payment_cod_is_active', 'payment', payment.payment_cod_is_active)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all flex items-center gap-1.5 ${
                            payment.payment_cod_is_active
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${
                                payment.payment_cod_is_active ? 'bg-emerald-600' : 'bg-zinc-400'
                            }`}
                        />
                        <span>{payment.payment_cod_is_active ? 'Aktif' : 'Non-aktif'}</span>
                    </button>
                </div>

                <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-zinc-700">Petunjuk Pembayaran COD</Label>
                    <textarea
                        rows={2}
                        value={payment.payment_cod_instructions}
                        onChange={(e) => onUpdateField('payment_cod_instructions', e.target.value)}
                        placeholder="Siapkan uang pas saat kurir mengantarkan pesanan..."
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:outline-rose-500 focus:border-rose-500 bg-transparent leading-relaxed"
                    />
                </div>
            </div>

            {/* Save Button for Payment Section */}
            <div className="flex justify-end pt-1">
                <Button
                    type="button"
                    onClick={onSave}
                    disabled={processing}
                    className="bg-[#b80035] hover:bg-[#9e002d] text-white text-xs font-bold h-9 px-4 rounded-xl shadow-xs gap-1.5"
                >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Simpan Pengaturan Pembayaran</span>
                </Button>
            </div>
        </div>
    );
}
