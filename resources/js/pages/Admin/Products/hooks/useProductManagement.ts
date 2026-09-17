import React, { useState, useRef, useMemo } from 'react';
import { router, useForm } from '@inertiajs/react';
import { useToast } from '@/components/ui/toast';
import { ProductItem, ProductVariantItem, ProductProps } from '../types';

export function useProductManagement({
    products,
    categories,
    packaging_types = [],
    sizes = [],
    units = [],
    filters,
}: ProductProps) {
    const { error: toastError } = useToast();

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || 'all');

    // Product Create / Edit Modal state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [uploadType, setUploadType] = useState<'file' | 'url'>('file');

    // Manage Variants Modal state (List of variants for a product)
    const [managingVariantsProduct, setManagingVariantsProduct] = useState<ProductItem | null>(null);

    // Popup Modal for Add/Edit Single Variant
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [editingVariantItem, setEditingVariantItem] = useState<ProductVariantItem | null>(null);

    // Variant Form state
    const [variantPackaging, setVariantPackaging] = useState('none');
    const [variantSize, setVariantSize] = useState('none');
    const [variantUnit, setVariantUnit] = useState(units.length > 0 ? units[0].id.toString() : '');
    const [variantSku, setVariantSku] = useState('');
    const [variantPrice, setVariantPrice] = useState('');
    const [variantStock, setVariantStock] = useState('0');
    const [variantIsActive, setVariantIsActive] = useState(true);
    const [variantFormError, setVariantFormError] = useState<string | null>(null);
    const [isSubmittingVariant, setIsSubmittingVariant] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors } = useForm<{
        name: string;
        category_id: string;
        description: string;
        image: string;
        image_file: File | null;
        is_active: boolean;
        _method?: string;
    }>({
        name: '',
        category_id: categories.length > 0 ? categories[0].id.toString() : '',
        description: '',
        image: '',
        image_file: null,
        is_active: true,
    });

    // Real-time Live Search & Category Filtering
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesCategory = selectedCategory === 'all' || p.category_id.toString() === selectedCategory;
            if (!matchesCategory) return false;
            if (!searchTerm.trim()) return true;

            const term = searchTerm.toLowerCase().trim();
            const matchesName = p.name.toLowerCase().includes(term);
            const matchesCategoryName = p.category_name.toLowerCase().includes(term);
            const matchesDescription = p.description ? p.description.toLowerCase().includes(term) : false;
            const matchesVariant = p.variants?.some((v) =>
                v.sku.toLowerCase().includes(term) ||
                v.packaging_name.toLowerCase().includes(term) ||
                v.size_name.toLowerCase().includes(term)
            );

            return matchesName || matchesCategoryName || matchesDescription || Boolean(matchesVariant);
        });
    }, [products, selectedCategory, searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (val: string) => {
        setSelectedCategory(val);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const openCreateModal = () => {
        reset();
        setPreviewImage(null);
        setUploadType('file');
        setData({
            name: '',
            category_id: categories.length > 0 ? categories[0].id.toString() : '',
            description: '',
            image: '',
            image_file: null,
            is_active: true,
        });
        setIsCreateOpen(true);
    };

    const openEditModal = (product: ProductItem) => {
        setEditingProduct(product);
        setPreviewImage(product.image || null);
        setUploadType(
            product.image && product.image.startsWith('http') && !product.image.includes('/storage/')
                ? 'url'
                : 'file'
        );
        setData({
            name: product.name,
            category_id: product.category_id.toString(),
            description: product.description || '',
            image: product.image || '',
            image_file: null,
            is_active: product.is_active,
        });
    };

    const closeProductModal = () => {
        setIsCreateOpen(false);
        setEditingProduct(null);
        setPreviewImage(null);
        reset();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image_file', file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
        }
    };

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingProduct) {
            router.post(
                `/admin/products/${editingProduct.id}`,
                {
                    _method: 'PUT',
                    name: data.name,
                    category_id: data.category_id,
                    description: data.description,
                    image: data.image,
                    image_file: data.image_file,
                    is_active: data.is_active,
                },
                {
                    forceFormData: true,
                    onSuccess: () => {
                        setEditingProduct(null);
                        setPreviewImage(null);
                        reset();
                    },
                    onError: () => {
                        toastError('Gagal memperbarui produk. Periksa formulir.');
                    },
                }
            );
        } else {
            post('/admin/products', {
                forceFormData: true,
                onSuccess: () => {
                    setIsCreateOpen(false);
                    setPreviewImage(null);
                    reset();
                },
                onError: () => {
                    toastError('Gagal menambahkan produk. Periksa formulir.');
                },
            });
        }
    };

    const handleToggleProduct = (id: number) => {
        router.post(`/admin/products/${id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteProduct = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus produk "${name}" beserta seluruh varian dan fotonya?`)) {
            router.delete(`/admin/products/${id}`, {
                preserveScroll: true,
            });
        }
    };

    // Variant Management Handlers
    const openManageVariants = (product: ProductItem) => {
        setManagingVariantsProduct(product);
    };

    const closeManageVariants = () => {
        setManagingVariantsProduct(null);
        closeVariantModal();
    };

    const resetVariantForm = () => {
        setVariantPackaging('none');
        setVariantSize('none');
        setVariantUnit(units.length > 0 ? units[0].id.toString() : '');
        setVariantSku('');
        setVariantPrice('');
        setVariantStock('0');
        setVariantIsActive(true);
        setVariantFormError(null);
    };

    const openAddVariantModal = () => {
        setEditingVariantItem(null);
        resetVariantForm();
        setIsVariantModalOpen(true);
    };

    const openEditVariantModal = (variant: ProductVariantItem) => {
        setEditingVariantItem(variant);
        setVariantPackaging(variant.packaging_type_id ? variant.packaging_type_id.toString() : 'none');
        setVariantSize(variant.size_id ? variant.size_id.toString() : 'none');
        setVariantUnit(variant.unit_id.toString());
        setVariantSku(variant.sku);
        setVariantPrice(variant.price.toString());
        setVariantStock(variant.stock.toString());
        setVariantIsActive(variant.is_active);
        setVariantFormError(null);
        setIsVariantModalOpen(true);
    };

    const closeVariantModal = () => {
        setIsVariantModalOpen(false);
        setEditingVariantItem(null);
        resetVariantForm();
    };

    const handleSaveVariant = (e: React.FormEvent) => {
        e.preventDefault();
        if (!managingVariantsProduct) return;

        if (!variantPrice || Number(variantPrice) < 0) {
            setVariantFormError('Harga jual wajib diisi dan minimal 0.');
            return;
        }

        if (!variantUnit) {
            setVariantFormError('Satuan dasar wajib dipilih.');
            return;
        }

        setVariantFormError(null);
        setIsSubmittingVariant(true);

        const payload = {
            product_id: managingVariantsProduct.id,
            packaging_type_id: variantPackaging === 'none' ? null : variantPackaging,
            size_id: variantSize === 'none' ? null : variantSize,
            unit_id: variantUnit,
            sku: variantSku,
            price: variantPrice,
            stock: variantStock,
            is_active: variantIsActive,
        };

        if (editingVariantItem) {
            router.put(`/admin/variants/${editingVariantItem.id}`, payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmittingVariant(false);
                    closeVariantModal();
                },
                onError: (err) => {
                    setIsSubmittingVariant(false);
                    const msg = Object.values(err)[0] || 'Gagal menyimpan varian.';
                    setVariantFormError(msg);
                    toastError(msg);
                },
            });
        } else {
            router.post('/admin/variants', payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmittingVariant(false);
                    closeVariantModal();
                },
                onError: (err) => {
                    setIsSubmittingVariant(false);
                    const msg = Object.values(err)[0] || 'Gagal menambahkan varian.';
                    setVariantFormError(msg);
                    toastError(msg);
                },
            });
        }
    };

    const handleToggleVariant = (variant: ProductVariantItem) => {
        router.post(`/admin/variants/${variant.id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteVariant = (variantId: number, sku: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus varian "${sku}"?`)) {
            router.delete(`/admin/variants/${variantId}`, {
                preserveScroll: true,
            });
        }
    };

    // Find current active product for modal with live data from products prop
    const activeProduct = managingVariantsProduct
        ? products.find((p) => p.id === managingVariantsProduct.id) || managingVariantsProduct
        : null;

    return {
        searchTerm,
        selectedCategory,
        filteredProducts,
        isCreateOpen,
        editingProduct,
        previewImage,
        uploadType,
        managingVariantsProduct,
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
    };
}
