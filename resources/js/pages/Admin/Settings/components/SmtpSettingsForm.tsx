import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SmtpSettings } from '../types';

interface Props {
    smtp: SmtpSettings;
    showSmtpPassword: boolean;
    testEmail: string;
    isTesting: boolean;
    processing: boolean;
    onUpdateField: (field: keyof SmtpSettings, value: any) => void;
    onToggleShowPassword: () => void;
    onToggle: (key: string, group: string, currentValue: boolean) => void;
    onTestEmailChange: (value: string) => void;
    onTestSmtp: (e: React.FormEvent) => void;
    onSave: () => void;
}

export default function SmtpSettingsForm({
    smtp,
    showSmtpPassword,
    testEmail,
    isTesting,
    processing,
    onUpdateField,
    onToggleShowPassword,
    onToggle,
    onTestEmailChange,
    onTestSmtp,
    onSave,
}: Props) {
    return (
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">mail</span>
                    </div>
                    <div>
                        <h2 className="text-xs font-bold text-zinc-900">Email Gateway (SMTP)</h2>
                        <p className="text-[10px] text-zinc-400">Kirim email bukti pembayaran & struk pesanan</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => onToggle('smtp_is_active', 'smtp', smtp.smtp_is_active)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all flex items-center gap-1.5 ${
                        smtp.smtp_is_active
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                    }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            smtp.smtp_is_active ? 'bg-emerald-600' : 'bg-zinc-400'
                        }`}
                    />
                    <span>{smtp.smtp_is_active ? 'Aktif' : 'Non-aktif'}</span>
                </button>
            </div>

            <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">SMTP Host</Label>
                        <Input
                            value={smtp.smtp_host}
                            onChange={(e) => onUpdateField('smtp_host', e.target.value)}
                            placeholder="cth: smtp.gmail.com / mail.domain.com"
                            className="h-8.5 text-xs rounded-xl"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-[11px] font-semibold text-zinc-700">Port</Label>
                            <Input
                                value={smtp.smtp_port}
                                onChange={(e) => onUpdateField('smtp_port', e.target.value)}
                                placeholder="587 / 465"
                                className="h-8.5 text-xs rounded-xl"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[11px] font-semibold text-zinc-700">Enkripsi</Label>
                            <Select
                                value={smtp.smtp_encryption || 'tls'}
                                onValueChange={(val) => onUpdateField('smtp_encryption', val)}
                            >
                                <SelectTrigger className="h-8.5 text-xs rounded-xl">
                                    <SelectValue placeholder="Enkripsi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tls">TLS</SelectItem>
                                    <SelectItem value="ssl">SSL</SelectItem>
                                    <SelectItem value="null">None</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">Username / Email Pengirim</Label>
                        <Input
                            value={smtp.smtp_username}
                            onChange={(e) => onUpdateField('smtp_username', e.target.value)}
                            placeholder="nama@domain.com"
                            className="h-8.5 text-xs rounded-xl"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">Password / App Password</Label>
                        <div className="relative flex items-center">
                            <Input
                                type={showSmtpPassword ? 'text' : 'password'}
                                value={smtp.smtp_password}
                                onChange={(e) => onUpdateField('smtp_password', e.target.value)}
                                placeholder="Kata sandi aplikasi SMTP"
                                className="h-8.5 text-xs rounded-xl pr-9"
                            />
                            <button
                                type="button"
                                onClick={onToggleShowPassword}
                                className="absolute right-2.5 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    {showSmtpPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">From Name</Label>
                        <Input
                            value={smtp.smtp_from_name}
                            onChange={(e) => onUpdateField('smtp_from_name', e.target.value)}
                            placeholder="Zahwa Strowbery"
                            className="h-8.5 text-xs rounded-xl"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">Email Admin Penerima Notifikasi</Label>
                        <Input
                            value={smtp.smtp_admin_email}
                            onChange={(e) => onUpdateField('smtp_admin_email', e.target.value)}
                            placeholder="admin@domain.com"
                            className="h-8.5 text-xs rounded-xl"
                        />
                    </div>
                </div>
            </div>

            {/* Test Email Box */}
            <form
                onSubmit={onTestSmtp}
                className="mt-2 p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2"
            >
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-blue-600 text-[18px]">send</span>
                    <span className="text-[11px] font-bold text-blue-900 shrink-0">Tes Kirim:</span>
                    <Input
                        type="email"
                        value={testEmail}
                        onChange={(e) => onTestEmailChange(e.target.value)}
                        placeholder="Ketik email penerima..."
                        className="h-7 text-xs bg-white rounded-lg border-blue-200 flex-1 min-w-[140px]"
                        required
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isTesting}
                    size="sm"
                    className="h-7 text-[11px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shrink-0"
                >
                    {isTesting ? 'Mengirim...' : 'Kirim Uji Coba'}
                </Button>
            </form>

            <div className="flex justify-end pt-1">
                <Button
                    type="button"
                    onClick={onSave}
                    disabled={processing}
                    className="bg-[#b80035] hover:bg-[#9e002d] text-white text-xs font-bold h-9 px-4 rounded-xl shadow-xs gap-1.5"
                >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Simpan Pengaturan SMTP</span>
                </Button>
            </div>
        </div>
    );
}
