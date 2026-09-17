import React from 'react';
import { TopProduct } from '../types';

interface Props {
    topProducts: TopProduct[];
}

export default function SalesAnalytics({ topProducts }: Props) {
    const maxQty =
        topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.total_qty), 1) : 1;

    return (
        <div className="flex flex-col gap-2.5">
            {/* Visual Trend Line Chart */}
            <div className="border border-zinc-200/80 shadow-2xs rounded-2xl bg-white p-3">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-rose-600">
                            show_chart
                        </span>
                        <span className="text-xs font-bold text-zinc-900">Grafik Penjualan</span>
                    </div>
                    <span className="text-[9px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
                        Realtime
                    </span>
                </div>

                <div className="w-full h-24 relative flex flex-col justify-end pt-1">
                    <svg
                        className="w-full h-18 overflow-visible"
                        preserveAspectRatio="none"
                        viewBox="0 0 320 80"
                    >
                        <defs>
                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#b80035" stopOpacity="0.2"></stop>
                                <stop offset="100%" stopColor="#b80035" stopOpacity="0.0"></stop>
                            </linearGradient>
                        </defs>
                        <path
                            d="M 10 65 L 80 45 L 150 52 L 220 25 L 290 10 L 290 80 L 10 80 Z"
                            fill="url(#chartGradient)"
                        ></path>
                        <path
                            d="M 10 65 L 80 45 L 150 52 L 220 25 L 290 10"
                            fill="none"
                            stroke="#b80035"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                        ></path>
                        <circle
                            cx="10"
                            cy="65"
                            fill="#ffffff"
                            r="3"
                            stroke="#b80035"
                            strokeWidth="2"
                        ></circle>
                        <circle
                            cx="80"
                            cy="45"
                            fill="#ffffff"
                            r="3"
                            stroke="#b80035"
                            strokeWidth="2"
                        ></circle>
                        <circle
                            cx="150"
                            cy="52"
                            fill="#ffffff"
                            r="3"
                            stroke="#b80035"
                            strokeWidth="2"
                        ></circle>
                        <circle
                            cx="220"
                            cy="25"
                            fill="#ffffff"
                            r="3"
                            stroke="#b80035"
                            strokeWidth="2"
                        ></circle>
                        <circle
                            cx="290"
                            cy="10"
                            fill="#b80035"
                            r="4"
                            stroke="#ffffff"
                            strokeWidth="2"
                        ></circle>
                    </svg>
                    <div className="flex justify-between text-zinc-400 text-[9px] pt-1 px-1 border-t border-zinc-100">
                        <span>H-4</span>
                        <span>H-3</span>
                        <span>H-2</span>
                        <span>Kemarin</span>
                        <span className="text-rose-600 font-bold">Hari Ini</span>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="border border-zinc-200/80 shadow-2xs rounded-2xl bg-white p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-amber-600">
                            local_fire_department
                        </span>
                        <span className="text-xs font-bold text-zinc-900">Produk Terlaris</span>
                    </div>
                    <span className="text-[9px] text-zinc-400 font-semibold">Volume</span>
                </div>

                <div className="flex flex-col gap-2">
                    {topProducts.length === 0 ? (
                        <p className="text-[11px] text-zinc-400 py-2 text-center">
                            Belum ada data penjualan.
                        </p>
                    ) : (
                        topProducts.slice(0, 4).map((p, idx) => {
                            const percent = Math.round((p.total_qty / maxQty) * 100);
                            return (
                                <div key={idx} className="flex flex-col gap-0.5">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="font-semibold text-zinc-800 truncate max-w-[180px]">
                                            {p.name}
                                        </span>
                                        <span className="font-bold text-rose-600">
                                            {p.total_qty} Unit
                                        </span>
                                    </div>
                                    <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
                                        <div
                                            className="bg-rose-600 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
