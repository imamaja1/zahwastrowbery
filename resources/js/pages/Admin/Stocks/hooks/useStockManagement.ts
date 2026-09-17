import React, { useState, useEffect, useRef, useMemo } from 'react';
import { router, useForm } from '@inertiajs/react';
import { StockItem, StockProps } from '../types';

export function useStockManagement({ stocks, filters }: StockProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedProduct, setSelectedProduct] = useState(filters.product_id || 'all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'inventory' | 'mutations'>('inventory');
    const [isSearching, setIsSearching] = useState(false);
    const isFirstRender = useRef(true);

    const [adjustingStock, setAdjustingStock] = useState<StockItem | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        variant_id: '',
        type: 'IN',
        quantity: '',
        notes: '',
    });

    // Live search debounced server sync
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            router.get(
                '/admin/stocks',
                {
                    search: searchTerm || undefined,
                    status: selectedStatus === 'all' ? undefined : selectedStatus,
                    product_id: selectedProduct === 'all' ? undefined : selectedProduct,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['stocks', 'filters'],
                    onFinish: () => setIsSearching(false),
                }
            );
        }, 350);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm, selectedStatus, selectedProduct]);

    // Instant client-side filtering for 0ms typing response
    const filteredStocks = useMemo(() => {
        return stocks.filter((item) => {
            const matchesStatus =
                selectedStatus === 'all' || item.status === selectedStatus;
            if (!matchesStatus) return false;

            const matchesProduct =
                selectedProduct === 'all' ||
                (item.product_id ? item.product_id.toString() === selectedProduct : true);
            if (!matchesProduct) return false;

            if (!searchTerm.trim()) return true;

            const term = searchTerm.toLowerCase().trim();
            return (
                item.sku.toLowerCase().includes(term) ||
                item.product_name.toLowerCase().includes(term) ||
                item.variant_label.toLowerCase().includes(term)
            );
        });
    }, [stocks, selectedStatus, selectedProduct, searchTerm]);

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleResetFilter = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setSelectedProduct('all');
    };

    const openAdjustModal = (item: StockItem) => {
        setAdjustingStock(item);
        setData({
            variant_id: item.id.toString(),
            type: 'IN',
            quantity: '',
            notes: '',
        });
    };

    const closeAdjustModal = () => {
        setAdjustingStock(null);
        reset();
    };

    const handleSaveAdjustment = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/stocks/adjust', {
            onSuccess: () => {
                setAdjustingStock(null);
                reset();
            },
        });
    };

    const activeFilterCount =
        (selectedStatus !== 'all' ? 1 : 0) + (selectedProduct !== 'all' ? 1 : 0);

    return {
        searchTerm,
        setSearchTerm,
        selectedStatus,
        setSelectedStatus,
        selectedProduct,
        setSelectedProduct,
        isFilterOpen,
        setIsFilterOpen,
        activeTab,
        setActiveTab,
        isSearching,
        adjustingStock,
        data,
        setData,
        processing,
        errors,
        filteredStocks,
        activeFilterCount,
        handleClearSearch,
        handleResetFilter,
        openAdjustModal,
        closeAdjustModal,
        handleSaveAdjustment,
    };
}
