import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ProductProps } from './types';
import { useProductManagement } from './hooks/useProductManagement';
import ProductFilterBar from './components/ProductFilterBar';
import ProductCardList from './components/ProductCardList';
import ProductFormDialog from './components/ProductFormDialog';
import VariantManagerDialog from './components/VariantManagerDialog';
import SingleVariantDialog from './components/SingleVariantDialog';
import CategoryManagerDialog from './components/CategoryManagerDialog';

export default function AdminProductsIndex(props: ProductProps) {
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

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
        deletingProduct,
        deletingVariant,
        confirmDeleteProduct,
        cancelDeleteProduct,
        confirmDeleteVariant,
        cancelDeleteVariant,
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
                onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
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

            {/* Modal 4: Manage Categories Dialog */}
            <CategoryManagerDialog
                isOpen={isCategoryManagerOpen}
                categories={props.categories}
                onClose={() => setIsCategoryManagerOpen(false)}
            />

            {/* Modal 5: Popup Konfirmasi Hapus Produk */}
            <Dialog open={deletingProduct !== null} onOpenChange={(open) => !open && cancelDeleteProduct()}>
                <DialogContent className="max-w-xs sm:max-w-sm w-[90vw] rounded-2xl p-4 sm:p-5">
                    <DialogHeader className="text-left pb-1">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-1">
                            <span className="material-symbols-outlined text-[22px]">delete_forever</span>
                        </div>
                        <DialogTitle className="text-sm font-bold text-zinc-900">
                            Hapus Buah Ini?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-600 pt-1">
                            Apakah Anda yakin ingin menghapus produk <strong className="text-zinc-900">"{deletingProduct?.name}"</strong> beserta seluruh varian dan fotonya?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex flex-row justify-end gap-2 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={cancelDeleteProduct}
                            className="h-8 px-3 text-xs rounded-xl border-zinc-200"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={confirmDeleteProduct}
                            className="h-8 px-3.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
                        >
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal 6: Popup Konfirmasi Hapus Varian */}
            <Dialog open={deletingVariant !== null} onOpenChange={(open) => !open && cancelDeleteVariant()}>
                <DialogContent className="max-w-xs sm:max-w-sm w-[90vw] rounded-2xl p-4 sm:p-5">
                    <DialogHeader className="text-left pb-1">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-1">
                            <span className="material-symbols-outlined text-[22px]">delete_forever</span>
                        </div>
                        <DialogTitle className="text-sm font-bold text-zinc-900">
                            Hapus Varian Ini?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-600 pt-1">
                            Apakah Anda yakin ingin menghapus varian <strong className="font-mono text-zinc-900">{deletingVariant?.sku}</strong>?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex flex-row justify-end gap-2 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={cancelDeleteVariant}
                            className="h-8 px-3 text-xs rounded-xl border-zinc-200"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={confirmDeleteVariant}
                            className="h-8 px-3.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
                        >
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
