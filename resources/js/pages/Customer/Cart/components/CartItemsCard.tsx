import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem } from '@/lib/cart';

interface Props {
    cart: CartItem[];
    groupedCart: Record<string, CartItem[]>;
    categoryCount: number;
    errorItems?: string;
    onUpdateQuantity: (variantId: number, qty: number) => void;
    onRemoveFromCart: (variantId: number) => void;
}

export default function CartItemsCard({
    cart,
    groupedCart,
    categoryCount,
    errorItems,
    onUpdateQuantity,
    onRemoveFromCart,
}: Props) {
    const formatRupiah = (num: number) => {
        return 'Rp' + Math.round(num).toLocaleString('id-ID');
    };

    return (
        <Card className="border-rose-100 shadow-xs">
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-600 text-[22px]">
                            shopping_basket
                        </span>
                        <h2 className="font-bold text-base text-[#1b1b1e]">Daftar Item Buah</h2>
                    </div>
                    <Badge
                        variant="secondary"
                        className="text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"
                    >
                        {categoryCount} Kategori Produk
                    </Badge>
                </div>

                {cart.length === 0 ? (
                    <div className="text-center py-8">
                        <span className="material-symbols-outlined text-[48px] text-zinc-300">shopping_cart</span>
                        <p className="text-sm font-bold text-zinc-700 mt-2">Keranjang belanja Anda masih kosong</p>
                        <Button asChild className="mt-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold">
                            <Link href="/">Pilih Buah Segar Sekarang</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {Object.entries(groupedCart).map(([categoryName, items]) => {
                            const categorySubtotal = items.reduce(
                                (sum, it) => sum + it.price * it.quantity,
                                0
                            );

                            return (
                                <div
                                    key={categoryName}
                                    className="flex flex-col gap-2.5 p-3 rounded-2xl bg-zinc-50/70 border border-rose-100/80"
                                >
                                    {/* Header Kategori */}
                                    <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-rose-600 text-[18px]">
                                                category
                                            </span>
                                            <span className="text-xs font-bold text-[#1b1b1e]">
                                                Kategori: {categoryName}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-full">
                                            {items.length} varian
                                        </span>
                                    </div>

                                    {/* Daftar Item dalam Kategori */}
                                    <div className="flex flex-col gap-2.5">
                                        {items.map((item) => {
                                            const isKg = item.unit_symbol.toLowerCase() === 'kg';
                                            const step = isKg ? 0.5 : 1;
                                            const itemSubtotal = item.price * item.quantity;

                                            return (
                                                <div
                                                    key={item.variant_id}
                                                    className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-zinc-100 shadow-2xs"
                                                >
                                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                                                        <img
                                                            src={
                                                                item.product_image ||
                                                                'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600'
                                                            }
                                                            alt={item.product_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <h3 className="font-bold text-xs sm:text-sm text-[#1b1b1e] truncate">
                                                                    {item.product_name}
                                                                </h3>
                                                                <span className="text-[11px] font-semibold text-rose-600 block">
                                                                    {item.variant_label}
                                                                </span>
                                                            </div>
                                                            <span className="font-bold text-xs sm:text-sm text-[#1b1b1e] whitespace-nowrap">
                                                                {formatRupiah(itemSubtotal)}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-zinc-100">
                                                            <span className="text-[11px] text-zinc-500 font-medium">
                                                                {formatRupiah(item.price)} / {item.unit_symbol}
                                                            </span>

                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center bg-zinc-50 rounded-full px-1 py-0.5 border border-zinc-200 shadow-2xs">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            onUpdateQuantity(
                                                                                item.variant_id,
                                                                                parseFloat(
                                                                                    (item.quantity - step).toFixed(2)
                                                                                )
                                                                            )
                                                                        }
                                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-700 hover:bg-zinc-200 active:scale-90 cursor-pointer"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[14px]">
                                                                            remove
                                                                        </span>
                                                                    </button>

                                                                    <span className="text-xs font-bold text-zinc-800 w-12 text-center">
                                                                        {item.quantity} {item.unit_symbol}
                                                                    </span>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            onUpdateQuantity(
                                                                                item.variant_id,
                                                                                parseFloat(
                                                                                    (item.quantity + step).toFixed(2)
                                                                                )
                                                                            )
                                                                        }
                                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-700 hover:bg-zinc-200 active:scale-90 cursor-pointer"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[14px]">
                                                                            add
                                                                        </span>
                                                                    </button>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => onRemoveFromCart(item.variant_id)}
                                                                    className="text-zinc-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                                                                    title="Hapus item"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px]">
                                                                        delete
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Subtotal per Kategori */}
                                    <div className="flex justify-between items-center px-1 pt-1 text-[11px] text-zinc-500 font-medium">
                                        <span>Subtotal {categoryName}</span>
                                        <span className="font-bold text-zinc-800">
                                            {formatRupiah(categorySubtotal)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {errorItems && <p className="text-rose-600 text-xs font-medium mt-2">{errorItems}</p>}
            </CardContent>
        </Card>
    );
}
