export interface Variant {
    id: number;
    sku: string;
    price: number;
    stock: number;
    packaging_type_id: number | null;
    packaging_type_name: string | null;
    size_id: number | null;
    size_name: string | null;
    unit_id: number;
    unit_symbol: string;
    unit_name: string;
    label: string;
}

export interface Option {
    id: number;
    name: string;
    symbol?: string;
}

export interface ProductDetail {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    category?: { id: number; name: string; slug: string } | null;
    variants: Variant[];
    packaging_options: Option[];
    size_options: Option[];
    unit_options: Option[];
}

export interface ProductShowProps {
    product: ProductDetail;
}
