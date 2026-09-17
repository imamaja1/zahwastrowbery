import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Category } from '../types';

interface Props {
    totalFiltered: number;
    searchTerm: string;
    selectedCategory: string;
    categories: Category[];
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearSearch: () => void;
    onCategoryChange: (value: string) => void;
    onOpenCreateModal: () => void;
}

export default function ProductFilterBar({
    totalFiltered,
    searchTerm,
    selectedCategory,
    categories,
    onSearchChange,
    onClearSearch,
    onCategoryChange,
    onOpenCreateModal,
}: Props) {
    return (
        <div className="flex flex-col gap-3">
            {/* Header Title & Action Button (Compact) */}
            <div className="flex items-center justify-between px-1">
                <div>
                    <div className="flex items-center gap-1.5">
                        <h1 className="font-extrabold text-sm sm:text-base text-zinc-900 tracking-tight leading-tight">
                            Master Buah Segar
                        </h1>
                        <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-4.5 bg-rose-50 text-rose-700 font-bold border-rose-100"
                        >
                            {totalFiltered}
                        </Badge>
                    </div>
                    <span className="text-[11px] text-zinc-500">Kelola buah, harga & varian produk</span>
                </div>

                <Button
                    onClick={onOpenCreateModal}
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold h-8 px-3 rounded-xl gap-1 shadow-2xs cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Tambah Buah</span>
                </Button>
            </div>

            {/* Filter and Search Bar (Single Sleek Row) */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-2 shadow-2xs">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 flex items-center">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-zinc-400 pointer-events-none flex items-center justify-center">
                            search
                        </span>
                        <Input
                            type="text"
                            placeholder="Cari nama buah atau varian..."
                            value={searchTerm}
                            onChange={onSearchChange}
                            className="pl-8 pr-8 text-xs h-8 rounded-xl border-zinc-200 bg-slate-50/60 focus:bg-white w-full"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={onClearSearch}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
                                title="Hapus pencarian"
                            >
                                <span className="material-symbols-outlined text-[13px]">close</span>
                            </button>
                        )}
                    </div>

                    <div className="w-34 sm:w-36 shrink-0">
                        <Select value={selectedCategory} onValueChange={onCategoryChange}>
                            <SelectTrigger className="h-8 text-xs font-medium rounded-xl border-zinc-200 bg-white">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
