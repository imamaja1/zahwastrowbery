import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';

interface ProfileData {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string | null;
    has_google: boolean;
    created_at: string;
}

interface Props {
    profile: ProfileData;
}

export default function Profile({ profile }: Props) {
    const { success, error: toastError } = useToast();
    const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
    const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

    const formatAvatarUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('/storage/')) {
            return url;
        }
        return `/storage/${url.replace(/^\/+/, '')}`;
    };

    // Profile form
    const {
        data,
        setData,
        post,
        processing,
        errors,
        recentlySuccessful,
        reset,
    } = useForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Avatar popup form
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar);
    const [isSavingAvatar, setIsSavingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setAvatarPreview(profile.avatar);
        setAvatarFile(null);
    }, [profile.avatar]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (Max 2MB = 2 * 1024 * 1024 bytes)
        const MAX_SIZE_BYTES = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE_BYTES) {
            const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
            toastError(
                `Ukuran foto (${sizeInMb}MB) melebihi batas maksimal 2MB. Silakan pilih foto dengan ukuran lebih kecil.`,
                'Ukuran Foto Terlalu Besar'
            );
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Check image format
        if (!file.type.match(/^image\/(jpeg|png|jpg|webp)$/i)) {
            toastError(
                'Format foto tidak didukung! Gunakan gambar berekstensi JPG, PNG, atau WEBP.',
                'Format File Salah'
            );
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            setAvatarPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveAvatar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!avatarFile) {
            toastError('Silakan pilih file foto terlebih dahulu.', 'Foto Belum Dipilih');
            return;
        }

        setIsSavingAvatar(true);

        router.post('/admin/profile', {
            avatar: avatarFile,
        }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSavingAvatar(false);
                setIsAvatarDialogOpen(false);
                setAvatarFile(null);
            },
            onError: (err) => {
                setIsSavingAvatar(false);
                const errMsg = err.avatar || Object.values(err)[0] || 'Gagal mengunggah foto profil.';
                toastError(errMsg, 'Gagal Unggah Foto');
            },
        });
    };

    const handleRemoveAvatar = () => {
        setIsSavingAvatar(true);
        router.post('/admin/profile', {
            remove_avatar: true,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSavingAvatar(false);
                setIsAvatarDialogOpen(false);
                setAvatarFile(null);
                setAvatarPreview(null);
            },
            onError: (err) => {
                setIsSavingAvatar(false);
                const errMsg = Object.values(err)[0] || 'Gagal menghapus foto profil.';
                toastError(errMsg, 'Gagal Hapus Foto');
            },
        });
    };

    const handleSubmitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/profile', {
            preserveScroll: true,
            onSuccess: () => {
                reset('current_password', 'password', 'password_confirmation');
            },
            onError: (errs) => {
                const firstErr = Object.values(errs)[0];
                toastError(firstErr || 'Gagal menyimpan profil. Silakan periksa data Anda.', 'Validasi Gagal');
            },
        });
    };

    return (
        <AdminLayout title="Profil Admin">
            <Head title="Profil Administrator - ZahwaStrowbery" />

            {/* POPUP MODAL UNTUK FOTO PROFIL */}
            <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                <DialogContent className="max-w-xs sm:max-w-sm w-[92vw] p-5 rounded-3xl text-center">
                    <DialogHeader className="items-center text-center space-y-1 pb-1">
                        <DialogTitle className="text-base font-extrabold text-[#1b1b1e]">
                            Ubah Foto Profil Admin
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">
                            Pilih gambar foto dari galeri atau perangkat Anda
                        </DialogDescription>
                    </DialogHeader>

                    {/* Preview Avatar Besar */}
                    <div className="flex flex-col items-center justify-center my-3">
                        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-rose-100 shadow-md bg-[#b80035] text-white flex items-center justify-center font-black text-3xl">
                            {formatAvatarUrl(avatarPreview) ? (
                                <img
                                    src={formatAvatarUrl(avatarPreview)!}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{profile.name.charAt(0).toUpperCase()}</span>
                            )}
                        </div>

                        {avatarFile && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 font-medium">
                                Foto baru dipilih ({Math.round(avatarFile.size / 1024)} KB)
                            </span>
                        )}
                    </div>

                    {/* Hidden input file */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Aksi Tombol di Popup */}
                    <div className="flex flex-col gap-2 pt-1">
                        <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="h-10 text-xs font-bold gap-2 rounded-xl border-zinc-300 hover:bg-rose-50 hover:text-[#b80035] hover:border-rose-200 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[18px]">photo_library</span>
                            <span>{avatarFile ? 'Pilih Foto Lain' : 'Pilih Foto dari Galeri'}</span>
                        </Button>

                        {avatarFile && (
                            <Button
                                type="button"
                                onClick={handleSaveAvatar}
                                disabled={isSavingAvatar}
                                className="h-10 bg-[#b80035] hover:bg-[#9e002d] text-white text-xs font-bold gap-1.5 rounded-xl shadow-xs cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                                <span>{isSavingAvatar ? 'Menyimpan...' : 'Simpan Foto Ini'}</span>
                            </Button>
                        )}

                        {profile.avatar && !avatarFile && (
                            <Button
                                type="button"
                                onClick={handleRemoveAvatar}
                                disabled={isSavingAvatar}
                                variant="ghost"
                                className="h-9 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                            >
                                <span className="material-symbols-outlined text-[15px] mr-1">delete</span>
                                <span>Hapus Foto Saat Ini</span>
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                setIsAvatarDialogOpen(false);
                                setAvatarFile(null);
                                setAvatarPreview(profile.avatar);
                            }}
                            className="h-8 text-xs text-zinc-500 rounded-xl"
                        >
                            Batal
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* HALAMAN PROFIL ADMIN */}
            <div className="flex flex-col w-full px-1 py-1 sm:py-2 gap-4 max-w-md mx-auto">
                {/* Header Back & Title */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/dashboard"
                            className="w-8 h-8 rounded-full bg-white border border-zinc-200/80 flex items-center justify-center text-zinc-700 hover:text-[#b80035] hover:border-rose-200 transition-colors shadow-2xs"
                            title="Kembali ke Dashboard"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="font-extrabold text-base sm:text-lg text-[#1b1b1e] leading-tight">Profil Administrator</h1>
                            <p className="text-[11px] text-zinc-500">Kelola akun & keamanan panel admin toko</p>
                        </div>
                    </div>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full border border-rose-200/60 transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[14px]">logout</span>
                        <span>Keluar</span>
                    </Link>
                </div>

                {/* Profile Avatar Card */}
                <Card className="rounded-3xl border-[#eae7eb] shadow-xs bg-gradient-to-br from-white via-[#fdfbfe] to-rose-50/30 overflow-hidden relative">
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                        {/* Avatar Image / Upload Trigger: Klik Membuka Popup Foto */}
                        <div className="relative group shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsAvatarDialogOpen(true)}
                                className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-[#b80035] text-white flex items-center justify-center font-black text-2xl group-hover:ring-2 group-hover:ring-rose-400 transition-all cursor-pointer block relative"
                                title="Klik untuk ubah foto profil"
                            >
                                {formatAvatarUrl(profile.avatar) ? (
                                    <img
                                        src={formatAvatarUrl(profile.avatar)!}
                                        alt={profile.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{profile.name.charAt(0).toUpperCase()}</span>
                                )}

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsAvatarDialogOpen(true)}
                                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#b80035] text-white flex items-center justify-center shadow-md hover:bg-[#9e002d] transition-transform active:scale-90 cursor-pointer"
                                title="Ubah Foto"
                            >
                                <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center sm:items-start min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                                <h2 className="text-base font-extrabold text-zinc-900 truncate">
                                    {profile.name}
                                </h2>
                                <Badge className="bg-[#b80035] hover:bg-[#9e002d] text-white text-[10px] font-extrabold px-2 py-0">
                                    Administrator
                                </Badge>
                            </div>
                            <span className="text-xs text-zinc-600 mt-0.5 truncate block max-w-full font-mono">
                                {profile.email}
                            </span>
                            {profile.phone ? (
                                <span className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                                    <span className="material-symbols-outlined text-[13px] text-emerald-600">call</span>
                                    {profile.phone}
                                </span>
                            ) : (
                                <span className="text-[11px] text-amber-600 font-medium mt-0.5">
                                    (Belum ada nomor WhatsApp admin)
                                </span>
                            )}
                            {profile.created_at && (
                                <span className="text-[10px] text-zinc-400 mt-1">
                                    Bergabung sejak {profile.created_at}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quick Link Banner ke Pengaturan Toko */}
                    <div className="bg-rose-500/10 border-t border-rose-200/60 px-4 sm:px-5 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#b80035] text-[18px]">
                                tune
                            </span>
                            <span className="text-[11px] font-bold text-zinc-800">
                                Pengaturan & Gateway Toko
                            </span>
                        </div>
                        <Button
                            asChild
                            size="sm"
                            className="h-7 text-[10px] font-bold bg-[#b80035] hover:bg-[#9e002d] text-white rounded-lg shadow-2xs"
                        >
                            <Link href="/admin/settings">Buka Pengaturan</Link>
                        </Button>
                    </div>
                </Card>

                {/* Navigation Pill Tabs */}
                <div className="w-full bg-[#eae7eb] p-1 rounded-2xl flex items-center shadow-inner">
                    <button
                        type="button"
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
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
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeTab === 'security'
                                ? 'bg-white text-[#b80035] shadow-xs'
                                : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[15px]">lock</span>
                        <span>Keamanan</span>
                    </button>
                </div>

                {/* TAB 1: INFO KONTAK */}
                {activeTab === 'info' && (
                    <Card className="rounded-3xl border-[#eae7eb] shadow-xs p-5">
                        <CardHeader className="p-0 pb-4">
                            <CardTitle className="text-sm font-bold text-zinc-900">Perbarui Informasi Administrator</CardTitle>
                            <CardDescription className="text-xs text-zinc-500">
                                Pastikan nomor WhatsApp aktif untuk menerima rincian notifikasi pesanan masuk
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={handleSubmitProfile} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="name" className="text-xs font-bold">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama Lengkap Admin"
                                    required
                                    className="h-10 text-xs rounded-xl"
                                />
                                {errors.name && (
                                    <span className="text-rose-600 text-[10px] font-medium">{errors.name}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="email" className="text-xs font-bold">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@domain.com"
                                    required
                                    className="h-10 text-xs rounded-xl font-mono"
                                />
                                {errors.email && (
                                    <span className="text-rose-600 text-[10px] font-medium">{errors.email}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="phone" className="text-xs font-bold">No. WhatsApp / HP Admin</Label>
                                    <span className="text-[10px] text-zinc-400">Penerima notifikasi toko</span>
                                </div>
                                <Input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="cth: 081234567890 / 628123..."
                                    className="h-10 text-xs rounded-xl"
                                />
                                {errors.phone && (
                                    <span className="text-rose-600 text-[10px] font-medium">{errors.phone}</span>
                                )}
                            </div>

                            {recentlySuccessful && (
                                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                                    <span>Perubahan profil admin berhasil disimpan!</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#b80035] hover:bg-[#9e002d] text-white h-10 text-xs font-bold gap-1.5 rounded-xl shadow-xs mt-2 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">save</span>
                                <span>Simpan Perubahan</span>
                            </Button>
                        </form>
                    </Card>
                )}

                {/* TAB 2: KEAMANAN & PASSWORD */}
                {activeTab === 'security' && (
                    <Card className="rounded-3xl border-[#eae7eb] shadow-xs p-5">
                        <CardHeader className="p-0 pb-4">
                            <CardTitle className="text-sm font-bold text-zinc-900">Keamanan & Sandi Admin</CardTitle>
                            <CardDescription className="text-xs text-zinc-500">
                                Ubah kata sandi untuk menjaga keamanan akun administrator Anda
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={handleSubmitProfile} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="current_password" className="text-xs font-bold">Kata Sandi Saat Ini</Label>
                                <Input
                                    id="current_password"
                                    type="password"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    placeholder="Masukkan sandi lama saat ini"
                                    className="h-10 text-xs rounded-xl"
                                />
                                {errors.current_password && (
                                    <span className="text-rose-600 text-[10px] font-medium">{errors.current_password}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="password" className="text-xs font-bold">Kata Sandi Baru</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter baru"
                                    className="h-10 text-xs rounded-xl"
                                />
                                {errors.password && (
                                    <span className="text-rose-600 text-[10px] font-medium">{errors.password}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="password_confirmation" className="text-xs font-bold">Konfirmasi Kata Sandi Baru</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi sandi baru"
                                    className="h-10 text-xs rounded-xl"
                                />
                                {errors.password_confirmation && (
                                    <span className="text-rose-600 text-[10px] font-medium">{errors.password_confirmation}</span>
                                )}
                            </div>

                            {recentlySuccessful && (
                                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                                    <span>Kata sandi admin berhasil diperbarui!</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={processing || !data.password}
                                className="w-full bg-[#b80035] hover:bg-[#9e002d] text-white h-10 text-xs font-bold gap-1.5 rounded-xl shadow-xs mt-2 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                                <span>Perbarui Kata Sandi</span>
                            </Button>
                        </form>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
