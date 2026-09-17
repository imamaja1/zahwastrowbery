import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { SettingsProps } from './types';
import { useSettingsForm } from './hooks/useSettingsForm';
import PaymentSettingsSection from './components/PaymentSettingsSection';
import GoogleSettingsSection from './components/GoogleSettingsSection';
import NotificationsSection from './components/NotificationsSection';

export default function AdminSettingsIndex({ settings }: SettingsProps) {
    const {
        mainTab,
        setMainTab,
        notificationTab,
        setNotificationTab,
        showGoogleSecret,
        setShowGoogleSecret,
        showSmtpPassword,
        setShowSmtpPassword,
        showTelegramToken,
        setShowTelegramToken,
        showWhatsappApiKey,
        setShowWhatsappApiKey,
        testEmail,
        setTestEmail,
        testWhatsappPhone,
        setTestWhatsappPhone,
        isTesting,
        qrisFile,
        qrisPreview,
        setQrisPreview,
        data,
        setData,
        processing,
        handleSaveGroup,
        handleQuickToggle,
        handleCopyRedirectUri,
        handleQrisFileChange,
        handleTestSmtp,
        handleTestTelegram,
        handleTestWhatsapp,
        waStatus,
        waQrCode,
        isCheckingWa,
        isLoggingOutWa,
        isRegisteringWa,
        handleCheckWaStatus,
        handleGetWaQr,
        handleLogoutWa,
        handleRegisterWa,
        activePaymentCount,
    } = useSettingsForm(settings);

    return (
        <AdminLayout title="Pengaturan Sistem">
            <Head title="Pengaturan Sistem - Admin ZahwaStrowbery" />

            <div className="flex flex-col gap-3">
                {/* Header Title */}
                <div className="flex items-center justify-between px-1">
                    <div>
                        <h1 className="font-extrabold text-sm sm:text-base text-zinc-900 tracking-tight leading-tight">
                            Pengaturan Sistem & Integrasi
                        </h1>
                        <p className="text-[11px] text-zinc-500">
                            Kelola metode pembayaran, akses login Google, dan gateway notifikasi
                        </p>
                    </div>
                </div>

                {/* 3 Main Categories Header */}
                <div className="bg-zinc-200/80 p-1 rounded-2xl flex items-center gap-1 shadow-2xs">
                    {/* 1. Pembayaran */}
                    <button
                        type="button"
                        onClick={() => setMainTab('payment')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            mainTab === 'payment'
                                ? 'bg-white text-zinc-900 shadow-xs'
                                : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[17px] text-amber-600">payments</span>
                        <span>Pembayaran</span>
                        {activePaymentCount > 0 && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-extrabold">
                                {activePaymentCount}
                            </span>
                        )}
                    </button>

                    {/* 2. Login Google */}
                    <button
                        type="button"
                        onClick={() => setMainTab('google')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            mainTab === 'google'
                                ? 'bg-white text-zinc-900 shadow-xs'
                                : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                    >
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span>Login Google</span>
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${
                                data.google.google_auth_is_active ? 'bg-emerald-500' : 'bg-zinc-400'
                            }`}
                        />
                    </button>

                    {/* 3. Notifikasi */}
                    <button
                        type="button"
                        onClick={() => setMainTab('notifications')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            mainTab === 'notifications'
                                ? 'bg-white text-zinc-900 shadow-xs'
                                : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[17px] text-rose-600">notifications</span>
                        <span>Notifikasi</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 font-extrabold">
                            3
                        </span>
                    </button>
                </div>

                {/* 1. Tab Pembayaran */}
                {mainTab === 'payment' && (
                    <PaymentSettingsSection
                        payment={data.payment}
                        activePaymentCount={activePaymentCount}
                        qrisFile={qrisFile}
                        qrisPreview={qrisPreview}
                        processing={processing}
                        onUpdateField={(field, val) =>
                            setData('payment', { ...data.payment, [field]: val })
                        }
                        onToggle={handleQuickToggle}
                        onQrisFileChange={handleQrisFileChange}
                        onSetQrisPreview={setQrisPreview}
                        onSave={() => handleSaveGroup('payment')}
                    />
                )}

                {/* 2. Tab Google */}
                {mainTab === 'google' && (
                    <GoogleSettingsSection
                        google={data.google}
                        showGoogleSecret={showGoogleSecret}
                        processing={processing}
                        onUpdateField={(field, val) =>
                            setData('google', { ...data.google, [field]: val })
                        }
                        onToggleShowSecret={() => setShowGoogleSecret(!showGoogleSecret)}
                        onToggle={handleQuickToggle}
                        onCopyRedirectUri={handleCopyRedirectUri}
                        onSave={() => handleSaveGroup('google')}
                    />
                )}

                {/* 3. Tab Notifikasi */}
                {mainTab === 'notifications' && (
                    <NotificationsSection
                        notificationTab={notificationTab}
                        setNotificationTab={setNotificationTab}
                        smtp={data.smtp}
                        whatsapp={data.whatsapp}
                        telegram={data.telegram}
                        showSmtpPassword={showSmtpPassword}
                        showWhatsappApiKey={showWhatsappApiKey}
                        showTelegramToken={showTelegramToken}
                        testEmail={testEmail}
                        testWhatsappPhone={testWhatsappPhone}
                        isTesting={isTesting}
                        processing={processing}
                        waStatus={waStatus}
                        waQrCode={waQrCode}
                        isCheckingWa={isCheckingWa}
                        isLoggingOutWa={isLoggingOutWa}
                        isRegisteringWa={isRegisteringWa}
                        onUpdateSmtp={(field, val) =>
                            setData('smtp', { ...data.smtp, [field]: val })
                        }
                        onUpdateWhatsapp={(field, val) =>
                            setData('whatsapp', { ...data.whatsapp, [field]: val })
                        }
                        onUpdateTelegram={(field, val) =>
                            setData('telegram', { ...data.telegram, [field]: val })
                        }
                        onToggleShowSmtpPassword={() => setShowSmtpPassword(!showSmtpPassword)}
                        onToggleShowWhatsappApiKey={() => setShowWhatsappApiKey(!showWhatsappApiKey)}
                        onToggleShowTelegramToken={() => setShowTelegramToken(!showTelegramToken)}
                        onToggle={handleQuickToggle}
                        onTestEmailChange={setTestEmail}
                        onTestPhoneChange={setTestWhatsappPhone}
                        onTestSmtp={handleTestSmtp}
                        onTestWhatsapp={handleTestWhatsapp}
                        onTestTelegram={handleTestTelegram}
                        onCheckWaStatus={handleCheckWaStatus}
                        onGetWaQr={handleGetWaQr}
                        onLogoutWa={handleLogoutWa}
                        onRegisterWa={handleRegisterWa}
                        onSaveGroup={handleSaveGroup}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
