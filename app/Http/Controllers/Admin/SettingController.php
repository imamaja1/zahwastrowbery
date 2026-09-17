<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\WhatsAppService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $allSettings = Setting::all()->pluck('value', 'key')->toArray();

        $settings = [
            'payment' => [
                'payment_qris_is_active' => ($allSettings['payment_qris_is_active'] ?? '1') === '1',
                'payment_qris_name' => $allSettings['payment_qris_name'] ?? 'QRIS Zahwa Strowbery',
                'payment_qris_image' => $allSettings['payment_qris_image'] ?? '',
                'payment_qris_instructions' => $allSettings['payment_qris_instructions'] ?? 'Scan kode QRIS menggunakan GoPay, OVO, Dana, ShopeePay, LinkAja, atau Mobile Banking Anda.',
                'payment_transfer_is_active' => ($allSettings['payment_transfer_is_active'] ?? '1') === '1',
                'payment_transfer_bank_name' => $allSettings['payment_transfer_bank_name'] ?? 'BCA',
                'payment_transfer_account_number' => $allSettings['payment_transfer_account_number'] ?? '5220304050',
                'payment_transfer_account_holder' => $allSettings['payment_transfer_account_holder'] ?? 'CV Zahwa Strowbery',
                'payment_transfer_instructions' => $allSettings['payment_transfer_instructions'] ?? 'Transfer tepat sesuai nominal tagihan ke rekening bank di atas, lalu konfirmasi pesanan Anda.',
                'payment_cod_is_active' => ($allSettings['payment_cod_is_active'] ?? '1') === '1',
                'payment_cod_instructions' => $allSettings['payment_cod_instructions'] ?? 'Bayar tunai kepada kurir kami saat buah segar sampai di alamat tujuan Anda.',
            ],
            'google' => [
                'google_auth_is_active' => ($allSettings['google_auth_is_active'] ?? '1') === '1',
                'google_client_id' => $allSettings['google_client_id'] ?? env('GOOGLE_CLIENT_ID', ''),
                'google_client_secret' => $allSettings['google_client_secret'] ?? env('GOOGLE_CLIENT_SECRET', ''),
                'google_redirect_uri' => $allSettings['google_redirect_uri'] ?? url('/auth/google/callback'),
            ],
            'smtp' => [
                'smtp_host' => $allSettings['smtp_host'] ?? 'smtp.gmail.com',
                'smtp_port' => $allSettings['smtp_port'] ?? '587',
                'smtp_encryption' => $allSettings['smtp_encryption'] ?? 'tls',
                'smtp_username' => $allSettings['smtp_username'] ?? 'zahwastrowbery@gmail.com',
                'smtp_password' => $allSettings['smtp_password'] ?? '',
                'smtp_from_address' => $allSettings['smtp_from_address'] ?? 'zahwastrowbery@gmail.com',
                'smtp_from_name' => $allSettings['smtp_from_name'] ?? 'ZahwaStrowbery Store',
                'smtp_admin_email' => $allSettings['smtp_admin_email'] ?? 'admin@zahwastrowbery.com',
                'smtp_is_active' => ($allSettings['smtp_is_active'] ?? '1') === '1',
            ],
            'telegram' => [
                'telegram_bot_token' => $allSettings['telegram_bot_token'] ?? '',
                'telegram_chat_id' => $allSettings['telegram_chat_id'] ?? '',
                'telegram_notify_new_order' => ($allSettings['telegram_notify_new_order'] ?? '1') === '1',
                'telegram_notify_payment_uploaded' => ($allSettings['telegram_notify_payment_uploaded'] ?? '1') === '1',
                'telegram_notify_low_stock' => ($allSettings['telegram_notify_low_stock'] ?? '1') === '1',
                'telegram_is_active' => ($allSettings['telegram_is_active'] ?? '1') === '1',
            ],
            'whatsapp' => [
                'whatsapp_base_url' => $allSettings['whatsapp_base_url'] ?? 'https://otomasi.punyaku.online',
                'whatsapp_provider' => $allSettings['whatsapp_provider'] ?? 'otomasi',
                'whatsapp_api_key' => $allSettings['whatsapp_api_key'] ?? '',
                'whatsapp_sender_number' => $allSettings['whatsapp_sender_number'] ?? '081234567890',
                'whatsapp_admin_number' => $allSettings['whatsapp_admin_number'] ?? '081234567890',
                'whatsapp_notify_customer' => ($allSettings['whatsapp_notify_customer'] ?? '1') === '1',
                'whatsapp_notify_admin' => ($allSettings['whatsapp_notify_admin'] ?? '1') === '1',
                'whatsapp_order_template' => $allSettings['whatsapp_order_template'] ?? 'Halo {customer_name}! Pesanan Anda #{invoice_number} sebesar {total_amount} telah kami terima. Terima kasih telah berbelanja buah segar di ZahwaStrowbery.',
                'whatsapp_is_active' => ($allSettings['whatsapp_is_active'] ?? '1') === '1',
            ],
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $group = $request->input('group', 'all');

        if ($group === 'payment' || $group === 'all') {
            $paymentData = $request->input('payment', []);
            foreach ($paymentData as $key => $value) {
                Setting::set($key, $value, 'payment');
            }

            if ($request->hasFile('qris_image_file')) {
                $file = $request->file('qris_image_file');
                $path = $file->store('qris', 'public');
                Setting::set('payment_qris_image', '/storage/'.$path, 'payment');
            }
        }

        if ($group === 'google' || $group === 'all') {
            $googleData = $request->input('google', []);
            foreach ($googleData as $key => $value) {
                Setting::set($key, $value, 'google');
            }
        }

        if ($group === 'smtp' || $group === 'all') {
            $smtpData = $request->input('smtp', []);
            foreach ($smtpData as $key => $value) {
                Setting::set($key, $value, 'smtp');
            }
        }

        if ($group === 'telegram' || $group === 'all') {
            $telegramData = $request->input('telegram', []);
            foreach ($telegramData as $key => $value) {
                Setting::set($key, $value, 'telegram');
            }
        }

        if ($group === 'whatsapp' || $group === 'all') {
            $whatsappData = $request->input('whatsapp', []);
            foreach ($whatsappData as $key => $value) {
                Setting::set($key, $value, 'whatsapp');
            }
        }

        $names = [
            'payment' => 'Konfigurasi Pembayaran',
            'google' => 'Konfigurasi Login Google',
            'smtp' => 'Konfigurasi SMTP Google',
            'telegram' => 'Konfigurasi Telegram Bot',
            'whatsapp' => 'Konfigurasi WhatsApp Gateway',
        ];
        $message = isset($names[$group]) ? "{$names[$group]} berhasil disimpan!" : 'Konfigurasi berhasil disimpan!';

        return back()->with('success', $message);
    }

    public function toggle(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'key' => ['required', 'string'],
            'group' => ['required', 'string'],
        ]);

        $current = Setting::get($validated['key'], '1');
        $new = $current === '1' ? '0' : '1';
        Setting::set($validated['key'], $new, $validated['group']);

        $statusText = $new === '1' ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with('success', "Status berhasil {$statusText}!");
    }

    public function testSmtp(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'test_email' => ['required', 'email'],
        ]);

        $recipient = $validated['test_email'];

        $host = Setting::get('smtp_host', 'smtp.gmail.com');
        $port = Setting::get('smtp_port', '587');
        $encryption = Setting::get('smtp_encryption', 'tls');
        $username = Setting::get('smtp_username');
        $password = Setting::get('smtp_password');
        $fromAddress = Setting::get('smtp_from_address') ?: $username ?: 'zahwastrowbery@gmail.com';
        $fromName = Setting::get('smtp_from_name', 'ZahwaStrowbery Store');

        if (! $username || ! $password) {
            return back()->with('error', 'Harap lengkapi Username dan Password / App Password SMTP terlebih dahulu.');
        }

        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.host' => $host,
            'mail.mailers.smtp.port' => (int) $port,
            'mail.mailers.smtp.encryption' => $encryption === 'none' ? null : $encryption,
            'mail.mailers.smtp.username' => $username,
            'mail.mailers.smtp.password' => $password,
            'mail.from.address' => $fromAddress,
            'mail.from.name' => $fromName,
        ]);

        try {
            Mail::raw("Halo!\n\nIni adalah email uji coba dari sistem konfigurasi SMTP Google ZahwaStrowbery.\n\nWaktu pengujian: ".now()->format('d M Y H:i:s')."\nStatus: SMTP Terhubung dengan Sukses!", function ($message) use ($recipient, $fromAddress, $fromName) {
                $message->to($recipient)
                    ->from($fromAddress, $fromName)
                    ->subject('[UJI COBA SMTP] ZahwaStrowbery Google Mail System');
            });

            return back()->with('success', "Email uji coba berhasil dikirim ke {$recipient}!");
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal mengirim email uji coba: '.$e->getMessage());
        }
    }

    public function testTelegram(Request $request): RedirectResponse
    {
        $botToken = Setting::get('telegram_bot_token');
        $chatId = Setting::get('telegram_chat_id');

        if (! $botToken || ! $chatId) {
            return back()->with('error', 'Harap isi Bot Token dan Chat ID Telegram terlebih dahulu.');
        }

        $message = "🍓 *[UJI COBA NOTIFIKASI TELEGRAM]* 🍓\n\nSistem notifikasi toko ZahwaStrowbery berhasil terhubung!\n⏰ Waktu: ".now()->format('d M Y H:i:s')."\n✅ Status Bot: AKTIF";

        try {
            $response = Http::timeout(5)->post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'Markdown',
            ]);

            if ($response->successful()) {
                return back()->with('success', 'Pesan uji coba Telegram berhasil dikirim ke Chat ID!');
            }

            return back()->with('error', 'Gagal mengirim ke Telegram: '.($response->json('description') ?? 'Periksa Token / Chat ID.'));
        } catch (\Exception $e) {
            return back()->with('error', 'Koneksi ke Telegram gagal: '.$e->getMessage());
        }
    }

    public function testWhatsapp(Request $request, WhatsAppService $whatsAppService): RedirectResponse
    {
        $validated = $request->validate([
            'test_phone' => ['required', 'string'],
        ]);

        $phone = $validated['test_phone'];
        $message = "🍓 *[UJI COBA WHATSAPP ZAHWASTROWBERY]* 🍓\n\nHalo! Ini adalah pesan uji coba dari Gateway WhatsApp toko ZahwaStrowbery.\n\nWaktu: ".now()->format('d M Y H:i:s')."\nStatus: Gateway Terhubung dengan Sukses!";

        $result = $whatsAppService->sendMessage($phone, $message);

        if ($result['success']) {
            return back()->with('success', "Pesan WhatsApp berhasil dikirim ke {$phone} (Status: {$result['status']})!");
        }

        return back()->with('error', $result['message']);
    }

    public function checkWhatsappStatus(WhatsAppService $whatsAppService): JsonResponse
    {
        $status = $whatsAppService->getDeviceStatus();

        return response()->json($status);
    }

    public function getWhatsappQr(WhatsAppService $whatsAppService): JsonResponse
    {
        $qrUri = $whatsAppService->getQrImageDataUri();

        if (! $qrUri) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil QR code atau perangkat sudah terhubung.',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'qr' => $qrUri,
        ]);
    }

    public function logoutWhatsapp(WhatsAppService $whatsAppService): RedirectResponse|JsonResponse
    {
        $result = $whatsAppService->logout();

        if (request()->wantsJson()) {
            return response()->json($result);
        }

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }

    public function registerWhatsappNumber(Request $request, WhatsAppService $whatsAppService): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'phone_number' => ['required', 'string'],
        ]);

        $result = $whatsAppService->registerNumber($validated['phone_number']);

        if (request()->wantsJson()) {
            return response()->json($result, $result['success'] ? 200 : 400);
        }

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }
}
