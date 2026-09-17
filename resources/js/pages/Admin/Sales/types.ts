export interface SaleItem {
    product_name: string;
    variant_name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Sale {
    id: number;
    invoice_number: string;
    customer_name: string;
    customer_phone: string;
    customer_address?: string | null;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    payment_proof?: string | null;
    notes?: string | null;
    rejection_reason?: string | null;
    paid_at?: string | null;
    created_at: string;
    items_count: number;
    items: SaleItem[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface SalesProps {
    sales: {
        data: Sale[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    currentStatus: string;
    searchQuery?: string | null;
}
