import React, { useState } from 'react';
import { SalesTrendItem, TopProduct } from '../types';

interface Props {
    topProducts: TopProduct[];
    salesTrend?: SalesTrendItem[];
}

export default function SalesAnalytics({ topProducts, salesTrend = [] }: Props) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const maxQty =
        topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.total_qty), 1) : 1;

    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    // Calculate dynamic SVG coordinates for 7-day sales trend
    const trendData = salesTrend.length > 0 ? salesTrend : [
        { date: '', day_name: '', label: 'H-6', total: 0, count: 0 },
        { date: '', day_name: '', label: 'H-5', total: 0, count: 0 },
        { date: '', day_name: '', label: 'H-4', total: 0, count: 0 },
        { date: '', day_name: '', label: 'H-3', total: 0, count: 0 },
        { date: '', day_name: '', label: 'H-2', total: 0, count: 0 },
        { date: '', day_name: '', label: 'Kemarin', total: 0, count: 0 },
        { date: '', day_name: '', label: 'Hari Ini', total: 0, count: 0 },
    ];

    const maxRevenue = Math.max(...trendData.map((d) => d.total), 10000);
    const svgWidth = 320;
    const svgHeight = 70;
    const paddingX = 16;
    const paddingTop = 12;
    const paddingBottom = 12;
    const usableHeight = svgHeight - paddingTop - paddingBottom;
    const usableWidth = svgWidth - paddingX * 2;

    const points = trendData.map((d, i) => {
        const x = paddingX + (i / Math.max(trendData.length - 1, 1)) * usableWidth;
        const y = svgHeight - paddingBottom - (d.total / maxRevenue) * usableHeight;
        return { x, y, data: d, index: i };
    });

    const pathD = points.reduce((acc, p, i) => {
        return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    const areaD = points.length > 0
        ? `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`
        : '';

    const activeItem = activeIndex !== null ? points[activeIndex]?.data : points[points.length - 1]?.data;
    const totalTrendRevenue = trendData.reduce((sum, d) => sum + d.total, 0);

    return (
        <div className="flex flex-col gap-2.5">
            {/* Visual Trend Line Chart */}
            <div className="border border-zinc-200/80 shadow-2xs rounded-2xl bg-white p-3">
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-rose-600">
                            show_chart
                        </span>
                        <span className="text-xs font-bold text-zinc-900">Grafik Penjualan 7 Hari</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                            {formatRupiah(totalTrendRevenue)}
                        </span>
                    </div>
                </div>

                {/* Active Data Point Callout */}
                {activeItem && (
                    <div className="flex items-center justify-between bg-zinc-50 border border-zinc-100 rounded-lg px-2 py-1 mb-1 text-[10px]">
                        <span className="font-semibold text-zinc-600">
                            {activeItem.label}: <strong className="text-zinc-900">{formatRupiah(activeItem.total)}</strong>
                        </span>
                        <span className="text-zinc-400">
                            {activeItem.count} pesanan
                        </span>
                    </div>
                )}

                <div className="w-full h-24 relative flex flex-col justify-end pt-1">
                    <svg
                        className="w-full h-18 overflow-visible"
                        preserveAspectRatio="none"
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    >
                        <defs>
                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#b80035" stopOpacity="0.25"></stop>
                                <stop offset="100%" stopColor="#b80035" stopOpacity="0.0"></stop>
                            </linearGradient>
                        </defs>
                        {areaD && (
                            <path
                                d={areaD}
                                fill="url(#chartGradient)"
                            />
                        )}
                        {pathD && (
                            <path
                                d={pathD}
                                fill="none"
                                stroke="#b80035"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                            />
                        )}
                        {points.map((p) => {
                            const isActive = activeIndex === p.index;
                            const isLast = p.index === points.length - 1 && activeIndex === null;
                            const isHighlighted = isActive || isLast;

                            return (
                                <g
                                    key={p.index}
                                    className="cursor-pointer"
                                    onMouseEnter={() => setActiveIndex(p.index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                    onClick={() => setActiveIndex(p.index)}
                                >
                                    {/* Invisible hover target */}
                                    <circle
                                        cx={p.x}
                                        cy={p.y}
                                        r="12"
                                        fill="transparent"
                                    />
                                    {/* Visible point */}
                                    <circle
                                        cx={p.x}
                                        cy={p.y}
                                        fill={isHighlighted ? '#b80035' : '#ffffff'}
                                        r={isHighlighted ? '4.5' : '3'}
                                        stroke="#b80035"
                                        strokeWidth={isHighlighted ? '2.5' : '1.8'}
                                        className="transition-all duration-200"
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    <div className="flex justify-between text-zinc-400 text-[9px] pt-1 px-1 border-t border-zinc-100">
                        {trendData.map((d, i) => (
                            <span
                                key={i}
                                className={`transition-colors ${
                                    (activeIndex === i || (activeIndex === null && i === trendData.length - 1))
                                        ? 'text-rose-600 font-bold'
                                        : ''
                                }`}
                            >
                                {d.label}
                            </span>
                        ))}
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
                    <span className="text-[9px] text-zinc-400 font-semibold">Berdasarkan Pesanan Lunas</span>
                </div>

                <div className="flex flex-col gap-2">
                    {topProducts.length === 0 ? (
                        <p className="text-[11px] text-zinc-400 py-2 text-center">
                            Belum ada data penjualan lunas.
                        </p>
                    ) : (
                        topProducts.slice(0, 5).map((p, idx) => {
                            const percent = Math.round((p.total_qty / maxQty) * 100);
                            return (
                                <div key={idx} className="flex flex-col gap-0.5">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="w-4 h-4 rounded-full bg-zinc-100 text-zinc-600 text-[9px] font-extrabold flex items-center justify-center shrink-0">
                                                {idx + 1}
                                            </span>
                                            <span className="font-semibold text-zinc-800 truncate max-w-[170px] sm:max-w-[220px]">
                                                {p.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[10px] text-zinc-400 font-medium">
                                                {formatRupiah(p.total_revenue)}
                                            </span>
                                            <span className="font-bold text-rose-600 text-[11px]">
                                                {p.total_qty} Unit
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
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
