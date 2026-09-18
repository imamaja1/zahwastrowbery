export interface ProductVariantItem {
    id: number;
    product_id: number;
    sku: string;
    label: string;
    packaging_type_id?: number | null;
    packaging_name: string;
    size_id?: number | null;
    size_name: string;
    unit_id: number;
    unit_name: string;
    unit_symbol: string;
    price: number;
    stock: number;
    is_active: boolean;
}

export interface ProductItem {
    id: number;
    category_id: number;
    category_name: string;
    name: string;
    slug: string;
    description?: string | null;
    image: string;
    raw_image?: string | null;
    is_active: boolean;
    variants_count: number;
    min_price: number;
    max_price: number;
    total_stock: number;
    created_at: string;
    variants?: ProductVariantItem[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    products_count?: number;
}

export interface MasterOption {
    id: number;
    name: string;
    symbol?: string;
}

export interface ProductProps {
    products: ProductItem[];
    categories: Category[];
    packaging_types: MasterOption[];
    sizes: MasterOption[];
    units: MasterOption[];
    filters: {
        search: string;
        category_id: string;
    };
}
