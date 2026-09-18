import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';
import { Category } from '../types';

interface Props {
    isOpen: boolean;
    categories: Category[];
    onClose: () => void;
}

export default function CategoryManagerDialog({ isOpen, categories, onClose }: Props) {
    const { error: toastError } = useToast();

    // Popup state for Create Category
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createName, setCreateName] = useState('');
    const [createDesc, setCreateDesc] = useState('');

    // Popup state for Edit Category
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');

    // Popup state for Delete Category Confirmation
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    // Popup state for Blocked Delete (Category has attached products)
    const [blockedCategory, setBlockedCategory] = useState<Category | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Open Create Popup
    const handleOpenCreate = () => {
        setCreateName('');
        setCreateDesc('');
        setIsCreateOpen(true);
    };

    // Open Edit Popup
    const handleOpenEdit = (cat: Category) => {
        setEditingCategory(cat);
        setEditName(cat.name);
        setEditDesc(cat.description || '');
    };

    // Click Delete Handler
    const handleRequestDelete = (cat: Category) => {
        if ((cat.products_count ?? 0) > 0) {
            setBlockedCategory(cat);
            return;
        }
        setDeletingCategory(cat);
    };

    // Save New Category from Create Popup
    const handleSaveNewCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!createName.trim()) return;

        setIsSubmitting(true);
        router.post(
            '/admin/categories',
            {
                name: createName.trim(),
                description: createDesc.trim() || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCreateName('');
                    setCreateDesc('');
                    setIsCreateOpen(false);
                    setIsSubmitting(false);
                },
                onError: (errs) => {
                    setIsSubmitting(false);
                    const msg = Object.values(errs)[0] || 'Gagal menambahkan kategori';
                    toastError(msg as string);
                },
            }
        );
    };

    // Save Edited Category from Edit Popup
    const handleUpdateCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory || !editName.trim()) return;

        setIsSubmitting(true);
        router.put(
            `/admin/categories/${editingCategory.id}`,
            {
                name: editName.trim(),
                description: editDesc.trim() || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingCategory(null);
                    setIsSubmitting(false);
                },
                onError: (errs) => {
                    setIsSubmitting(false);
                    const msg = Object.values(errs)[0] || 'Gagal memperbarui kategori';
                    toastError(msg as string);
                },
            }
        );
    };

    // Confirm Delete from Delete Popup
    const handleConfirmDelete = () => {
        if (!deletingCategory) return;

        setIsSubmitting(true);
        router.delete(`/admin/categories/${deletingCategory.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingCategory(null);
                setIsSubmitting(false);
            },
            onError: (errs) => {
                setIsSubmitting(false);
                const msg = Object.values(errs)[0] || 'Gagal menghapus kategori';
                toastError(msg as string);
            },
        });
    };

    return (
        <>
            {/* 1. Main Category List Dialog */}
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="max-w-xs sm:max-w-md w-[94vw] max-h-[85vh] overflow-y-auto rounded-2xl p-4 sm:p-5">
                    <DialogHeader className="pb-2 border-b border-zinc-100 text-left">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-rose-600 text-[20px]">
                                category
                            </span>
                            <div>
                                <DialogTitle className="text-sm sm:text-base font-bold text-zinc-900">
                                    Kelola Kategori Buah
                                </DialogTitle>
                                <DialogDescription className="text-[11px] text-zinc-500">
                                    Daftar master kategori buah pada katalog toko.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 pt-2">
                        {/* Trigger Button to Open Create Popup */}
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleOpenCreate}
                            className="w-full h-8.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl gap-1.5 shadow-2xs cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">add_circle</span>
                            <span>+ Tambah Kategori Baru</span>
                        </Button>

                        {/* Category Items List */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between px-0.5">
                                <span className="text-[11px] font-bold text-zinc-600">
                                    Daftar Kategori Terdaftar
                                </span>
                                <span className="text-[10px] text-zinc-400 font-medium">
                                    {categories.length} kategori
                                </span>
                            </div>

                            {categories.length === 0 ? (
                                <div className="p-4 text-center border border-zinc-200 rounded-xl bg-zinc-50">
                                    <p className="text-xs text-zinc-400">Belum ada kategori terdaftar.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1.5">
                                    {categories.map((cat) => (
                                        <div
                                            key={cat.id}
                                            className="p-2.5 border border-zinc-200/80 bg-white hover:border-zinc-300 rounded-xl shadow-2xs flex items-center justify-between gap-2 transition-all"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <h4 className="text-xs font-bold text-zinc-900 truncate">
                                                        {cat.name}
                                                    </h4>
                                                    <span className="text-[9px] bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded font-semibold shrink-0">
                                                        {cat.products_count ?? 0} produk
                                                    </span>
                                                </div>
                                                {cat.description && (
                                                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                                                        {cat.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEdit(cat)}
                                                    className="w-7 h-7 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
                                                    title="Edit Kategori (Popup)"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        edit
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isSubmitting}
                                                    onClick={() => handleRequestDelete(cat)}
                                                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                                                        (cat.products_count ?? 0) > 0
                                                            ? 'text-zinc-300 hover:text-zinc-400'
                                                            : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50'
                                                    }`}
                                                    title={
                                                        (cat.products_count ?? 0) > 0
                                                            ? 'Tidak dapat dihapus karena masih ada produk terkait'
                                                            : 'Hapus Kategori (Popup)'
                                                    }
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        delete
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 2. Popup Dialog: Tambah Kategori Baru */}
            <Dialog open={isCreateOpen} onOpenChange={(open) => !open && setIsCreateOpen(false)}>
                <DialogContent className="max-w-xs sm:max-w-sm w-[90vw] rounded-2xl p-4 sm:p-5">
                    <DialogHeader className="text-left pb-1">
                        <DialogTitle className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-rose-600 text-[18px]">
                                add_circle
                            </span>
                            <span>Tambah Kategori Baru</span>
                        </DialogTitle>
                        <DialogDescription className="text-[11px] text-zinc-500">
                            Masukkan nama dan deskripsi kategori buah baru.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveNewCategory} className="space-y-3 pt-1">
                        <div className="space-y-1">
                            <Label htmlFor="create_cat_name" className="text-xs font-semibold text-zinc-700">
                                Nama Kategori *
                            </Label>
                            <Input
                                id="create_cat_name"
                                value={createName}
                                onChange={(e) => setCreateName(e.target.value)}
                                placeholder="Contoh: Strawberry Ciwidey"
                                className="h-8.5 text-xs rounded-xl"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="create_cat_desc" className="text-xs font-semibold text-zinc-700">
                                Deskripsi Singkat (Opsional)
                            </Label>
                            <Input
                                id="create_cat_desc"
                                value={createDesc}
                                onChange={(e) => setCreateDesc(e.target.value)}
                                placeholder="Contoh: Kualitas segar nusantara"
                                className="h-8.5 text-xs rounded-xl"
                            />
                        </div>

                        <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsCreateOpen(false)}
                                className="h-8 px-3 text-xs rounded-xl border-zinc-200"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmitting || !createName.trim()}
                                className="h-8 px-3.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 3. Popup Dialog: Edit Kategori */}
            <Dialog open={editingCategory !== null} onOpenChange={(open) => !open && setEditingCategory(null)}>
                <DialogContent className="max-w-xs sm:max-w-sm w-[90vw] rounded-2xl p-4 sm:p-5">
                    <DialogHeader className="text-left pb-1">
                        <DialogTitle className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-rose-600 text-[18px]">
                                edit_note
                            </span>
                            <span>Edit Kategori Buah</span>
                        </DialogTitle>
                        <DialogDescription className="text-[11px] text-zinc-500">
                            Perbarui nama atau deskripsi kategori ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdateCategory} className="space-y-3 pt-1">
                        <div className="space-y-1">
                            <Label htmlFor="edit_cat_name" className="text-xs font-semibold text-zinc-700">
                                Nama Kategori *
                            </Label>
                            <Input
                                id="edit_cat_name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-8.5 text-xs rounded-xl"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="edit_cat_desc" className="text-xs font-semibold text-zinc-700">
                                Deskripsi Singkat (Opsional)
                            </Label>
                            <Input
                                id="edit_cat_desc"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                className="h-8.5 text-xs rounded-xl"
                            />
                        </div>

                        <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingCategory(null)}
                                className="h-8 px-3 text-xs rounded-xl border-zinc-200"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmitting || !editName.trim()}
                                className="h-8 px-3.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 4. Popup Dialog: Konfirmasi Hapus Kategori */}
            <Dialog open={deletingCategory !== null} onOpenChange={(open) => !open && setDeletingCategory(null)}>
                <DialogContent className="max-w-xs sm:max-w-sm w-[90vw] rounded-2xl p-4 sm:p-5">
                    <DialogHeader className="text-left pb-1">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-1">
                            <span className="material-symbols-outlined text-[22px]">delete_forever</span>
                        </div>
                        <DialogTitle className="text-sm font-bold text-zinc-900">
                            Hapus Kategori Buah?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-600 pt-1">
                            Apakah Anda yakin ingin menghapus kategori <strong className="text-zinc-900">"{deletingCategory?.name}"</strong>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex flex-row justify-end gap-2 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={() => setDeletingCategory(null)}
                            className="h-8 px-3 text-xs rounded-xl border-zinc-200"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={handleConfirmDelete}
                            className="h-8 px-3.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
                        >
                            {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 5. Popup Dialog: Info Kategori Tidak Dapat Dihapus */}
            <Dialog open={blockedCategory !== null} onOpenChange={(open) => !open && setBlockedCategory(null)}>
                <DialogContent className="max-w-xs sm:max-w-sm w-[90vw] rounded-2xl p-4 sm:p-5">
                    <DialogHeader className="text-left pb-1">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-1">
                            <span className="material-symbols-outlined text-[22px]">warning</span>
                        </div>
                        <DialogTitle className="text-sm font-bold text-zinc-900">
                            Tidak Dapat Dihapus
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-600 pt-1">
                            Kategori <strong className="text-zinc-900">"{blockedCategory?.name}"</strong> saat ini masih digunakan oleh <strong className="text-rose-600">{blockedCategory?.products_count} produk</strong>.
                            <span className="block mt-1 text-zinc-500 text-[11px]">
                                Silakan ubah atau hapus produk yang terhubung ke kategori ini terlebih dahulu.
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex flex-row justify-end pt-2">
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => setBlockedCategory(null)}
                            className="h-8 px-4 text-xs font-bold rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer"
                        >
                            Mengerti
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
