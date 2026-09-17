export interface StockItem {
    id: number;
    product_id?: number;
    sku: string;
    product_name: string;
    product_image?: string | null;
    variant_label: string;
    unit_symbol: string;
    price: number;
    stock: number;
    asset_value: number;
    status: 'safe' | 'low' | 'out';
    status_label: string;
    is_active: boolean;
    updated_at: string;
}

export interface StockMutationItem {
    id: number;
    sku: string;
    product_name: string;
    unit_symbol: string;
    type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'SALE';
    quantity: number;
    stock_before: number;
    stock_after: number;
    reference_number: string;
    notes: string;
    user_name: string;
    created_at: string;
}

export interface Summary {
    total_variants: number;
    safe_count: number;
    low_count: number;
    out_count: number;
    total_valuation: number;
}

export interface ProductOption {
    id: number;
    name: string;
}

export interface StockProps {
    stocks: StockItem[];
    summary: Summary;
    recent_mutations: StockMutationItem[];
    products: ProductOption[];
    filters: {
        search: string;
        status: string;
        product_id: string;
    };
}
