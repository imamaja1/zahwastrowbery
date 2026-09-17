import React from 'react';
import { Button } from '@/components/ui/button';
import { StockItem } from '../types';

interface Props {
    stocks: StockItem[];
    searchTerm: string;
    onOpenAdjustModal: (item: StockItem) => void;
}

export default function StockCardList({ stocks, searchTerm, onOpenAdjustModal }: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    if (stocks.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-2xl border border-zinc-200 p-4">
                <span className="material-symbols-outlined text-slate-300 text-4xl mb-1">
                    inventory_2
                </span>
                <h3 className="font-bold text-slate-700 text-xs">Tidak ada data stok</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                    {searchTerm
                        ? `Tidak ada varian yang cocok dengan "${searchTerm}".`
                        : 'Coba sesuaikan filter status di atas.'}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {stocks.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-3 flex flex-col gap-2.5 transition-all hover:border-slate-300"
                >
                    <div className="flex items-start gap-2.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            {item.product_image ? (
                                <img
                                    src={item.product_image}
                                    alt={item.product_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <span className="material-symbols-outlined text-[20px]">
                                        nutrition
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                                <div>
                                    <h3 className="font-bold text-xs text-slate-900 truncate">
                                        {item.product_name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="font-mono text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-100">
                                            {item.sku}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-500 truncate">
                                            {item.variant_label}
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                                        item.status === 'safe'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : item.status === 'low'
                                            ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                                    }`}
                                >
                                    {item.status_label}
                                </span>
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                                <div>
                                    <span className="text-[10px] text-slate-400 block leading-tight">
                                        Fisik Stok
                                    </span>
                                    <span className="text-xs font-black text-slate-900">
                                        {item.stock} {item.unit_symbol}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-[10px] text-slate-400 block leading-tight text-right">
                                        Valuasi Aset
                                    </span>
                                    <span className="text-xs font-black text-emerald-700">
                                        {formatRupiah(item.asset_value)}
                                    </span>
                                </div>

                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => onOpenAdjustModal(item)}
                                    className="h-7 px-2.5 text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl gap-1 shadow-2xs"
                                >
                                    <span className="material-symbols-outlined text-[13px]">
                                        tune
                                    </span>
                                    <span>Sesuaikan</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
