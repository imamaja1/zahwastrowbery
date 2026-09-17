import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleSettings } from '../types';

interface Props {
    google: GoogleSettings;
    showGoogleSecret: boolean;
    processing: boolean;
    onUpdateField: (field: keyof GoogleSettings, value: any) => void;
    onToggleShowSecret: () => void;
    onToggle: (key: string, group: string, currentValue: boolean) => void;
    onCopyRedirectUri: () => void;
    onSave: () => void;
}

export default function GoogleSettingsSection({
    google,
    showGoogleSecret,
    processing,
    onUpdateField,
    onToggleShowSecret,
    onToggle,
    onCopyRedirectUri,
    onSave,
}: Props) {
    return (
        <div className="flex flex-col gap-3">
            {/* Header / Info card */}
            <div className="bg-blue-50/70 border border-blue-200/80 p-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            fill="#EA4335"
                        />
                    </svg>
                    <div>
                        <h3 className="text-xs font-bold text-blue-950">Integrasi Google OAuth</h3>
                        <p className="text-[10px] text-blue-800">
                            Memungkinkan pelanggan dan admin masuk menggunakan akun Google
                        </p>
                    </div>
                </div>
            </div>

            {/* Google OAuth Form */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 shadow-2xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                    <div>
                        <h2 className="text-xs font-bold text-zinc-900">Kredensial Google Cloud Console</h2>
                        <p className="text-[10px] text-zinc-400">Diperoleh dari menu APIs & Services &gt; Credentials</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => onToggle('google_auth_is_active', 'google', google.google_auth_is_active)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all flex items-center gap-1.5 ${
                            google.google_auth_is_active
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${
                                google.google_auth_is_active ? 'bg-emerald-600' : 'bg-zinc-400'
                            }`}
                        />
                        <span>{google.google_auth_is_active ? 'Aktif' : 'Non-aktif'}</span>
                    </button>
                </div>

                <div className="space-y-2.5">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">Client ID Google</Label>
                        <Input
                            value={google.google_client_id}
                            onChange={(e) => onUpdateField('google_client_id', e.target.value)}
                            placeholder="xxxx.apps.googleusercontent.com"
                            className="h-8.5 text-xs rounded-xl"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">Client Secret Google</Label>
                        <div className="relative flex items-center">
                            <Input
                                type={showGoogleSecret ? 'text' : 'password'}
                                value={google.google_client_secret}
                                onChange={(e) => onUpdateField('google_client_secret', e.target.value)}
                                placeholder="GOCSPX-xxxxxx"
                                className="h-8.5 text-xs rounded-xl pr-9"
                            />
                            <button
                                type="button"
                                onClick={onToggleShowSecret}
                                className="absolute right-2.5 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    {showGoogleSecret ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-zinc-700">Authorized Redirect URI</Label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={google.google_redirect_uri}
                                className="h-8.5 text-xs rounded-xl bg-zinc-50 text-zinc-500 select-all"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCopyRedirectUri}
                                className="h-8.5 text-xs px-2.5 rounded-xl border-zinc-200 shrink-0 gap-1 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                <span>Salin</span>
                            </Button>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-tight">
                            Wajib didaftarkan pada kolom Authorized redirect URIs di Google Cloud Console.
                        </p>
                    </div>
                </div>
            </div>

            {/* Checklist Panduan Google Console */}
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-blue-600">help</span>
                    Langkah Aktivasi Login Google
                </span>
                <ol className="text-[10px] text-slate-600 space-y-1 list-decimal list-inside leading-relaxed">
                    <li>
                        Buka{' '}
                        <a
                            href="https://console.cloud.google.com/apis/credentials"
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline font-semibold"
                        >
                            Google Cloud Console
                        </a>{' '}
                        dan buat OAuth 2.0 Client ID baru (Web Application).
                    </li>
                    <li>Tambahkan domain website Anda ke Authorized JavaScript origins.</li>
                    <li>Salin URL Authorized Redirect URI di atas dan tempelkan ke Google Console.</li>
                    <li>Salin Client ID dan Client Secret ke form pengaturan ini lalu klik Simpan.</li>
                </ol>
            </div>

            {/* Save Button for Google Section */}
            <div className="flex justify-end pt-1">
                <Button
                    type="button"
                    onClick={onSave}
                    disabled={processing}
                    className="bg-[#b80035] hover:bg-[#9e002d] text-white text-xs font-bold h-9 px-4 rounded-xl shadow-xs gap-1.5"
                >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Simpan Pengaturan Google</span>
                </Button>
            </div>
        </div>
    );
}
