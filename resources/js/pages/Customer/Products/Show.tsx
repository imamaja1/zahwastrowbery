import React from 'react';
import { Head } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { ProductShowProps } from './types';
import { useProductDetail } from './hooks/useProductDetail';
import ProductHeroImage from './components/ProductHeroImage';
import ProductHeaderInfo from './components/ProductHeaderInfo';
import PackagingSelector from './components/PackagingSelector';
import SizeSelector from './components/SizeSelector';
import PurchaseActionCard from './components/PurchaseActionCard';
import ProductFeatureBadges from './components/ProductFeatureBadges';

export default function ProductShow({ product }: ProductShowProps) {
    const {
        selectedPackagingId,
        selectedSizeId,
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
    } = useProductDetail(product);

    return (
        <CustomerLayout title={product.name}>
            <Head title={`${product.name} - ZahwaStrowbery`} />

            <div className="flex flex-col w-full max-w-md mx-auto px-4 py-4 md:py-6 pb-20">
                {/* Hero Image & Breadcrumbs */}
                <ProductHeroImage
                    product={product}
                    activeVariant={activeVariant}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={() => setIsWishlisted(!isWishlisted)}
                />

                {/* Title, Description & Pricing summary */}
                <ProductHeaderInfo
                    product={product}
                    activeVariant={activeVariant}
                />

                {/* Variant Selections & Actions */}
                <div className="pt-5 flex flex-col gap-4">
                    {/* Kemasan Selection */}
                    <PackagingSelector
                        packagingOptions={product.packaging_options}
                        selectedPackagingId={selectedPackagingId}
                        activeVariant={activeVariant}
                        onSelectPackaging={handlePackagingSelect}
                    />

                    {/* Ukuran Selection */}
                    <SizeSelector
                        product={product}
                        sizeOptions={product.size_options}
                        selectedPackagingId={selectedPackagingId}
                        selectedSizeId={selectedSizeId}
                        activeVariant={activeVariant}
                        isKgUnit={isKgUnit}
                        onSelectSize={handleSizeSelect}
                    />

                    {/* Purchase and Quantity Stepper */}
                    <PurchaseActionCard
                        activeVariant={activeVariant}
                        isKgUnit={isKgUnit}
                        quantity={quantity}
                        subtotal={subtotal}
                        isAdded={isAdded}
                        onQtyMinus={handleQtyMinus}
                        onQtyPlus={handleQtyPlus}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                    />

                    {/* Quality Badges */}
                    <ProductFeatureBadges />
                </div>
            </div>
        </CustomerLayout>
    );
}
