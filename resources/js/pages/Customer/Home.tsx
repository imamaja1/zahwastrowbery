import React from 'react';
import { Head } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { HomeProps } from './Home/types';
import { useHomeCatalog } from './Home/hooks/useHomeCatalog';
import HomeSearchBar from './Home/components/HomeSearchBar';
import HomeHeroBanner from './Home/components/HomeHeroBanner';
import FlashSaleCountdown from './Home/components/FlashSaleCountdown';
import ProductCatalogGrid from './Home/components/ProductCatalogGrid';
import QualityGuaranteeCard from './Home/components/QualityGuaranteeCard';

export default function Home({ categories, products, selectedCategory, searchQuery }: HomeProps) {
    const {
        search,
        setSearch,
        addedId,
        handleSearch,
        handleClearSearch,
        handleQuickAdd,
    } = useHomeCatalog({ selectedCategory, searchQuery });

    return (
        <CustomerLayout title="Beranda Toko Buah Segar">
            <Head title="ZahwaStrowbery - Toko Buah Segar Langsung Dari Kebun" />

            <div className="flex flex-col gap-6 px-4 py-4 md:py-6">
                {/* 1. Search Bar */}
                <HomeSearchBar
                    search={search}
                    onSearchChange={setSearch}
                    onSubmit={handleSearch}
                    onClear={handleClearSearch}
                />

                {/* 2. Hero Banner Segar */}
                <HomeHeroBanner />

                {/* 3. Flash Sale Banner Promo */}
                <FlashSaleCountdown products={products} />

                {/* 5. Produk Pilihan (Grid 2 Kolom Mobile, 3-4 Kolom Desktop) */}
                <ProductCatalogGrid
                    products={products}
                    addedId={addedId}
                    onQuickAdd={handleQuickAdd}
                />

                {/* 6. Banner Jaminan Kualitas */}
                <QualityGuaranteeCard />
            </div>
        </CustomerLayout>
    );
}
