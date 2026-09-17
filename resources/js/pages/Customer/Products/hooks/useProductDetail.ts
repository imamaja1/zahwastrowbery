import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { addToCart } from '@/lib/cart';
import { ProductDetail } from '../types';

export function useProductDetail(product: ProductDetail) {
    const [selectedPackagingId, setSelectedPackagingId] = useState<number | null>(
        product.variants[0]?.packaging_type_id || null
    );
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(
        product.variants[0]?.size_id || null
    );
    const [selectedUnitId, setSelectedUnitId] = useState<number>(
        product.variants[0]?.unit_id || 1
    );

    // Filter available matching variant
    const activeVariant = useMemo(() => {
        let matched = product.variants.find(
            (v) =>
                v.packaging_type_id === selectedPackagingId &&
                v.size_id === selectedSizeId &&
                v.unit_id === selectedUnitId
        );

        if (!matched) {
            matched = product.variants.find(
                (v) =>
                    v.packaging_type_id === selectedPackagingId &&
                    v.size_id === selectedSizeId
            );
        }

        if (!matched) {
            matched = product.variants.find(
                (v) => v.packaging_type_id === selectedPackagingId
            );
        }

        return matched || product.variants[0];
    }, [product.variants, selectedPackagingId, selectedSizeId, selectedUnitId]);

    const isKgUnit = activeVariant?.unit_symbol?.toLowerCase() === 'kg';
    const step = isKgUnit ? 0.5 : 1;
    const minQty = isKgUnit ? 0.5 : 1;

    const [quantity, setQuantity] = useState<number>(minQty);
    const [isAdded, setIsAdded] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handlePackagingSelect = (packagingId: number | null) => {
        setSelectedPackagingId(packagingId);
        const sample = product.variants.find((v) => v.packaging_type_id === packagingId);
        if (sample) {
            setSelectedSizeId(sample.size_id);
            setSelectedUnitId(sample.unit_id);
            if (sample.unit_symbol.toLowerCase() === 'kg') {
                setQuantity(1.0);
            } else {
                setQuantity(1);
            }
        }
    };

    const handleSizeSelect = (sizeId: number | null) => {
        setSelectedSizeId(sizeId);
    };

    const handleQtyPlus = () => {
        if (!activeVariant) return;
        if (quantity + step <= activeVariant.stock) {
            setQuantity(parseFloat((quantity + step).toFixed(2)));
        }
    };

    const handleQtyMinus = () => {
        if (quantity - step >= minQty) {
            setQuantity(parseFloat((quantity - step).toFixed(2)));
        }
    };

    const handleAddToCart = () => {
        if (!activeVariant || activeVariant.stock <= 0) return;

        addToCart({
            product_id: product.id,
            product_name: product.name,
            product_image: product.image,
            category_id: product.category?.id || null,
            category_name: product.category?.name || 'Buah Segar',
            variant_id: activeVariant.id,
            variant_label: activeVariant.label,
            packaging_name: activeVariant.packaging_type_name,
            size_name: activeVariant.size_name,
            unit_symbol: activeVariant.unit_symbol,
            price: activeVariant.price,
            quantity: quantity,
            stock: activeVariant.stock,
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.visit('/checkout');
    };

    const subtotal = (activeVariant?.price || 0) * quantity;

    return {
        selectedPackagingId,
        selectedSizeId,
        selectedUnitId,
        activeVariant,
        isKgUnit,
        quantity,
        isAdded,
        isWishlisted,
        setIsWishlisted,
        handlePackagingSelect,
        handleSizeSelect,
        handleQtyPlus,
        handleQtyMinus,
        handleAddToCart,
        handleBuyNow,
        subtotal,
    };
}
