export interface Variant {
    id: number;
    sku: string;
    price: number;
    stock: number;
    label: string;
    packaging?: string | null;
    size?: string | null;
    unit: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    category?: { id: number; name: string; slug: string } | null;
    min_price: number;
    max_price: number;
    total_stock: number;
    default_unit: string;
    variants_count: number;
    variants: Variant[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

export interface HomeProps {
    categories: Category[];
    products: Product[];
    selectedCategory?: string | null;
    searchQuery?: string | null;
}
