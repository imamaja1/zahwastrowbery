import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HomeSearchBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClear: () => void;
}

export default function HomeSearchBar({
    search,
    onSearchChange,
    onSubmit,
    onClear,
}: HomeSearchBarProps) {
    return (
        <section className="flex items-center gap-2">
            <form onSubmit={onSubmit} className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-[20px]">
                    search
                </span>
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Cari stroberi ciwidey, apel fuji, mangga harum manis..."
                    className="pl-10 pr-9 h-11 text-xs sm:text-sm border-rose-100 shadow-xs rounded-2xl bg-white"
                />
                {search && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                )}
            </form>
            <Button
                type="button"
                onClick={onSubmit}
                className="w-11 h-11 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs p-0 flex items-center justify-center shrink-0"
            >
                <span className="material-symbols-outlined text-[20px]">tune</span>
            </Button>
        </section>
    );
}
