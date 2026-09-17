import React, { useState, useRef, useEffect } from 'react';
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
import { useToast } from '@/components/ui/toast';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const { success, error: toastError } = useToast();

    const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        avatar: null as File | null,
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (user) {
            setData((prev) => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                avatar: null,
                current_password: '',
                password: '',
                password_confirmation: '',
            }));
            const avatarUrl = user.avatar
                ? user.avatar.startsWith('http')
                    ? user.avatar
                    : `/storage/${user.avatar}`
                : null;
            setAvatarPreview(avatarUrl);
        }
    }, [user, isOpen]);

    if (!user) return null;

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
                setAvatarPreview(uploadEvent.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/profile', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                success('Profil berhasil diperbarui dan disimpan!');
                reset('current_password', 'password', 'password_confirmation');
            },
            onError: () => {
                toastError('Gagal memperbarui profil. Periksa data yang Anda masukkan.');
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md w-[92vw] sm:w-full p-5 sm:p-6 rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar">
                <DialogHeader className="items-center text-center space-y-1 pb-1">
                    <DialogTitle className="text-lg font-extrabold text-[#1b1b1e] tracking-tight">
                        Profil Pengguna
                    </DialogTitle>
                    <DialogDescription className="text-xs text-zinc-500">
                        Ubah data dan langsung simpan ke akun Anda
                    </DialogDescription>
                </DialogHeader>

                {/* Avatar & Quick Identity Header */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-rose-50/70 via-white to-amber-50/50 border border-rose-100 flex items-center gap-3.5">
                    <div className="relative group shrink-0">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-[#b80035] text-white flex items-center justify-center font-black text-xl">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{user.name.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#b80035] text-white flex items-center justify-center shadow-md hover:bg-[#9e002d] transition-transform active:scale-90 cursor-pointer"
                            title="Ganti Foto"
                        >
                            <span className="material-symbols-outlined text-[13px]">photo_camera</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-extrabold text-zinc-900 truncate">
                                {user.name}
                            </h3>
                            {user.role === 'admin' ? (
                                <Badge className="bg-amber-600 hover:bg-amber-600 text-[9px] font-extrabold px-1.5 py-0">
                                    Admin
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0">
                                    Pelanggan
                                </Badge>
                            )}
                        </div>
                        <span className="text-[11px] text-zinc-500 truncate block mt-0.5">
                            {user.email}
                        </span>
                        {user.phone && (
                            <span className="text-[10px] text-zinc-400 block">
                                {user.phone}
                            </span>
                        )}
                    </div>
                </div>

                {/* Admin Shortcut Banner */}
                {user.role === 'admin' && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-200/60 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-amber-700 text-[16px]">
                                admin_panel_settings
                            </span>
                            <span className="text-[11px] font-bold text-amber-900">
                                Backoffice Toko
                            </span>
                        </div>
                        <Button
                            asChild
                            size="sm"
                            className="h-6 text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-2xs"
                        >
                            <Link href="/admin/dashboard" onClick={onClose}>
                                Dashboard
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Tab Switcher */}
                <div className="w-full bg-[#eae7eb] p-1 rounded-2xl flex items-center shadow-inner">
                    <button
                        type="button"
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeTab === 'info'
                                ? 'bg-white text-[#b80035] shadow-xs'
                                : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[15px]">person</span>
                        <span>Info Kontak</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('security')}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeTab === 'security'
                                ? 'bg-white text-[#b80035] shadow-xs'
                                : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[15px]">lock</span>
                        <span>Keamanan</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                    {activeTab === 'info' ? (
                        <>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="modal_name" className="text-xs font-bold">Nama Lengkap</Label>
                                <Input
                                    id="modal_name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama Lengkap"
                                    required
                                    className="h-9 text-xs rounded-xl"
                                />
                                {errors.name && (
                                    <span className="text-rose-600 text-[10px] font-medium">{errors.name}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="modal_email" className="text-xs font-bold">Alamat Email</Label>
                                <Input
                                    id="modal_email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="alamat@email.com"
                                    required
                                    className="h-9 text-xs rounded-xl"
                                />
                                {errors.email && (
                                    <span className="text-rose-600 text-[10px] font-medium">{errors.email}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="modal_phone" className="text-xs font-bold">No. WhatsApp / HP</Label>
                                    <span className="text-[10px] text-zinc-400">Untuk koordinasi kurir</span>
                                </div>
                                <Input
                                    id="modal_phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="081234567890"
                                    className="h-9 text-xs rounded-xl"
                                />
                                {errors.phone && (
                                    <span className="text-rose-600 text-[10px] font-medium">{errors.phone}</span>
                                )}
                            </div>

                            {errors.avatar && (
                                <span className="text-rose-600 text-[10px] font-medium">{errors.avatar}</span>
                            )}
                        </>
                    ) : (
                        <>
                            {user.google_id && (
                                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px] text-blue-600">verified</span>
                                    <span className="text-[11px] font-medium text-blue-900">
                                        Akun terhubung dengan Google
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="modal_cur_pwd" className="text-xs font-bold">Kata Sandi Saat Ini</Label>
                                <Input
                                    id="modal_cur_pwd"
                                    type="password"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    placeholder="Masukkan sandi saat ini"
                                    className="h-9 text-xs rounded-xl"
                                />
                                {errors.current_password && (
                                    <span className="text-rose-600 text-[10px] font-medium">{errors.current_password}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="modal_new_pwd" className="text-xs font-bold">Kata Sandi Baru</Label>
                                <Input
                                    id="modal_new_pwd"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className="h-9 text-xs rounded-xl"
                                />
                                {errors.password && (
                                    <span className="text-rose-600 text-[10px] font-medium">{errors.password}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="modal_conf_pwd" className="text-xs font-bold">Konfirmasi Sandi Baru</Label>
                                <Input
                                    id="modal_conf_pwd"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi sandi baru"
                                    className="h-9 text-xs rounded-xl"
                                />
                                {errors.password_confirmation && (
                                    <span className="text-rose-600 text-[10px] font-medium">{errors.password_confirmation}</span>
                                )}
                            </div>
                        </>
                    )}

                    {recentlySuccessful && (
                        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                            <span>Perubahan berhasil disimpan!</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#b80035] hover:bg-[#9e002d] text-white h-10 text-xs font-bold gap-1.5 rounded-xl shadow-xs mt-1 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[15px]">save</span>
                        <span>{processing ? 'Menyimpan...' : 'Langsung Simpan & Perbarui'}</span>
                    </Button>
                </form>

                {/* Footer Controls: Logout & Close */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        onClick={onClose}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[15px]">logout</span>
                        <span>Keluar Akun</span>
                    </Link>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="h-8 text-xs rounded-xl font-bold"
                    >
                        Tutup
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
