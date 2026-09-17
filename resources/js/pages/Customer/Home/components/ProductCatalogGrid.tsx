import React from 'react';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '../types';

interface ProductCatalogGridProps {
    products: Product[];
    addedId: number | null;
    onQuickAdd: (product: Product, e: React.MouseEvent) => void;
}

export default function ProductCatalogGrid({
    products,
    addedId,
    onQuickAdd,
}: ProductCatalogGridProps) {
    const formatCurrency = (val: number) => {
        return 'Rp' + Number(val).toLocaleString('id-ID');
    };

    return (
        <section id="catalog" className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-600 text-[24px]">verified</span>
                    <h3 className="font-bold text-base text-[#1b1b1e]">Katalog Produk Buah</h3>
                </div>
                <span className="text-xs text-zinc-500 font-medium">
                    {products.length} Buah Tersedia
                </span>
            </div>

            {products.length === 0 ? (
                <Card className="p-8 text-center border-zinc-200">
                    <span className="material-symbols-outlined text-[48px] text-zinc-300">search_off</span>
                    <p className="text-sm font-bold text-zinc-700 mt-2">Tidak ada produk buah yang cocok</p>
                    <p className="text-xs text-zinc-400 mt-1">Coba gunakan kata kunci lain atau reset filter kategori.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {products.map((product, idx) => {
                        const isAdded = addedId === product.id;
                        const isOutOfStock = product.total_stock <= 0;

                        return (
                            <Card
                                key={product.id}
                                className={`border-rose-100 hover:shadow-md transition-all group overflow-hidden bg-white ${
                                    isOutOfStock ? 'border-zinc-200 opacity-90' : 'hover:border-rose-300'
                                }`}
                            >
                                <CardContent className="p-2.5 sm:p-3 flex flex-col justify-between h-full gap-2">
                                    <Link href={`/products/${product.slug}`} className="block">
                                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-100">
                                            <img
                                                src={product.image || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600'}
                                                alt={product.name}
                                                loading={idx < 4 ? 'eager' : 'lazy'}
                                                decoding="async"
                                                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                                                    isOutOfStock ? 'grayscale opacity-70' : ''
                                                }`}
                                            />
                                            {product.category && (
                                                <Badge variant="secondary" className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0 z-20">
                                                    {product.category.name}
                                                </Badge>
                                            )}
                                            <span className="absolute bottom-1.5 right-1.5 bg-black/75 text-white px-1.5 py-0.5 rounded-md text-[8px] font-bold z-20">
                                                {product.variants_count} Varian
                                            </span>

                                            {/* Tanda Stok Habis pada Foto Buah */}
                                            {isOutOfStock && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-2 z-10">
                                                    <span className="bg-rose-600/95 text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[13px]">block</span>
                                                        Stok Habis
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-0.5 mt-2">
                                            <h4 className="font-bold text-xs sm:text-sm text-[#1b1b1e] line-clamp-1 group-hover:text-rose-600 transition-colors">
                                                {product.name}
                                            </h4>
                                            {isOutOfStock ? (
                                                <div className="flex items-center gap-1 text-[10px] text-rose-600 font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                                    <span>Stok Habis</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                                    <span>Stok {product.total_stock} {product.default_unit}</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <div className="flex items-end justify-between pt-1.5 border-t border-zinc-100">
                                        <div>
                                            <span className="text-[9px] text-zinc-400 block font-medium leading-none">Mulai</span>
                                            <span className={`font-extrabold text-xs sm:text-sm block leading-tight mt-0.5 ${
                                                isOutOfStock ? 'text-zinc-500' : 'text-[#1b1b1e]'
                                            }`}>
                                                {formatCurrency(product.min_price)}
                                            </span>
                                            <span className="text-[9px] text-zinc-500 font-medium leading-none">
                                                /{product.default_unit}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Button asChild variant="outline" size="sm" className="w-7 h-7 p-0 rounded-full border-zinc-200">
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    title="Lihat Pilihan Varian"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                </Link>
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                disabled={isOutOfStock}
                                                onClick={(e) => {
                                                    if (isOutOfStock) return;
                                                    onQuickAdd(product, e);
                                                }}
                                                className={`w-7 h-7 p-0 rounded-full shadow-xs active:scale-90 transition-all ${
                                                    isOutOfStock
                                                        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed border border-zinc-200 shadow-none'
                                                        : isAdded
                                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                                                }`}
                                                title={isOutOfStock ? 'Stok Habis' : 'Tambah Varian Standar ke Keranjang'}
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    {isOutOfStock ? 'remove_shopping_cart' : isAdded ? 'check' : 'add_shopping_cart'}
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
