import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ProductOption } from '../types';

interface Props {
    searchTerm: string;
    isSearching: boolean;
    isFilterOpen: boolean;
    activeFilterCount: number;
    selectedStatus: string;
    selectedProduct: string;
    products: ProductOption[];
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
    onToggleFilter: () => void;
    onStatusChange: (status: string) => void;
    onProductChange: (productId: string) => void;
    onResetFilter: () => void;
}

export default function StockFilterBar({
    searchTerm,
    isSearching,
    isFilterOpen,
    activeFilterCount,
    selectedStatus,
    selectedProduct,
    products,
    onSearchChange,
    onClearSearch,
    onToggleFilter,
    onStatusChange,
    onProductChange,
    onResetFilter,
}: Props) {
    return (
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-2.5 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400 pointer-events-none">
                        search
                    </span>
                    <Input
                        type="text"
                        placeholder="Cari SKU atau nama varian..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-8 pr-8 text-xs h-8.5 rounded-xl border-slate-200 bg-slate-50/60 focus:bg-white w-full"
                    />
                    {isSearching ? (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                            <span className="material-symbols-outlined text-[14px] text-slate-400 animate-spin">
                                sync
                            </span>
                        </div>
                    ) : searchTerm ? (
                        <button
                            type="button"
                            onClick={onClearSearch}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                            title="Hapus pencarian"
                        >
                            <span className="material-symbols-outlined text-[13px]">close</span>
                        </button>
                    ) : null}
                </div>

                <Button
                    type="button"
                    variant={isFilterOpen || activeFilterCount > 0 ? 'default' : 'outline'}
                    size="sm"
                    onClick={onToggleFilter}
                    className={`h-8.5 px-2.5 text-xs rounded-xl font-bold gap-1 cursor-pointer shrink-0 ${
                        isFilterOpen || activeFilterCount > 0
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <span className="material-symbols-outlined text-[15px]">tune</span>
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-white text-rose-600 text-[10px] font-black flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </div>

            {/* Filter Accordion Body */}
            {isFilterOpen && (
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Status Stok
                        </label>
                        <Select value={selectedStatus} onValueChange={onStatusChange}>
                            <SelectTrigger className="h-8 text-xs rounded-xl border-slate-200">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="safe">Stok Aman (&gt; 5)</SelectItem>
                                <SelectItem value="low">Menipis (1 - 5)</SelectItem>
                                <SelectItem value="out">Habis (0)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Master Buah
                        </label>
                        <Select value={selectedProduct} onValueChange={onProductChange}>
                            <SelectTrigger className="h-8 text-xs rounded-xl border-slate-200">
                                <SelectValue placeholder="Semua Buah" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Buah</SelectItem>
                                {products.map((p) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {activeFilterCount > 0 && (
                        <div className="sm:col-span-2 flex justify-end pt-1">
                            <button
                                type="button"
                                onClick={onResetFilter}
                                className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[13px]">restart_alt</span>
                                <span>Reset Filter</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
