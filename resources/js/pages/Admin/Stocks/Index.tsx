import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { StockProps } from './types';
import { useStockManagement } from './hooks/useStockManagement';
import StockSummaryMetrics from './components/StockSummaryMetrics';
import StockFilterBar from './components/StockFilterBar';
import StockCardList from './components/StockCardList';
import StockMutationHistory from './components/StockMutationHistory';
import StockAdjustmentDialog from './components/StockAdjustmentDialog';

export default function AdminStocksIndex(props: StockProps) {
    const {
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
    } = useStockManagement(props);

    return (
        <AdminLayout title="Monitoring Stok">
            <Head title="Manajemen & Monitoring Stok - Admin ZahwaStrowbery" />

            <div className="flex flex-col gap-3">
                {/* Header Section with Tab Switcher */}
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                            Monitoring Stok Buah
                        </h1>
                        <p className="text-[11px] text-slate-500">
                            Pantau persediaan, valuasi & mutasi fisik
                        </p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setActiveTab('inventory')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'inventory'
                                    ? 'bg-white text-slate-900 shadow-2xs'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Stok
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('mutations')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'mutations'
                                    ? 'bg-white text-slate-900 shadow-2xs'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Riwayat
                        </button>
                    </div>
                </div>

                {/* 2x2 Summary Metric Cards */}
                <StockSummaryMetrics summary={props.summary} />

                {activeTab === 'inventory' ? (
                    <>
                        {/* Filter and Live Search Bar */}
                        <StockFilterBar
                            searchTerm={searchTerm}
                            isSearching={isSearching}
                            isFilterOpen={isFilterOpen}
                            activeFilterCount={activeFilterCount}
                            selectedStatus={selectedStatus}
                            selectedProduct={selectedProduct}
                            products={props.products}
                            onSearchChange={setSearchTerm}
                            onClearSearch={handleClearSearch}
                            onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
                            onStatusChange={setSelectedStatus}
                            onProductChange={setSelectedProduct}
                            onResetFilter={handleResetFilter}
                        />

                        {/* List of Stock Cards */}
                        <StockCardList
                            stocks={filteredStocks}
                            searchTerm={searchTerm}
                            onOpenAdjustModal={openAdjustModal}
                        />
                    </>
                ) : (
                    /* Stock Mutation History */
                    <StockMutationHistory mutations={props.recent_mutations} />
                )}
            </div>

            {/* Quick Stock Adjustment Dialog Modal */}
            <StockAdjustmentDialog
                adjustingStock={adjustingStock}
                data={data}
                processing={processing}
                errors={errors}
                onClose={closeAdjustModal}
                onSetData={(key, val) => setData(key as any, val)}
                onSaveAdjustment={handleSaveAdjustment}
            />
        </AdminLayout>
    );
}
