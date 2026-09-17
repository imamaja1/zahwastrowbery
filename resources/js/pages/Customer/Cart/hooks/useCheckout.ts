import React, { useState, useEffect, useMemo } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { useCart, clearCart } from '@/lib/cart';
import { CheckoutProps, PaymentMethodType } from '../types';

export function useCheckout({ user, payment_settings }: CheckoutProps) {
    const { auth } = usePage().props as any;
    const currentUser = user || auth?.user;
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [copiedBank, setCopiedBank] = useState(false);

    const isQrisActive = payment_settings?.qris?.is_active !== false;
    const isTransferActive = payment_settings?.transfer?.is_active !== false;
    const isCodActive = payment_settings?.cod?.is_active !== false;

    const defaultMethod: PaymentMethodType = useMemo(() => {
        if (isQrisActive) return 'QRIS';
        if (isTransferActive) return 'TRANSFER';
        if (isCodActive) return 'COD';
        return 'QRIS';
    }, [isQrisActive, isTransferActive, isCodActive]);

    const { cart, categoryCount, uniqueCategories, totalPrice, updateCartQuantity, removeFromCart } = useCart();

    // Mengelompokkan item keranjang berdasarkan Kategori Produk
    const groupedCart = useMemo(() => {
        const groups: Record<string, typeof cart> = {};
        for (const item of cart) {
            const categoryName = item.category_name || 'Buah Segar';
            if (!groups[categoryName]) {
                groups[categoryName] = [];
            }
            groups[categoryName].push(item);
        }
        return groups;
    }, [cart]);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(defaultMethod);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Bersihkan URL object untuk mencegah memory leak saat unmount atau saat upload baru
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const { data, setData, post, processing, errors } = useForm<{
        customer_name: string;
        customer_phone: string;
        customer_address: string;
        payment_method: string;
        notes: string;
        payment_proof: File | null;
        items: Array<{ variant_id: number; quantity: number }>;
    }>({
        customer_name: currentUser?.name || '',
        customer_phone: currentUser?.phone || '',
        customer_address: '',
        payment_method: defaultMethod,
        notes: '',
        payment_proof: null,
        items: [],
    });

    // Otomatis sinkronkan nama dan no HP saat user login berhasil melalui popup modal
    useEffect(() => {
        if (currentUser) {
            setData((prev) => ({
                ...prev,
                customer_name: prev.customer_name || currentUser.name || '',
                customer_phone: prev.customer_phone || currentUser.phone || '',
            }));
        }
    }, [currentUser]);

    useEffect(() => {
        setData(
            'items',
            cart.map((item) => ({
                variant_id: item.variant_id,
                quantity: item.quantity,
            }))
        );
    }, [cart]);

    const handleMethodChange = (method: PaymentMethodType) => {
        setPaymentMethod(method);
        setData('payment_method', method);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('payment_proof', file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const handleCopyBank = () => {
        navigator.clipboard.writeText(
            payment_settings?.transfer?.account_number || '5220304050'
        );
        setCopiedBank(true);
        setTimeout(() => setCopiedBank(false), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Keranjang belanja Anda masih kosong.');
            return;
        }

        if (!currentUser) {
            setIsAuthModalOpen(true);
            return;
        }

        post('/checkout', {
            forceFormData: true,
            onSuccess: () => {
                clearCart();
            },
        });
    };

    const shippingCost = cart.length > 0 ? 10000 : 0;
    const discountPromo = cart.length > 0 ? 10000 : 0;
    const finalTotal = Math.max(0, totalPrice + shippingCost - discountPromo);

    return {
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        copiedBank,
        handleCopyBank,
        isQrisActive,
        isTransferActive,
        isCodActive,
        cart,
        categoryCount,
        uniqueCategories,
        totalPrice,
        groupedCart,
        updateCartQuantity,
        removeFromCart,
        paymentMethod,
        previewUrl,
        data,
        setData,
        processing,
        errors,
        handleMethodChange,
        handleFileChange,
        handleSubmit,
        shippingCost,
        discountPromo,
        finalTotal,
    };
}
