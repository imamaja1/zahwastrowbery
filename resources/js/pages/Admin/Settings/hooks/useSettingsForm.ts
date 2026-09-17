import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { useToast } from '@/components/ui/toast';
import { SettingsData, MainTab, NotificationSubTab } from '../types';

export function useSettingsForm(settings: SettingsData) {
    const { error: toastError, info } = useToast();

    const [mainTab, setMainTab] = useState<MainTab>('payment');
    const [notificationTab, setNotificationTab] = useState<NotificationSubTab>('smtp');

    const [showGoogleSecret, setShowGoogleSecret] = useState(false);
    const [showSmtpPassword, setShowSmtpPassword] = useState(false);
    const [showTelegramToken, setShowTelegramToken] = useState(false);
    const [showWhatsappApiKey, setShowWhatsappApiKey] = useState(false);

    const [testEmail, setTestEmail] = useState(settings.smtp.smtp_admin_email || 'admin@zahwastrowbery.com');
    const [testWhatsappPhone, setTestWhatsappPhone] = useState(settings.whatsapp.whatsapp_admin_number || '081234567890');
    const [isTesting, setIsTesting] = useState(false);

    const [qrisFile, setQrisFile] = useState<File | null>(null);
    const [qrisPreview, setQrisPreview] = useState<string | null>(settings.payment.payment_qris_image || null);

    const { data, setData, processing } = useForm({
        group: 'all',
        payment: { ...settings.payment },
        google: { ...settings.google },
        smtp: { ...settings.smtp },
        telegram: { ...settings.telegram },
        whatsapp: { ...settings.whatsapp },
    });

    const handleSaveGroup = (groupName: 'payment' | 'google' | 'smtp' | 'whatsapp' | 'telegram') => {
        const formData: any = {
            group: groupName,
            [groupName]: data[groupName],
        };

        if (groupName === 'payment' && qrisFile) {
            formData.qris_image_file = qrisFile;
        }

        router.post('/admin/settings', formData, {
            preserveScroll: true,
            forceFormData: groupName === 'payment' && Boolean(qrisFile),
            onError: () => {
                toastError('Gagal menyimpan konfigurasi. Silakan periksa kembali.');
            },
        });
    };

    const handleQuickToggle = (key: string, group: string, currentValue: boolean) => {
        if (group === 'payment') {
            setData('payment', { ...data.payment, [key]: !currentValue } as any);
        } else if (group === 'google') {
            setData('google', { ...data.google, [key]: !currentValue } as any);
        } else if (group === 'smtp') {
            setData('smtp', { ...data.smtp, [key]: !currentValue } as any);
        } else if (group === 'whatsapp') {
            setData('whatsapp', { ...data.whatsapp, [key]: !currentValue } as any);
        } else if (group === 'telegram') {
            setData('telegram', { ...data.telegram, [key]: !currentValue } as any);
        }

        router.post('/admin/settings/toggle', { key, group }, {
            preserveScroll: true,
            onError: () => {
                toastError('Gagal memperbarui status toggle.');
            },
        });
    };

    const handleCopyRedirectUri = () => {
        navigator.clipboard.writeText(data.google.google_redirect_uri);
        info('Authorized Redirect URI berhasil disalin ke clipboard!');
    };

    const handleQrisFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setQrisFile(file);
            setQrisPreview(URL.createObjectURL(file));
        }
    };

    const handleTestSmtp = (e: React.FormEvent) => {
        e.preventDefault();
        setIsTesting(true);
        router.post('/admin/settings/test-smtp', { test_email: testEmail }, {
            preserveScroll: true,
            onFinish: () => setIsTesting(false),
            onError: (err) => {
                toastError(Object.values(err)[0] || 'Gagal mengirim email uji coba.');
            },
        });
    };

    const handleTestTelegram = () => {
        setIsTesting(true);
        router.post('/admin/settings/test-telegram', {}, {
            preserveScroll: true,
            onFinish: () => setIsTesting(false),
            onError: (err) => {
                toastError(Object.values(err)[0] || 'Gagal mengirim pesan ke Telegram.');
            },
        });
    };

    const handleTestWhatsapp = (e: React.FormEvent) => {
        e.preventDefault();
        setIsTesting(true);
        router.post('/admin/settings/test-whatsapp', { test_phone: testWhatsappPhone }, {
            preserveScroll: true,
            onFinish: () => setIsTesting(false),
            onError: (err) => {
                toastError(Object.values(err)[0] || 'Gagal mengirim WhatsApp uji coba.');
            },
        });
    };

    const [waStatus, setWaStatus] = useState<{
        state: string;
        isReady: boolean;
        phoneNumber: string | null;
        lastError: string | null;
    } | null>(null);
    const [waQrCode, setWaQrCode] = useState<string | null>(null);
    const [isCheckingWa, setIsCheckingWa] = useState(false);
    const [isLoggingOutWa, setIsLoggingOutWa] = useState(false);

    const handleCheckWaStatus = async () => {
        setIsCheckingWa(true);
        try {
            const res = await fetch('/admin/settings/whatsapp/status', {
                headers: { Accept: 'application/json' },
            });
            const json = await res.json();
            if (json.success) {
                setWaStatus({
                    state: json.state,
                    isReady: json.isReady,
                    phoneNumber: json.phoneNumber,
                    lastError: json.lastError,
                });
                if (json.isReady) {
                    setWaQrCode(null);
                }
            } else {
                toastError(json.message || 'Gagal memeriksa status WhatsApp.');
            }
        } catch (e: any) {
            toastError('Gagal memeriksa status: ' + e.message);
        } finally {
            setIsCheckingWa(false);
        }
    };

    const handleGetWaQr = async () => {
        setIsCheckingWa(true);
        try {
            const res = await fetch('/admin/settings/whatsapp/qr', {
                headers: { Accept: 'application/json' },
            });
            const json = await res.json();
            if (json.success && json.qr) {
                setWaQrCode(json.qr);
                info('QR Code berhasil dimuat. Buka WA di HP Anda dan scan QR ini.');
            } else {
                toastError(json.message || 'Gagal memuat QR code WhatsApp.');
            }
        } catch (e: any) {
            toastError('Gagal memuat QR code: ' + e.message);
        } finally {
            setIsCheckingWa(false);
        }
    };

    const handleLogoutWa = async () => {
        setIsLoggingOutWa(true);
        try {
            const res = await fetch('/admin/settings/whatsapp/logout', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
            const json = await res.json();
            if (json.success) {
                info(json.message);
                setWaStatus({
                    state: 'logged_out',
                    isReady: false,
                    phoneNumber: null,
                    lastError: null,
                });
                setWaQrCode(null);
            } else {
                toastError(json.message || 'Gagal logout WhatsApp.');
            }
        } catch (e: any) {
            toastError('Gagal logout: ' + e.message);
        } finally {
            setIsLoggingOutWa(false);
        }
    };

    const [isRegisteringWa, setIsRegisteringWa] = useState(false);

    const handleRegisterWa = async (phoneNumber: string) => {
        if (!phoneNumber) {
            toastError('Silakan masukkan nomor pengirim WhatsApp terlebih dahulu.');
            return;
        }

        setIsRegisteringWa(true);
        try {
            const res = await fetch('/admin/settings/whatsapp/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ phone_number: phoneNumber }),
            });
            const json = await res.json();
            if (json.success) {
                info(json.message);
                handleGetWaQr();
            } else {
                toastError(json.message || 'Gagal mendaftarkan nomor WhatsApp.');
            }
        } catch (e: any) {
            toastError('Gagal mendaftarkan nomor: ' + e.message);
        } finally {
            setIsRegisteringWa(false);
        }
    };

    const activePaymentCount =
        (data.payment.payment_qris_is_active ? 1 : 0) +
        (data.payment.payment_transfer_is_active ? 1 : 0) +
        (data.payment.payment_cod_is_active ? 1 : 0);

    return {
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
        setWaQrCode,
        isCheckingWa,
        isLoggingOutWa,
        isRegisteringWa,
        handleCheckWaStatus,
        handleGetWaQr,
        handleLogoutWa,
        handleRegisterWa,
        activePaymentCount,
    };
}
