import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { ProductProps } from './types';
import { useProductManagement } from './hooks/useProductManagement';
import ProductFilterBar from './components/ProductFilterBar';
import ProductCardList from './components/ProductCardList';
import ProductFormDialog from './components/ProductFormDialog';
import VariantManagerDialog from './components/VariantManagerDialog';
import SingleVariantDialog from './components/SingleVariantDialog';

export default function AdminProductsIndex(props: ProductProps) {
    const {
        searchTerm,
        selectedCategory,
        filteredProducts,
        isCreateOpen,
        editingProduct,
        previewImage,
        uploadType,
        activeProduct,
        isVariantModalOpen,
        editingVariantItem,
        variantPackaging,
        variantSize,
        variantUnit,
        variantSku,
        variantPrice,
        variantStock,
        variantIsActive,
        variantFormError,
        isSubmittingVariant,
        fileInputRef,
        data,
        setData,
        processing,
        errors,
        handleSearchChange,
        handleCategoryChange,
        handleClearSearch,
        openCreateModal,
        openEditModal,
        closeProductModal,
        setUploadType,
        setPreviewImage,
        handleFileChange,
        handleSaveProduct,
        handleToggleProduct,
        handleDeleteProduct,
        openManageVariants,
        closeManageVariants,
        openAddVariantModal,
        openEditVariantModal,
        closeVariantModal,
        setVariantPackaging,
        setVariantSize,
        setVariantUnit,
        setVariantSku,
        setVariantPrice,
        setVariantStock,
        setVariantIsActive,
        handleSaveVariant,
        handleToggleVariant,
        handleDeleteVariant,
    } = useProductManagement(props);

    return (
        <AdminLayout title="Master Produk">
            <Head title="Master Produk - Admin ZahwaStrowbery" />

            <div className="flex flex-col gap-3">
                {/* 1. Header & Filter Bar */}
                <ProductFilterBar
                    totalFiltered={filteredProducts.length}
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                    categories={props.categories}
                    onSearchChange={handleSearchChange}
                    onClearSearch={handleClearSearch}
                    onCategoryChange={handleCategoryChange}
                    onOpenCreateModal={openCreateModal}
                />

                {/* 2. Product List Cards */}
                <ProductCardList
                    products={filteredProducts}
                    searchTerm={searchTerm}
                    onToggleProduct={handleToggleProduct}
                    onOpenManageVariants={openManageVariants}
                    onOpenEditModal={openEditModal}
                    onDeleteProduct={handleDeleteProduct}
                />
            </div>

            {/* Modal 1: Create / Edit Product Form */}
            <ProductFormDialog
                isOpen={isCreateOpen || editingProduct !== null}
                editingProduct={editingProduct}
                categories={props.categories}
                data={data}
                errors={errors}
                processing={processing}
                previewImage={previewImage}
                uploadType={uploadType}
                fileInputRef={fileInputRef}
                onClose={closeProductModal}
                onSetData={setData}
                onSetUploadType={setUploadType}
                onSetPreviewImage={setPreviewImage}
                onFileChange={handleFileChange}
                onSaveProduct={handleSaveProduct}
            />

            {/* Modal 2: Manage Variants List Dialog */}
            <VariantManagerDialog
                activeProduct={activeProduct}
                onClose={closeManageVariants}
                onOpenAddVariantModal={openAddVariantModal}
                onOpenEditVariantModal={openEditVariantModal}
                onToggleVariant={handleToggleVariant}
                onDeleteVariant={handleDeleteVariant}
            />

            {/* Modal 3: Add / Edit Single Variant Popup Dialog */}
            <SingleVariantDialog
                isOpen={isVariantModalOpen}
                activeProduct={activeProduct}
                editingVariantItem={editingVariantItem}
                variantPackaging={variantPackaging}
                variantSize={variantSize}
                variantUnit={variantUnit}
                variantSku={variantSku}
                variantPrice={variantPrice}
                variantStock={variantStock}
                variantIsActive={variantIsActive}
                variantFormError={variantFormError}
                isSubmittingVariant={isSubmittingVariant}
                packaging_types={props.packaging_types}
                sizes={props.sizes}
                units={props.units}
                onClose={closeVariantModal}
                onSetVariantPackaging={setVariantPackaging}
                onSetVariantSize={setVariantSize}
                onSetVariantUnit={setVariantUnit}
                onSetVariantSku={setVariantSku}
                onSetVariantPrice={setVariantPrice}
                onSetVariantStock={setVariantStock}
                onSetVariantIsActive={setVariantIsActive}
                onSaveVariant={handleSaveVariant}
            />
        </AdminLayout>
    );
}
