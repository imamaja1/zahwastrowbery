import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TelegramSettings } from '../types';

interface Props {
    telegram: TelegramSettings;
    showTelegramToken: boolean;
    isTesting: boolean;
    processing: boolean;
    onUpdateField: (field: keyof TelegramSettings, value: any) => void;
    onToggleShowToken: () => void;
    onToggle: (key: string, group: string, currentValue: boolean) => void;
    onTestTelegram: () => void;
    onSave: () => void;
}

export default function TelegramSettingsForm({
    telegram,
    showTelegramToken,
    isTesting,
    processing,
    onUpdateField,
    onToggleShowToken,
    onToggle,
    onTestTelegram,
    onSave,
}: Props) {
    return (
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">send</span>
                    </div>
                    <div>
                        <h2 className="text-xs font-bold text-zinc-900">Telegram Bot Alert</h2>
                        <p className="text-[10px] text-zinc-400">Terima notifikasi order & peringatan stok menipis via bot Telegram</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => onToggle('telegram_is_active', 'telegram', telegram.telegram_is_active)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all flex items-center gap-1.5 ${
                        telegram.telegram_is_active
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                    }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            telegram.telegram_is_active ? 'bg-emerald-600' : 'bg-zinc-400'
                        }`}
                    />
                    <span>{telegram.telegram_is_active ? 'Aktif' : 'Non-aktif'}</span>
                </button>
            </div>

            <div className="space-y-2.5">
                <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-zinc-700">Telegram Bot Token</Label>
                    <div className="relative flex items-center">
                        <Input
                            type={showTelegramToken ? 'text' : 'password'}
                            value={telegram.telegram_bot_token}
                            onChange={(e) => onUpdateField('telegram_bot_token', e.target.value)}
                            placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                            className="h-8.5 text-xs rounded-xl pr-9"
                        />
                        <button
                            type="button"
                            onClick={onToggleShowToken}
                            className="absolute right-2.5 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">
                                {showTelegramToken ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                    <p className="text-[10px] text-zinc-400">Dibuat via @BotFather di Telegram.</p>
                </div>

                <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-zinc-700">Telegram Chat ID / Channel ID</Label>
                    <Input
                        value={telegram.telegram_chat_id}
                        onChange={(e) => onUpdateField('telegram_chat_id', e.target.value)}
                        placeholder="cth: 123456789 atau -100123456789"
                        className="h-8.5 text-xs rounded-xl"
                    />
                    <p className="text-[10px] text-zinc-400">ID akun personal Anda atau ID Group/Channel toko.</p>
                </div>

                <div className="pt-2 border-t border-zinc-100 space-y-2">
                    <Label className="text-[11px] font-bold text-zinc-800 block">Kirim Notifikasi Otomatis Saat:</Label>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="telegram_notify_new_order"
                            checked={telegram.telegram_notify_new_order}
                            onCheckedChange={(checked) =>
                                onUpdateField('telegram_notify_new_order', Boolean(checked))
                            }
                        />
                        <Label
                            htmlFor="telegram_notify_new_order"
                            className="text-xs font-normal text-zinc-700 cursor-pointer"
                        >
                            Ada pesanan checkout baru dari pelanggan
                        </Label>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="telegram_notify_payment_uploaded"
                            checked={telegram.telegram_notify_payment_uploaded}
                            onCheckedChange={(checked) =>
                                onUpdateField('telegram_notify_payment_uploaded', Boolean(checked))
                            }
                        />
                        <Label
                            htmlFor="telegram_notify_payment_uploaded"
                            className="text-xs font-normal text-zinc-700 cursor-pointer"
                        >
                            Pelanggan mengunggah bukti transfer
                        </Label>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="telegram_notify_low_stock"
                            checked={telegram.telegram_notify_low_stock}
                            onCheckedChange={(checked) =>
                                onUpdateField('telegram_notify_low_stock', Boolean(checked))
                            }
                        />
                        <Label
                            htmlFor="telegram_notify_low_stock"
                            className="text-xs font-normal text-zinc-700 cursor-pointer"
                        >
                            Stok varian produk tersisa sedikit (menipis)
                        </Label>
                    </div>
                </div>
            </div>

            {/* Test Telegram Box */}
            <div className="mt-2 p-2.5 bg-sky-50/70 border border-sky-200/80 rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-sky-600 text-[18px]">send</span>
                    <span className="text-[11px] font-bold text-sky-900">Uji Coba Bot Telegram:</span>
                </div>
                <Button
                    type="button"
                    onClick={onTestTelegram}
                    disabled={isTesting}
                    size="sm"
                    className="h-7 text-[11px] bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold shrink-0"
                >
                    {isTesting ? 'Mengirim...' : 'Kirim Pesan Tes'}
                </Button>
            </div>

            <div className="flex justify-end pt-1">
                <Button
                    type="button"
                    onClick={onSave}
                    disabled={processing}
                    className="bg-[#b80035] hover:bg-[#9e002d] text-white text-xs font-bold h-9 px-4 rounded-xl shadow-xs gap-1.5"
                >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Simpan Pengaturan Telegram</span>
                </Button>
            </div>
        </div>
    );
}
