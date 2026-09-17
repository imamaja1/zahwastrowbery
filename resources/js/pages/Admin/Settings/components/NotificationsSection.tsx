import React from 'react';
import { NotificationSubTab, SmtpSettings, WhatsAppSettings, TelegramSettings } from '../types';
import SmtpSettingsForm from './SmtpSettingsForm';
import WhatsAppSettingsForm from './WhatsAppSettingsForm';
import TelegramSettingsForm from './TelegramSettingsForm';

interface Props {
    notificationTab: NotificationSubTab;
    setNotificationTab: (tab: NotificationSubTab) => void;
    smtp: SmtpSettings;
    whatsapp: WhatsAppSettings;
    telegram: TelegramSettings;
    showSmtpPassword: boolean;
    showWhatsappApiKey: boolean;
    showTelegramToken: boolean;
    testEmail: string;
    testWhatsappPhone: string;
    isTesting: boolean;
    processing: boolean;
    waStatus?: {
        state: string;
        isReady: boolean;
        phoneNumber: string | null;
        lastError: string | null;
    } | null;
    waQrCode?: string | null;
    isCheckingWa?: boolean;
    isLoggingOutWa?: boolean;
    isRegisteringWa?: boolean;
    onUpdateSmtp: (field: keyof SmtpSettings, value: any) => void;
    onUpdateWhatsapp: (field: keyof WhatsAppSettings, value: any) => void;
    onUpdateTelegram: (field: keyof TelegramSettings, value: any) => void;
    onToggleShowSmtpPassword: () => void;
    onToggleShowWhatsappApiKey: () => void;
    onToggleShowTelegramToken: () => void;
    onToggle: (key: string, group: string, currentValue: boolean) => void;
    onTestEmailChange: (value: string) => void;
    onTestPhoneChange: (value: string) => void;
    onTestSmtp: (e: React.FormEvent) => void;
    onTestWhatsapp: (e: React.FormEvent) => void;
    onTestTelegram: () => void;
    onCheckWaStatus?: () => void;
    onGetWaQr?: () => void;
    onLogoutWa?: () => void;
    onRegisterWa?: (phoneNumber: string) => void;
    onSaveGroup: (group: 'smtp' | 'whatsapp' | 'telegram') => void;
}

export default function NotificationsSection({
    notificationTab,
    setNotificationTab,
    smtp,
    whatsapp,
    telegram,
    showSmtpPassword,
    showWhatsappApiKey,
    showTelegramToken,
    testEmail,
    testWhatsappPhone,
    isTesting,
    processing,
    waStatus,
    waQrCode,
    isCheckingWa,
    isLoggingOutWa,
    isRegisteringWa,
    onUpdateSmtp,
    onUpdateWhatsapp,
    onUpdateTelegram,
    onToggleShowSmtpPassword,
    onToggleShowWhatsappApiKey,
    onToggleShowTelegramToken,
    onToggle,
    onTestEmailChange,
    onTestPhoneChange,
    onTestSmtp,
    onTestWhatsapp,
    onTestTelegram,
    onCheckWaStatus,
    onGetWaQr,
    onLogoutWa,
    onRegisterWa,
    onSaveGroup,
}: Props) {
    return (
        <div className="flex flex-col gap-3">
            {/* Sub-tab 3 Layanan Notifikasi */}
            <div className="bg-white p-1 rounded-2xl border border-zinc-200/90 flex items-center gap-1 shadow-2xs">
                <button
                    type="button"
                    onClick={() => setNotificationTab('smtp')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        notificationTab === 'smtp'
                            ? 'bg-rose-50 text-[#b80035] border border-rose-200/70'
                            : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                >
                    <span className="material-symbols-outlined text-[15px]">mail</span>
                    <span>1. Email SMTP</span>
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            smtp.smtp_is_active ? 'bg-emerald-500' : 'bg-zinc-300'
                        }`}
                    />
                </button>

                <button
                    type="button"
                    onClick={() => setNotificationTab('whatsapp')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        notificationTab === 'whatsapp'
                            ? 'bg-rose-50 text-[#b80035] border border-rose-200/70'
                            : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                >
                    <span className="material-symbols-outlined text-[15px]">chat</span>
                    <span>2. WhatsApp</span>
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            whatsapp.whatsapp_is_active ? 'bg-emerald-500' : 'bg-zinc-300'
                        }`}
                    />
                </button>

                <button
                    type="button"
                    onClick={() => setNotificationTab('telegram')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        notificationTab === 'telegram'
                            ? 'bg-rose-50 text-[#b80035] border border-rose-200/70'
                            : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                >
                    <span className="material-symbols-outlined text-[15px]">send</span>
                    <span>3. Telegram</span>
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            telegram.telegram_is_active ? 'bg-emerald-500' : 'bg-zinc-300'
                        }`}
                    />
                </button>
            </div>

            {/* Sub-form rendering */}
            {notificationTab === 'smtp' && (
                <SmtpSettingsForm
                    smtp={smtp}
                    showSmtpPassword={showSmtpPassword}
                    testEmail={testEmail}
                    isTesting={isTesting}
                    processing={processing}
                    onUpdateField={onUpdateSmtp}
                    onToggleShowPassword={onToggleShowSmtpPassword}
                    onToggle={onToggle}
                    onTestEmailChange={onTestEmailChange}
                    onTestSmtp={onTestSmtp}
                    onSave={() => onSaveGroup('smtp')}
                />
            )}

            {notificationTab === 'whatsapp' && (
                <WhatsAppSettingsForm
                    whatsapp={whatsapp}
                    showWhatsappApiKey={showWhatsappApiKey}
                    testWhatsappPhone={testWhatsappPhone}
                    isTesting={isTesting}
                    processing={processing}
                    waStatus={waStatus}
                    waQrCode={waQrCode}
                    isCheckingWa={isCheckingWa}
                    isLoggingOutWa={isLoggingOutWa}
                    onUpdateField={onUpdateWhatsapp}
                    onToggleShowApiKey={onToggleShowWhatsappApiKey}
                    onToggle={onToggle}
                    onTestPhoneChange={onTestPhoneChange}
                    onTestWhatsapp={onTestWhatsapp}
                    onCheckStatus={onCheckWaStatus}
                    onGetQr={onGetWaQr}
                    onLogoutWa={onLogoutWa}
                    onSave={() => onSaveGroup('whatsapp')}
                />
            )}

            {notificationTab === 'telegram' && (
                <TelegramSettingsForm
                    telegram={telegram}
                    showTelegramToken={showTelegramToken}
                    isTesting={isTesting}
                    processing={processing}
                    onUpdateField={onUpdateTelegram}
                    onToggleShowToken={onToggleShowTelegramToken}
                    onToggle={onToggle}
                    onTestTelegram={onTestTelegram}
                    onSave={() => onSaveGroup('telegram')}
                />
            )}
        </div>
    );
}
