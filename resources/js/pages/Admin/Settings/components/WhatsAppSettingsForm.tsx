import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { WhatsAppSettings } from '../types';

interface Props {
    whatsapp: WhatsAppSettings;
    showWhatsappApiKey: boolean;
    testWhatsappPhone: string;
    isTesting: boolean;
    processing: boolean;
    waStatus?: {
        state: string;
        isReady: boolean;
        phoneNumber: string | null;
        lastError: string | null;
    } | null;
    waQrCode?: string | null;
    isCheckingWa?: boolean;
    isLoggingOutWa?: boolean;
    onUpdateField: (field: keyof WhatsAppSettings, value: any) => void;
    onToggleShowApiKey: () => void;
    onToggle: (key: string, group: string, currentValue: boolean) => void;
    onTestPhoneChange: (value: string) => void;
    onTestWhatsapp: (e: React.FormEvent) => void;
    onCheckStatus?: () => void;
    onGetQr?: () => void;
    onLogoutWa?: () => void;
    onSave: () => void;
}

export default function WhatsAppSettingsForm({
    whatsapp,
    showWhatsappApiKey,
    testWhatsappPhone,
    isTesting,
    processing,
    waStatus,
    waQrCode,
    isCheckingWa = false,
    isLoggingOutWa = false,
    onUpdateField,
    onToggleShowApiKey,
    onToggle,
    onTestPhoneChange,
    onTestWhatsapp,
    onCheckStatus,
    onGetQr,
    onLogoutWa,
    onSave,
}: Props) {
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    const handleOpenQr = () => {
        if (onGetQr) {
            onGetQr();
        }
        setIsQrModalOpen(true);
    };

    const isReady = waStatus?.isReady || waStatus?.state === 'ready';
    const isAwaitingScan = waStatus?.state === 'awaiting_scan';
    const isLoggedOut = waStatus?.state === 'logged_out';

    return (
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 shadow-2xs flex flex-col gap-3">
            {/* Header Form */}
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xs font-bold text-zinc-900">WhatsApp Gateway</h2>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                                otomasi.punyaku.online
                            </span>
                        </div>
                        <p className="text-[10px] text-zinc-400">
                            Kirim notifikasi otomatis pesanan toko ke WhatsApp pelanggan & admin
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => onToggle('whatsapp_is_active', 'whatsapp', whatsapp.whatsapp_is_active)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all flex items-center gap-1.5 ${
                        whatsapp.whatsapp_is_active
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                    }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            whatsapp.whatsapp_is_active ? 'bg-emerald-600' : 'bg-zinc-400'
                        }`}
                    />
                    <span>{whatsapp.whatsapp_is_active ? 'Aktif' : 'Non-aktif'}</span>
                </button>
            </div>

            {/* KARTU STATUS PERANGKAT */}
            <div
                className={`rounded-xl p-3 border flex flex-col gap-2.5 transition-all ${
                    isReady
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : isAwaitingScan
                        ? 'bg-amber-50/80 border-amber-200'
                        : isLoggedOut
                        ? 'bg-rose-50/70 border-rose-200'
                        : 'bg-zinc-50/80 border-zinc-200'
                }`}
            >
                {/* Baris 1: Status & Nomor Terhubung */}
                <div className="flex items-center justify-between gap-2.5 flex-wrap">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isReady
                                    ? 'bg-emerald-600 text-white'
                                    : isAwaitingScan
                                    ? 'bg-amber-500 text-white'
                                    : isLoggedOut
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-zinc-300 text-zinc-700'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                {isReady
                                    ? 'check_circle'
                                    : isAwaitingScan
                                    ? 'qr_code_scanner'
                                    : isLoggedOut
                                    ? 'power_settings_new'
                                    : 'phonelink_ring'}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block leading-none">
                                Status Koneksi Bot
                            </span>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {isReady && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 whitespace-nowrap">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                        Ready (Siap Kirim)
                                    </span>
                                )}
                                {isAwaitingScan && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-950 border border-amber-300 whitespace-nowrap">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                                        Perlu Scan QR Code
                                    </span>
                                )}
                                {isLoggedOut && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300 whitespace-nowrap">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                                        Logged Out
                                    </span>
                                )}
                                {!waStatus && (
                                    <span className="text-[11px] text-zinc-600 font-medium">
                                        Belum diperiksa (klik Cek Status)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        {waStatus?.phoneNumber && (
                            <div className="bg-white px-2.5 py-1 rounded-lg border border-zinc-200 text-xs text-zinc-800 flex items-center gap-1.5 shadow-2xs">
                                <span className="material-symbols-outlined text-[15px] text-emerald-600">smartphone</span>
                                <span className="text-zinc-500 text-[11px]">Nomor Bot:</span>
                                <strong className="font-mono text-xs text-zinc-950">+{waStatus.phoneNumber}</strong>
                            </div>
                        )}

                        {isReady && onLogoutWa && (
                            <Button
                                type="button"
                                onClick={onLogoutWa}
                                disabled={isLoggingOutWa}
                                variant="outline"
                                size="sm"
                                className="h-7.5 px-2.5 text-[11px] font-bold text-rose-600 bg-white hover:bg-rose-50 hover:text-rose-700 border-rose-200 rounded-lg cursor-pointer shadow-2xs gap-1"
                            >
                                <span className="material-symbols-outlined text-[15px]">logout</span>
                                <span>{isLoggingOutWa ? 'Keluar...' : 'Logout Bot'}</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Baris 2: Tombol Aksi */}
                <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    <Button
                        type="button"
                        onClick={handleOpenQr}
                        disabled={isCheckingWa}
                        size="sm"
                        className={`h-7.5 px-3 text-[11px] font-bold rounded-lg shadow-2xs gap-1.5 cursor-pointer ${
                            isAwaitingScan
                                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[15px]">qr_code_scanner</span>
                        <span>{isReady ? 'Lihat QR Code' : 'Scan QR Sekarang'}</span>
                    </Button>

                    {onCheckStatus && (
                        <Button
                            type="button"
                            onClick={onCheckStatus}
                            disabled={isCheckingWa}
                            variant="outline"
                            size="sm"
                            className="h-7.5 px-3 text-[11px] font-bold bg-white hover:bg-zinc-50 border-zinc-300 text-zinc-800 rounded-lg shadow-2xs gap-1.5 cursor-pointer"
                        >
                            <span className={`material-symbols-outlined text-[15px] ${isCheckingWa ? 'animate-spin text-emerald-600' : 'text-zinc-600'}`}>
                                sync
                            </span>
                            <span>{isCheckingWa ? 'Memeriksa...' : 'Cek Status'}</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* MODAL DIALOG SCAN QR CODE */}
            <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
                <DialogContent className="max-w-md w-[94vw] p-5 sm:p-6 rounded-3xl text-center bg-white shadow-2xl">
                    <DialogHeader className="items-center text-center space-y-1.5 pb-2">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                            <span className="material-symbols-outlined text-2xl">qr_code_2</span>
                        </div>
                        <DialogTitle className="text-base font-black text-zinc-900">
                            Tautkan WhatsApp ke Toko
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">
                            Scan kode QR ini menggunakan aplikasi WhatsApp di smartphone Anda
                        </DialogDescription>
                    </DialogHeader>

                    {/* Langkah-langkah Scan */}
                    <div className="bg-zinc-50 rounded-2xl p-3 text-left border border-zinc-200 text-xs text-zinc-700 space-y-1.5 my-2">
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                            <span>Buka aplikasi <strong>WhatsApp</strong> di smartphone Anda</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                            <span>Ketuk menu titik tiga &rarr; pilih <strong>Perangkat Tertaut</strong> &rarr; <strong>Tautkan Perangkat</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                            <span>Arahkan kamera HP ke QR Code di bawah:</span>
                        </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="flex flex-col items-center justify-center my-3 p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-300 shadow-inner">
                        {waQrCode ? (
                            <img
                                src={waQrCode}
                                alt="WhatsApp QR Code"
                                className="w-64 h-64 object-contain rounded-xl bg-white p-2 shadow-sm animate-in fade-in zoom-in-95 duration-200"
                            />
                        ) : (
                            <div className="w-64 h-64 flex flex-col items-center justify-center text-zinc-400 gap-3">
                                <span className="material-symbols-outlined text-4xl animate-spin text-emerald-600">progress_activity</span>
                                <span className="text-xs font-semibold">Sedang memuat QR Code dari gateway...</span>
                            </div>
                        )}
                        <p className="text-[11px] text-zinc-500 mt-2 font-medium">
                            Kode QR aktif selama ±60 detik. Jika kedaluwarsa, klik tombol Muat Ulang.
                        </p>
                    </div>

                    {/* Aksi Tombol Modal */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                        <Button
                            type="button"
                            onClick={() => onGetQr && onGetQr()}
                            disabled={isCheckingWa}
                            variant="outline"
                            className="flex-1 h-10 text-xs font-bold rounded-xl border-zinc-300 gap-1.5 cursor-pointer"
                        >
                            <span className={`material-symbols-outlined text-[16px] ${isCheckingWa ? 'animate-spin' : ''}`}>
                                refresh
                            </span>
                            <span>Muat Ulang QR</span>
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                setIsQrModalOpen(false);
                                if (onCheckStatus) onCheckStatus();
                            }}
                            className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs gap-1.5 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span>Saya Sudah Scan</span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* FORM PENGATURAN */}
            <div className="space-y-2.5">
                {/* Gateway Endpoint & API Key */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">Base URL Gateway</Label>
                        <Input
                            value={whatsapp.whatsapp_base_url || 'https://otomasi.punyaku.online'}
                            onChange={(e) => onUpdateField('whatsapp_base_url', e.target.value)}
                            placeholder="https://otomasi.punyaku.online"
                            className="h-8.5 text-xs rounded-xl font-mono bg-zinc-50/70 border-zinc-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">API Key (x-api-key)</Label>
                        <div className="relative flex items-center">
                            <Input
                                type={showWhatsappApiKey ? 'text' : 'password'}
                                value={whatsapp.whatsapp_api_key}
                                onChange={(e) => onUpdateField('whatsapp_api_key', e.target.value)}
                                placeholder="ak_xxx"
                                className="h-8.5 text-xs rounded-xl pr-9 font-mono"
                            />
                            <button
                                type="button"
                                onClick={onToggleShowApiKey}
                                className="absolute right-2.5 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    {showWhatsappApiKey ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Input Penerima (Admin Toko) */}
                <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-emerald-600">inbox</span>
                        <span>Nomor WhatsApp Penerima (Admin Toko)</span>
                    </Label>
                    <Input
                        value={whatsapp.whatsapp_admin_number}
                        onChange={(e) => onUpdateField('whatsapp_admin_number', e.target.value)}
                        placeholder="cth: 6281234567890 atau 081234567890"
                        className="h-8.5 text-xs rounded-xl"
                    />
                    <p className="text-[10px] text-zinc-400">
                        Nomor WhatsApp Admin yang akan menerima notifikasi setiap ada pesanan baru masuk dari pelanggan.
                    </p>
                </div>

                {/* Checkbox Trigger Notifikasi */}
                <div className="flex flex-wrap gap-4 p-2.5 bg-zinc-50/80 rounded-xl border border-zinc-200">
                    <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer select-none font-medium">
                        <input
                            type="checkbox"
                            checked={whatsapp.whatsapp_notify_customer}
                            onChange={(e) => onUpdateField('whatsapp_notify_customer', e.target.checked)}
                            className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span>Kirim notifikasi ke <strong>Pelanggan</strong> saat checkout</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer select-none font-medium">
                        <input
                            type="checkbox"
                            checked={whatsapp.whatsapp_notify_admin}
                            onChange={(e) => onUpdateField('whatsapp_notify_admin', e.target.checked)}
                            className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span>Kirim notifikasi ke <strong>Admin Toko (Penerima)</strong></span>
                    </label>
                </div>

                {/* Template Pesan */}
                <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-zinc-700">
                        Template Notifikasi Pesanan Baru (WhatsApp)
                    </Label>
                    <textarea
                        rows={3}
                        value={whatsapp.whatsapp_order_template}
                        onChange={(e) => onUpdateField('whatsapp_order_template', e.target.value)}
                        placeholder="Halo {customer_name}, pesanan #{invoice_number} total {total_amount} telah kami terima..."
                        className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 focus:outline-rose-500 focus:border-rose-500 bg-transparent leading-relaxed"
                    />
                    <p className="text-[10px] text-zinc-400">
                        Variabel tag: <code>{'{customer_name}'}</code>, <code>{'{invoice_number}'}</code>, <code>{'{total_amount}'}</code>, <code>{'{items}'}</code>
                    </p>
                </div>
            </div>

            {/* Test WhatsApp Box (Tata Letak Sejajar & Rapi) */}
            <form
                onSubmit={onTestWhatsapp}
                className="mt-2 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2"
            >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">send</span>
                    <span className="text-[11px] font-bold text-emerald-950 shrink-0">Tes Kirim WA:</span>
                    <Input
                        type="text"
                        value={testWhatsappPhone}
                        onChange={(e) => onTestPhoneChange(e.target.value)}
                        placeholder="Ketik nomor tujuan (08xxx / 628xxx)..."
                        className="h-7.5 text-xs bg-white rounded-lg border-emerald-200 flex-1 min-w-[140px]"
                        required
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isTesting}
                    size="sm"
                    className="h-7.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shrink-0 cursor-pointer shadow-2xs"
                >
                    {isTesting ? 'Mengirim...' : 'Kirim Uji Coba'}
                </Button>
            </form>

            {/* Tombol Simpan */}
            <div className="flex justify-end pt-1">
                <Button
                    type="button"
                    onClick={onSave}
                    disabled={processing}
                    className="bg-[#b80035] hover:bg-[#9e002d] text-white text-xs font-bold h-9 px-4 rounded-xl shadow-xs gap-1.5 cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Simpan Pengaturan WhatsApp</span>
                </Button>
            </div>
        </div>
    );
}
