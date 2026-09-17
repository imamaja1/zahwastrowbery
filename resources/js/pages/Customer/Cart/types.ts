export interface PaymentSettings {
    qris: {
        is_active: boolean;
        name: string;
        image_url?: string;
        instructions: string;
    };
    transfer: {
        is_active: boolean;
        bank_name: string;
        account_number: string;
        account_holder: string;
        instructions: string;
    };
    cod: {
        is_active: boolean;
        instructions: string;
    };
}

export interface CheckoutUser {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
}

export interface CheckoutProps {
    user?: CheckoutUser | null;
    payment_settings?: PaymentSettings;
}

export type PaymentMethodType = 'QRIS' | 'COD' | 'TRANSFER';
