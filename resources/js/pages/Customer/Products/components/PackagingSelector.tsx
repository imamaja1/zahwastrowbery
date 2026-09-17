import React from 'react';
import { Option, Variant } from '../types';

interface PackagingSelectorProps {
    packagingOptions: Option[];
    selectedPackagingId: number | null;
    activeVariant: Variant | undefined;
    onSelectPackaging: (id: number | null) => void;
}

export default function PackagingSelector({
    packagingOptions,
    selectedPackagingId,
    activeVariant,
    onSelectPackaging,
}: PackagingSelectorProps) {
    if (packagingOptions.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1b1b1e]">Pilihan Jenis Kemasan</span>
                <span className="text-[11px] font-bold text-rose-600">
                    {activeVariant?.packaging_type_name || 'Standar'}
                </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {packagingOptions.map((pkg) => {
                    const isSelected = selectedPackagingId === pkg.id;
                    return (
                        <button
                            key={pkg.id}
                            type="button"
                            onClick={() => onSelectPackaging(pkg.id)}
                            className={`p-3 rounded-2xl text-center transition-all flex flex-col items-center gap-1 active:scale-95 border cursor-pointer ${
                                isSelected
                                    ? 'bg-rose-50 text-rose-700 border-rose-600 font-bold shadow-xs ring-2 ring-rose-500/20'
                                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {pkg.name.toLowerCase().includes('mika')
                                    ? 'layers'
                                    : pkg.name.toLowerCase().includes('kotak')
                                    ? 'inventory_2'
                                    : 'shopping_basket'}
                            </span>
                            <span className="text-xs">{pkg.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
