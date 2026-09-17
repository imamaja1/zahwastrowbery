import { useState } from 'react';
import { router } from '@inertiajs/react';
import { addToCart } from '@/lib/cart';
import { Product } from '../types';

interface UseHomeCatalogProps {
    selectedCategory?: string | null;
    searchQuery?: string | null;
}

export function useHomeCatalog({ selectedCategory, searchQuery }: UseHomeCatalogProps) {
    const [search, setSearch] = useState(searchQuery || '');
    const [addedId, setAddedId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', { category: selectedCategory, search }, { preserveState: true, preserveScroll: true });
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get('/', { category: selectedCategory }, { preserveState: true });
    };

    const handleCategoryClick = (slug?: string) => {
        router.get(
            '/',
            { category: slug === selectedCategory ? undefined : slug, search },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const defaultVariant = product.variants[0];
        if (!defaultVariant) return;

        addToCart({
            product_id: product.id,
            product_name: product.name,
            product_image: product.image,
            category_id: product.category?.id || null,
            category_name: product.category?.name || 'Buah Segar',
            variant_id: defaultVariant.id,
            variant_label: defaultVariant.label,
            packaging_name: defaultVariant.packaging,
            size_name: defaultVariant.size,
            unit_symbol: defaultVariant.unit,
            price: defaultVariant.price,
            quantity: 1,
            stock: defaultVariant.stock,
        });

        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    return {
        search,
        setSearch,
        addedId,
        handleSearch,
        handleClearSearch,
        handleCategoryClick,
        handleQuickAdd,
    };
}
