import React from 'react';
import { Input } from '@/components/ui/input';

interface Props {
    search: string;
    isSearching: boolean;
    currentStatus: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
    onStatusFilter: (status: string) => void;
}

export default function SalesSearchBar({
    search,
    isSearching,
    currentStatus,
    onSearchChange,
    onClearSearch,
    onStatusFilter,
}: Props) {
    const statuses = [
        { key: 'ALL', label: 'Semua' },
        { key: 'WAITING_VERIFICATION', label: 'Verifikasi' },
        { key: 'PAID', label: 'Lunas' },
        { key: 'PENDING', label: 'Pending' },
        { key: 'REJECTED', label: 'Ditolak' },
    ];

    return (
        <div className="flex flex-col gap-2.5">
            {/* Live Search Bar */}
            <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-zinc-400 pointer-events-none flex items-center justify-center">
                    search
                </span>
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Live search invoice, nama pelanggan, no. HP, produk..."
                    className="pl-9 pr-9 h-9.5 text-xs rounded-2xl border-zinc-200 bg-white shadow-2xs focus:bg-white w-full"
                />
                {isSearching ? (
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-rose-600 animate-spin pointer-events-none">
                        progress_activity
                    </span>
                ) : search ? (
                    <button
                        type="button"
                        onClick={onClearSearch}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                        title="Hapus pencarian"
                    >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                ) : null}
            </div>

            {/* Status Filter Horizontal Scroll Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
                {statuses.map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => onStatusFilter(item.key)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                            currentStatus === item.key
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200/80'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
