import React, { useState } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialRole?: 'customer' | 'staff';
}

export default function AuthModal({ isOpen, onClose, initialRole = 'customer' }: AuthModalProps) {
    const { google_auth_enabled, demo_login_enabled } = usePage<{ google_auth_enabled?: boolean; demo_login_enabled?: boolean }>().props;
    const isGoogleEnabled = google_auth_enabled !== false;
    const isDemoEnabled = Boolean(demo_login_enabled);
    const [role, setRole] = useState<'customer' | 'staff'>(initialRole);
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        identifier: '',
        password: '',
        remember: true,
    });

    const handleRoleChange = (newRole: 'customer' | 'staff') => {
        setRole(newRole);
        if (isDemoEnabled) {
            if (newRole === 'customer') {
                setData((prev) => ({
                    ...prev,
                    identifier: 'pelanggan@buahsegar.id',
                    password: 'password',
                }));
            } else {
                setData((prev) => ({
                    ...prev,
                    identifier: 'admin@buahsegar.id',
                    password: 'password',
                }));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md w-[92vw] sm:w-full p-5 sm:p-6 rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar">
                <DialogHeader className="items-center text-center space-y-1.5 pb-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#b80035] to-[#e11d48] flex items-center justify-center text-white shadow-md mb-1">
                        <span className="material-symbols-outlined text-[28px]">nutrition</span>
                    </div>
                    <DialogTitle className="text-xl font-extrabold text-[#1b1b1e] tracking-tight">
                        Masuk ke ZahwaStrowbery
                    </DialogTitle>
                    <DialogDescription className="text-xs text-zinc-500">
                        Pesan buah segar langsung dari kebun dengan garansi manis 100%
                    </DialogDescription>
                </DialogHeader>

                {/* Role Switcher */}
                <div className="w-full bg-[#eae7eb] p-1 rounded-2xl flex items-center shadow-inner">
                    <button
                        type="button"
                        onClick={() => handleRoleChange('customer')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            role === 'customer'
                                ? 'bg-white text-[#b80035] shadow-xs'
                                : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                        <span>Pelanggan</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRoleChange('staff')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            role === 'staff'
                                ? 'bg-white text-[#b80035] shadow-xs'
                                : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[16px]">badge</span>
                        <span>Admin / Staff</span>
                    </button>
                </div>

                {/* 1-Click Fast Demo Login Buttons (Hanya muncul jika bukan production) */}
                {isDemoEnabled && (
                    <div className="p-2.5 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-rose-600 text-[18px]">bolt</span>
                            <div>
                                <span className="block text-[11px] font-extrabold text-zinc-800">1-Klik Demo</span>
                                <span className="text-[9px] text-zinc-500">Masuk instan tanpa ketik</span>
                            </div>
                        </div>
                        <div className="flex gap-1.5">
                            <Link
                                href="/login/demo/customer"
                                className="bg-white hover:bg-zinc-50 text-[#b80035] border border-rose-200 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-2xs transition-all active:scale-95"
                            >
                                Demo User
                            </Link>
                            <Link
                                href="/login/demo/admin"
                                className="bg-[#b80035] hover:bg-[#9e002d] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-2xs transition-all active:scale-95"
                            >
                                Demo Admin
                            </Link>
                        </div>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 pt-1">
                    {/* Identifier */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="modal_identifier" className="text-xs">
                                {role === 'customer' ? 'Email / No. WhatsApp' : 'Email Korporat / Staff ID'}
                            </Label>
                            <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0">
                                Cepat & Aman
                            </Badge>
                        </div>
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-zinc-400 text-[18px] pointer-events-none">
                                {role === 'customer' ? 'mail' : 'badge'}
                            </span>
                            <Input
                                id="modal_identifier"
                                type="text"
                                value={data.identifier}
                                onChange={(e) => setData('identifier', e.target.value)}
                                placeholder={
                                    role === 'customer'
                                        ? 'cth: pelanggan@buahsegar.id'
                                        : 'admin@buahsegar.id'
                                }
                                required
                                className="pl-9 h-10 text-xs rounded-xl"
                            />
                        </div>
                        {errors.identifier && (
                            <span className="text-rose-600 text-[10px] font-medium">{errors.identifier}</span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="modal_password" className="text-xs">Kata Sandi</Label>
                            {isDemoEnabled && (
                                <span className="text-[10px] text-zinc-400">Default: password</span>
                            )}
                        </div>
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-zinc-400 text-[18px] pointer-events-none">
                                lock
                            </span>
                            <Input
                                id="modal_password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Masukkan kata sandi"
                                required
                                className="pl-9 pr-10 h-10 text-xs rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-rose-600 text-[10px] font-medium">{errors.password}</span>
                        )}
                    </div>

                    {/* Remember me & Security */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="modal_remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', Boolean(checked))}
                            />
                            <Label htmlFor="modal_remember" className="text-xs text-zinc-600 font-normal cursor-pointer">
                                Ingat saya
                            </Label>
                        </div>
                        <span className="text-[10px] font-bold text-[#006c49] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">security</span>
                            256-Bit SSL
                        </span>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#b80035] hover:bg-[#9e002d] text-white h-11 text-xs font-bold gap-1.5 rounded-xl shadow-md cursor-pointer"
                    >
                        <span>{role === 'customer' ? 'Masuk Sekarang' : 'Masuk Konsol Staff'}</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Button>

                    {/* Google OAuth Button */}
                    {isGoogleEnabled && (
                        <>
                            {/* Divider */}
                            <div className="relative my-0.5">
                                <Separator />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-white px-2 text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                                        atau
                                    </span>
                                </div>
                            </div>

                            <a
                                href="/auth/google"
                                className="w-full bg-[#f6f2f7] hover:bg-[#eae7eb] text-zinc-800 h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 border border-zinc-200 transition-colors active:scale-[0.98]"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    ></path>
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    ></path>
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                        fill="#FBBC05"
                                    ></path>
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                        fill="#EA4335"
                                    ></path>
                                </svg>
                                <span>Lanjutkan dengan Google</span>
                            </a>
                        </>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
