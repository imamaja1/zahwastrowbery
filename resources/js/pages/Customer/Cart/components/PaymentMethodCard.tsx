import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentMethodType, PaymentSettings } from '../types';

interface Props {
    paymentSettings?: PaymentSettings;
    isQrisActive: boolean;
    isTransferActive: boolean;
    isCodActive: boolean;
    paymentMethod: PaymentMethodType;
    finalTotal: number;
    previewUrl: string | null;
    paymentProofFile: File | null;
    errorProof?: string;
    copiedBank: boolean;
    onMethodChange: (method: PaymentMethodType) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCopyBank: () => void;
}

function PaymentCountdownTimer() {
    const [countdown, setCountdown] = useState(15 * 60 - 1);
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const m = String(Math.floor(countdown / 60)).padStart(2, '0');
    const s = String(countdown % 60).padStart(2, '0');
    return <span>{m}:{s}</span>;
}

export default function PaymentMethodCard({
    paymentSettings,
    isQrisActive,
    isTransferActive,
    isCodActive,
    paymentMethod,
    finalTotal,
    previewUrl,
    paymentProofFile,
    errorProof,
    copiedBank,
    onMethodChange,
    onFileChange,
    onCopyBank,
}: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    return (
        <Card className="border-rose-100 shadow-xs">
            <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-rose-600 text-[22px]">
                        account_balance_wallet
                    </span>
                    <h2 className="font-bold text-base text-[#1b1b1e]">Pilih Metode Pembayaran</h2>
                </div>

                <div className="flex flex-col gap-2.5">
                    {!isQrisActive && !isTransferActive && !isCodActive ? (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center">
                            <span className="material-symbols-outlined text-[24px] text-amber-600 block mb-1">
                                warning
                            </span>
                            <p className="font-bold">Semua metode pembayaran sedang nonaktif</p>
                            <p className="text-[11px] text-amber-700 mt-0.5">
                                Silakan hubungi admin toko via WhatsApp untuk konfirmasi pesanan.
                            </p>
                        </div>
                    ) : null}

                    {/* Option 1: QRIS */}
                    {isQrisActive && (
                        <label
                            onClick={() => onMethodChange('QRIS')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                paymentMethod === 'QRIS'
                                    ? 'bg-rose-50/50 border-rose-600 shadow-xs ring-2 ring-rose-500/20'
                                    : 'bg-[#f6f2f7] border-transparent hover:border-zinc-300'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                        paymentMethod === 'QRIS'
                                            ? 'bg-rose-600 text-white'
                                            : 'border border-zinc-400 bg-white'
                                    }`}
                                >
                                    {paymentMethod === 'QRIS' && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-zinc-900">
                                            {paymentSettings?.qris?.name || 'QRIS Statis Instant'}
                                        </span>
                                        <Badge variant="destructive" className="text-[9px] font-bold px-1.5 py-0">
                                            Cepat
                                        </Badge>
                                    </div>
                                    <p className="text-[11px] text-zinc-500">
                                        BCA Mobile, GoPay, OVO, ShopeePay, Dana, LinkAja & Semua Bank
                                    </p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-rose-600 text-[24px]">
                                qr_code_scanner
                            </span>
                        </label>
                    )}

                    {/* Option 2: Transfer Bank Manual */}
                    {isTransferActive && (
                        <label
                            onClick={() => onMethodChange('TRANSFER')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                paymentMethod === 'TRANSFER'
                                    ? 'bg-rose-50/50 border-rose-600 shadow-xs ring-2 ring-rose-500/20'
                                    : 'bg-[#f6f2f7] border-transparent hover:border-zinc-300'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                        paymentMethod === 'TRANSFER'
                                            ? 'bg-rose-600 text-white'
                                            : 'border border-zinc-400 bg-white'
                                    }`}
                                >
                                    {paymentMethod === 'TRANSFER' && (
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-zinc-900">Transfer Bank Manual</span>
                                    <p className="text-[11px] text-zinc-500">
                                        {paymentSettings?.transfer?.bank_name
                                            ? `Bank ${paymentSettings.transfer.bank_name}`
                                            : 'BCA / Mandiri / BRI'}{' '}
                                        Rekening Toko
                                    </p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-zinc-500 text-[24px]">
                                account_balance
                            </span>
                        </label>
                    )}

                    {/* Option 3: COD */}
                    {isCodActive && (
                        <label
                            onClick={() => onMethodChange('COD')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                paymentMethod === 'COD'
                                    ? 'bg-rose-50/50 border-rose-600 shadow-xs ring-2 ring-rose-500/20'
                                    : 'bg-[#f6f2f7] border-transparent hover:border-zinc-300'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                        paymentMethod === 'COD'
                                            ? 'bg-rose-600 text-white'
                                            : 'border border-zinc-400 bg-white'
                                    }`}
                                >
                                    {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-zinc-900">COD (Bayar di Tempat)</span>
                                    <p className="text-[11px] text-zinc-500">Bayar tunai kepada kurir saat buah sampai</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-zinc-500 text-[24px]">
                                local_shipping
                            </span>
                        </label>
                    )}
                </div>

                {/* Interactive Payment Details Box */}
                {paymentMethod === 'QRIS' && isQrisActive && (
                    <div className="mt-4 p-5 rounded-2xl bg-[#f6f2f7] border border-zinc-200 flex flex-col items-center text-center">
                        <div className="w-full flex items-center justify-between pb-2 border-b border-zinc-200">
                            <span className="text-xs font-bold text-zinc-800">
                                {paymentSettings?.qris?.name || 'QRIS Standar Indonesia'}
                            </span>
                            <Badge variant="destructive" className="gap-1 text-[10px] font-bold">
                                <span className="material-symbols-outlined text-[13px]">timer</span>
                                <PaymentCountdownTimer />
                            </Badge>
                        </div>

                        {/* QR Code Graphic or Custom Uploaded Image */}
                        <div className="p-3 bg-white rounded-2xl shadow-sm my-3 border border-zinc-200">
                            {paymentSettings?.qris?.image_url ? (
                                <div className="w-48 h-48 bg-white flex items-center justify-center">
                                    <img
                                        src={paymentSettings.qris.image_url}
                                        alt="QRIS Toko"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-44 h-44 bg-white flex items-center justify-center relative">
                                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
                                        <rect fill="#ffffff" height="100" width="100"></rect>
                                        <rect fill="#1b1b1e" height="28" width="28" x="5" y="5"></rect>
                                        <rect fill="#ffffff" height="20" width="20" x="9" y="9"></rect>
                                        <rect fill="#1b1b1e" height="12" width="12" x="13" y="13"></rect>
                                        <rect fill="#1b1b1e" height="28" width="28" x="67" y="5"></rect>
                                        <rect fill="#ffffff" height="20" width="20" x="71" y="9"></rect>
                                        <rect fill="#1b1b1e" height="12" width="12" x="75" y="13"></rect>
                                        <rect fill="#1b1b1e" height="28" width="28" x="5" y="67"></rect>
                                        <rect fill="#ffffff" height="20" width="20" x="9" y="71"></rect>
                                        <rect fill="#1b1b1e" height="12" width="12" x="13" y="75"></rect>
                                        <rect fill="#e11d48" height="20" rx="4" width="20" x="40" y="45"></rect>
                                        <circle cx="50" cy="55" fill="#ffffff" r="5"></circle>
                                        <rect fill="#1b1b1e" height="6" width="14" x="20" y="50"></rect>
                                        <rect fill="#1b1b1e" height="6" width="12" x="65" y="42"></rect>
                                        <rect fill="#1b1b1e" height="8" width="10" x="82" y="40"></rect>
                                        <rect fill="#1b1b1e" height="6" width="14" x="70" y="52"></rect>
                                        <rect fill="#1b1b1e" height="12" width="6" x="40" y="70"></rect>
                                        <rect fill="#1b1b1e" height="6" width="12" x="50" y="76"></rect>
                                        <rect fill="#1b1b1e" height="8" width="18" x="74" y="82"></rect>
                                    </svg>
                                </div>
                            )}
                            <p className="text-[10px] font-bold text-zinc-500 mt-1">
                                {paymentSettings?.qris?.name || 'NMID: ID1024889920119'}
                            </p>
                        </div>

                        <p className="font-extrabold text-xl text-rose-600 tracking-tight">
                            {formatRupiah(finalTotal)}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">
                            {paymentSettings?.qris?.instructions ||
                                'Scan QRIS memakai BCA Mobile, GoPay, OVO, atau ShopeePay, lalu lampirkan bukti pembayaran di bawah ini.'}
                        </p>
                    </div>
                )}

                {paymentMethod === 'TRANSFER' && isTransferActive && (
                    <div className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
                        <span className="font-bold text-zinc-800 block mb-2">
                            Informasi Rekening Bank Toko:
                        </span>
                        <div className="space-y-2">
                            <div className="p-3 bg-white rounded-xl border border-zinc-200 flex justify-between items-center">
                                <div>
                                    <span className="font-bold text-zinc-900 block text-xs">
                                        Bank {paymentSettings?.transfer?.bank_name || 'BCA'}
                                    </span>
                                    <span className="font-mono text-zinc-800 font-bold text-sm">
                                        {paymentSettings?.transfer?.account_number || '5220304050'}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 block mt-0.5">
                                        a.n {paymentSettings?.transfer?.account_holder || 'CV Zahwa Strowbery'}
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={onCopyBank}
                                    className="h-8 px-2.5 rounded-xl text-xs font-semibold gap-1 shrink-0 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[14px]">
                                        {copiedBank ? 'done' : 'content_copy'}
                                    </span>
                                    <span>{copiedBank ? 'Tersalin' : 'Salin'}</span>
                                </Button>
                            </div>
                        </div>
                        {paymentSettings?.transfer?.instructions && (
                            <p className="text-[11px] text-zinc-500 mt-2">
                                {paymentSettings.transfer.instructions}
                            </p>
                        )}
                    </div>
                )}

                {paymentMethod === 'COD' && isCodActive && (
                    <div className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-rose-600 text-[18px]">info</span>
                            <span className="font-bold text-zinc-800">Petunjuk Pembayaran COD:</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 leading-relaxed">
                            {paymentSettings?.cod?.instructions ||
                                'Siapkan uang pas saat kurir tiba di alamat Anda. Pesanan akan diverifikasi oleh admin kami sebelum dikirim.'}
                        </p>
                    </div>
                )}

                {/* Payment Proof File Upload (For QRIS and Transfer) */}
                {paymentMethod !== 'COD' && (
                    <div className="mt-4 space-y-1.5">
                        <Label>Upload Foto Bukti Transfer / QRIS (Opsional / Dianjurkan)</Label>
                        <label className="block cursor-pointer">
                            <div className="bg-[#f6f2f7] hover:bg-[#eae7eb] border-2 border-dashed border-zinc-300 hover:border-rose-500 rounded-2xl p-4 flex flex-col items-center justify-center transition-all">
                                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-2 shadow-2xs">
                                    <span className="material-symbols-outlined text-[20px]">
                                        {previewUrl ? 'check_circle' : 'photo_camera'}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-zinc-800">
                                    {paymentProofFile
                                        ? `✓ ${paymentProofFile.name}`
                                        : 'Klik untuk upload bukti pembayaran'}
                                </span>
                                <span className="text-[10px] text-zinc-500 mt-0.5">
                                    Format JPG, PNG, WEBP (Maks 5MB)
                                </span>
                            </div>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={onFileChange}
                                className="sr-only"
                            />
                        </label>
                        {previewUrl && (
                            <div className="mt-2 text-center">
                                <img
                                    src={previewUrl}
                                    alt="Preview Bukti"
                                    className="h-28 mx-auto rounded-xl border border-zinc-200 object-contain"
                                />
                            </div>
                        )}
                        {errorProof && (
                            <span className="text-rose-600 text-[11px] font-medium">{errorProof}</span>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
