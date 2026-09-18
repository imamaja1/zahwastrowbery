export interface PendingItem {
    id: number;
    invoice_number: string;
    customer_name: string;
    customer_phone: string;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    payment_proof?: string | null;
    created_at: string;
    items_summary: string;
}

export interface RecentSale {
    id: number;
    invoice_number: string;
    customer_name: string;
    customer_phone: string;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    created_at: string;
    items_count: number;
    items_summary: string;
}

export interface TopProduct {
    name: string;
    total_qty: number;
    total_revenue: number;
}

export interface SalesTrendItem {
    date: string;
    day_name: string;
    label: string;
    total: number;
    count: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
}

export interface DashboardMetrics {
    total_revenue: number;
    total_transactions: number;
    total_products_sold: number;
    pending_verifications_count: number;
}

export interface DashboardProps {
    metrics: DashboardMetrics;
    pending_verifications: PendingItem[];
    recent_sales?: PaginatedData<RecentSale> | RecentSale[];
    top_products: TopProduct[];
    sales_trend?: SalesTrendItem[];
    monthly_sales: Record<string, number>;
}
