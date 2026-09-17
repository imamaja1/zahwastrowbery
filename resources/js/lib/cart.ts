import { useEffect, useMemo, useState } from 'react';

export interface CartItem {
    product_id: number;
    product_name: string;
    product_image: string | null;
    category_id?: number | null;
    category_name?: string | null;
    variant_id: number;
    variant_label: string;
    packaging_name?: string | null;
    size_name?: string | null;
    unit_symbol: string;
    price: number;
    quantity: number;
    stock: number;
}

const CART_STORAGE_KEY = 'zahwa_fruit_cart_v1';

export function getCartItems(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function saveCartItems(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cart_updated'));
}

export function addToCart(item: CartItem): void {
    const items = getCartItems();
    const existingIndex = items.findIndex((i) => i.variant_id === item.variant_id);

    if (existingIndex > -1) {
        items[existingIndex].quantity = Math.min(
            items[existingIndex].quantity + item.quantity,
            items[existingIndex].stock
        );
        // keep category up to date
        if (item.category_name && !items[existingIndex].category_name) {
            items[existingIndex].category_name = item.category_name;
            items[existingIndex].category_id = item.category_id;
        }
    } else {
        items.push(item);
    }

    saveCartItems(items);
}

export function updateCartQuantity(variantId: number, quantity: number): void {
    let items = getCartItems();
    if (quantity <= 0) {
        items = items.filter((i) => i.variant_id !== variantId);
    } else {
        items = items.map((i) =>
            i.variant_id === variantId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
        );
    }
    saveCartItems(items);
}

export function removeFromCart(variantId: number): void {
    const items = getCartItems().filter((i) => i.variant_id !== variantId);
    saveCartItems(items);
}

export function clearCart(): void {
    saveCartItems([]);
}

export function useCart() {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        setCart(getCartItems());

        const handleUpdate = () => {
            setCart(getCartItems());
        };

        window.addEventListener('cart_updated', handleUpdate);
        window.addEventListener('storage', handleUpdate);

        return () => {
            window.removeEventListener('cart_updated', handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    // Hitung berdasarkan kategori produk unik
    const { uniqueCategories, categoryCount, totalCount, totalQuantity, totalPrice } = useMemo(() => {
        const uniqueCategories = Array.from(new Set(cart.map((item) => item.category_name || 'Buah Segar')));
        const categoryCount = uniqueCategories.length;
        // totalCount mengikuti jumlah kategori produk sesuai permintaan user
        const totalCount = categoryCount;
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return {
            uniqueCategories,
            categoryCount,
            totalCount,
            totalQuantity,
            totalPrice,
        };
    }, [cart]);

    return {
        cart,
        categoryCount,
        uniqueCategories,
        totalCount,
        totalQuantity,
        totalPrice,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
    };
}
