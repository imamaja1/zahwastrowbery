export interface PaymentSettings {
    payment_qris_is_active: boolean;
    payment_qris_name: string;
    payment_qris_image: string;
    payment_qris_instructions: string;
    payment_transfer_is_active: boolean;
    payment_transfer_bank_name: string;
    payment_transfer_account_number: string;
    payment_transfer_account_holder: string;
    payment_transfer_instructions: string;
    payment_cod_is_active: boolean;
    payment_cod_instructions: string;
}

export interface GoogleSettings {
    google_auth_is_active: boolean;
    google_client_id: string;
    google_client_secret: string;
    google_redirect_uri: string;
}

export interface SmtpSettings {
    smtp_host: string;
    smtp_port: string;
    smtp_encryption: string;
    smtp_username: string;
    smtp_password: string;
    smtp_from_address: string;
    smtp_from_name: string;
    smtp_admin_email: string;
    smtp_is_active: boolean;
}

export interface TelegramSettings {
    telegram_bot_token: string;
    telegram_chat_id: string;
    telegram_notify_new_order: boolean;
    telegram_notify_payment_uploaded: boolean;
    telegram_notify_low_stock: boolean;
    telegram_is_active: boolean;
}

export interface WhatsAppSettings {
    whatsapp_base_url?: string;
    whatsapp_provider: string;
    whatsapp_api_key: string;
    whatsapp_sender_number: string;
    whatsapp_admin_number: string;
    whatsapp_notify_customer: boolean;
    whatsapp_notify_admin: boolean;
    whatsapp_order_template: string;
    whatsapp_is_active: boolean;
}

export interface SettingsData {
    payment: PaymentSettings;
    google: GoogleSettings;
    smtp: SmtpSettings;
    telegram: TelegramSettings;
    whatsapp: WhatsAppSettings;
}

export interface SettingsProps {
    settings: SettingsData;
}

export type MainTab = 'payment' | 'google' | 'notifications';
export type NotificationSubTab = 'smtp' | 'whatsapp' | 'telegram';
