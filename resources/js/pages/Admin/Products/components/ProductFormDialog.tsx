import React, { RefObject } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Category, ProductItem } from '../types';

interface Props {
    isOpen: boolean;
    editingProduct: ProductItem | null;
    categories: Category[];
    data: {
        name: string;
        category_id: string;
        description: string;
        image: string;
        image_file: File | null;
        is_active: boolean;
    };
    errors: Partial<Record<string, string>>;
    processing: boolean;
    previewImage: string | null;
    uploadType: 'file' | 'url';
    fileInputRef: RefObject<HTMLInputElement | null>;
    onClose: () => void;
    onSetData: (key: any, value: any) => void;
    onSetUploadType: (type: 'file' | 'url') => void;
    onSetPreviewImage: (url: string | null) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSaveProduct: (e: React.FormEvent) => void;
}

export default function ProductFormDialog({
    isOpen,
    editingProduct,
    categories,
    data,
    errors,
    processing,
    previewImage,
    uploadType,
    fileInputRef,
    onClose,
    onSetData,
    onSetUploadType,
    onSetPreviewImage,
    onFileChange,
    onSaveProduct,
}: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xs sm:max-w-md w-[92vw] max-h-[85vh] overflow-y-auto rounded-2xl p-4">
                <DialogHeader className="pb-2 border-b border-zinc-100 text-left">
                    <DialogTitle className="text-sm font-bold text-zinc-900">
                        {editingProduct ? 'Edit Master Buah' : 'Tambah Buah Baru'}
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-zinc-500">
                        Atur foto buah, nama, kategori, dan deskripsi produk.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSaveProduct} className="space-y-3 pt-1">
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-xs font-semibold text-zinc-700">
                            Nama Buah *
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => onSetData('name', e.target.value)}
                            placeholder="Contoh: Strawberry Ciwidey Segar"
                            className="h-9 text-xs rounded-xl"
                            required
                        />
                        {errors.name && <p className="text-[10px] text-rose-600 font-medium">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="category_id" className="text-xs font-semibold text-zinc-700">
                            Kategori Buah *
                        </Label>
                        <Select value={data.category_id} onValueChange={(val) => onSetData('category_id', val)}>
                            <SelectTrigger id="category_id" className="h-9 text-xs font-medium rounded-xl">
                                <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && (
                            <p className="text-[10px] text-rose-600 font-medium">{errors.category_id}</p>
                        )}
                    </div>

                    {/* Image Upload / URL Selector */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold text-zinc-700">Foto Buah</Label>
                            <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg text-[10px]">
                                <button
                                    type="button"
                                    onClick={() => onSetUploadType('file')}
                                    className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                                        uploadType === 'file'
                                            ? 'bg-white text-zinc-900 shadow-2xs'
                                            : 'text-zinc-500'
                                    }`}
                                >
                                    Upload File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onSetUploadType('url')}
                                    className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                                        uploadType === 'url'
                                            ? 'bg-white text-zinc-900 shadow-2xs'
                                            : 'text-zinc-500'
                                    }`}
                                >
                                    Link URL
                                </button>
                            </div>
                        </div>

                        {uploadType === 'file' ? (
                            <div>
                                <input
                                    type="file"
                                    ref={fileInputRef as any}
                                    onChange={onFileChange}
                                    accept="image/png, image/jpeg, image/webp"
                                    className="hidden"
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-zinc-200 hover:border-rose-300 rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer bg-zinc-50/50 hover:bg-rose-50/30 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-zinc-400 text-2xl">
                                        cloud_upload
                                    </span>
                                    <span className="text-[11px] font-semibold text-zinc-600">
                                        Klik untuk pilih foto dari galeri
                                    </span>
                                    <span className="text-[9px] text-zinc-400">PNG, JPG, WEBP max 4MB</span>
                                </div>
                            </div>
                        ) : (
                            <Input
                                id="image"
                                type="url"
                                value={data.image}
                                onChange={(e) => {
                                    onSetData('image', e.target.value);
                                    onSetPreviewImage(e.target.value);
                                }}
                                placeholder="https://images.unsplash.com/..."
                                className="h-9 text-xs rounded-xl"
                            />
                        )}

                        {previewImage && (
                            <div className="flex items-center gap-2 p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 shrink-0">
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10px] text-zinc-500 truncate flex-1">
                                    Foto siap digunakan
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="description" className="text-xs font-semibold text-zinc-700">
                            Deskripsi & Keunggulan
                        </Label>
                        <textarea
                            id="description"
                            rows={2}
                            value={data.description}
                            onChange={(e) => onSetData('description', e.target.value)}
                            placeholder="Jelaskan rasa manis, kesegaran, atau asal kebun buah..."
                            className="w-full text-xs p-2 rounded-xl border border-zinc-200 focus:outline-rose-500 focus:border-rose-500 bg-transparent"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) => onSetData('is_active', e.target.checked)}
                            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                        <Label htmlFor="is_active" className="text-xs text-zinc-700 cursor-pointer">
                            Tampilkan produk di etalase toko
                        </Label>
                    </div>

                    <DialogFooter className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            className="h-8 text-xs rounded-xl"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={processing}
                            className="h-8 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                        >
                            {processing ? 'Menyimpan...' : editingProduct ? 'Perbarui Produk' : 'Simpan Produk'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
