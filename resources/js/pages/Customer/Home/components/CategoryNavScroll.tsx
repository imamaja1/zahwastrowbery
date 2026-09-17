import React from 'react';
import { Category } from '../types';

interface CategoryNavScrollProps {
    categories: Category[];
    selectedCategory?: string | null;
    onSelectCategory: (slug?: string) => void;
}

export default function CategoryNavScroll({
    categories,
    selectedCategory,
    onSelectCategory,
}: CategoryNavScrollProps) {
    const getCategoryEmoji = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('lokal')) return '🍓';
        if (lower.includes('import')) return '🍎';
        if (lower.includes('tropis')) return '🥭';
        if (lower.includes('potong')) return '🍉';
        return '🍊';
    };

    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#1b1b1e]">Kategori Buah</h3>
                {selectedCategory && (
                    <button
                        onClick={() => onSelectCategory(undefined)}
                        className="text-xs text-rose-600 font-bold hover:underline"
                    >
                        Reset Filter
                    </button>
                )}
            </div>
            <div className="flex gap-3 overflow-x-auto py-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <button
                    type="button"
                    onClick={() => onSelectCategory(undefined)}
                    className={`flex flex-col items-center gap-1.5 min-w-[80px] p-3 rounded-2xl transition-all group active:scale-95 border cursor-pointer ${
                        !selectedCategory
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                    }`}
                >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                        🌟
                    </div>
                    <span className="text-[11px] font-bold text-center truncate max-w-[70px]">Semua</span>
                </button>

                {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.slug;
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onSelectCategory(cat.slug)}
                            className={`flex flex-col items-center gap-1.5 min-w-[84px] p-3 rounded-2xl transition-all group active:scale-95 border cursor-pointer ${
                                isSelected
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                                {getCategoryEmoji(cat.name)}
                            </div>
                            <span className="text-[11px] font-bold text-center truncate max-w-[76px]">
                                {cat.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
