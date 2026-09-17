<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Get configured Base URL for WhatsApp Gateway.
     */
    public function getBaseUrl(): string
    {
        $url = Setting::get('whatsapp_base_url', 'https://otomasi.punyaku.online');

        return rtrim($url ?: 'https://otomasi.punyaku.online', '/');
    }

    /**
     * Get configured API Key for WhatsApp Gateway.
     */
    public function getApiKey(): ?string
    {
        return Setting::get('whatsapp_api_key');
    }

    /**
     * Check if WhatsApp service is enabled in settings.
     */
    public function isEnabled(): bool
    {
        return Setting::get('whatsapp_is_active', '1') === '1';
    }

    /**
     * Normalize phone number to standard 628xxx format.
     * Converts:
     * - "081234567890" -> "6281234567890"
     * - "+6281234567890" -> "6281234567890"
     * - "81234567890" -> "6281234567890"
     * - "6281234567890" -> "6281234567890"
     */
    public function normalizePhoneNumber(?string $phone): ?string
    {
        if (! $phone) {
            return null;
        }

        // Remove all non-numeric characters (spaces, dashes, plus, parentheses)
        $clean = preg_replace('/[^\d]/', '', $phone);

        if (empty($clean)) {
            return null;
        }

        // If starts with 0, replace with 62
        if (str_starts_with($clean, '0')) {
            return '62'.substr($clean, 1);
        }

        // If starts with 8, add 62
        if (str_starts_with($clean, '8')) {
            return '62'.$clean;
        }

        // If starts with 62, keep as is
        if (str_starts_with($clean, '62')) {
            return $clean;
        }

        return $clean;
    }

    /**
     * Send WhatsApp message via Gateway API.
     *
     * @return array{success: bool, status: string, id: int|null, message: string}
     */
    public function sendMessage(string $to, string $message): array
    {
        $apiKey = $this->getApiKey();
        $baseUrl = $this->getBaseUrl();

        if (empty($apiKey)) {
            return [
                'success' => false,
                'status' => 'unconfigured',
                'id' => null,
                'message' => 'API Key WhatsApp belum dikonfigurasi di Pengaturan.',
            ];
        }

        $formattedTo = $this->normalizePhoneNumber($to);
        if (! $formattedTo) {
            return [
                'success' => false,
                'status' => 'invalid_number',
                'id' => null,
                'message' => 'Nomor telepon tujuan tidak valid.',
            ];
        }

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'x-api-key' => $apiKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->post("{$baseUrl}/api/v1/whatsapp/send", [
                    'to' => $formattedTo,
                    'message' => $message,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $status = $data['status'] ?? 'unknown';
                $id = $data['id'] ?? null;

                if ($status === 'sent') {
                    return [
                        'success' => true,
                        'status' => 'sent',
                        'id' => $id,
                        'message' => "Pesan berhasil terkirim ke {$formattedTo}",
                    ];
                }

                return [
                    'success' => false,
                    'status' => $status,
                    'id' => $id,
                    'message' => 'Pesan gagal dikirim oleh gateway (status: '.$status.'). Pastikan WhatsApp bot dalam keadaan aktif (Ready).',
                ];
            }

            $errorMessage = $response->json('message') ?? $response->body() ?? 'Terjadi kesalahan pada gateway WhatsApp.';

            return [
                'success' => false,
                'status' => 'error',
                'id' => null,
                'message' => "Gateway Error (HTTP {$response->status()}): {$errorMessage}",
            ];
        } catch (\Throwable $e) {
            Log::error('WhatsApp Gateway Exception: '.$e->getMessage(), [
                'to' => $formattedTo,
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'status' => 'exception',
                'id' => null,
                'message' => 'Gagal menghubungi server WhatsApp Gateway: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Check WhatsApp bot device status.
     *
     * @return array{success: bool, state: string, isReady: bool, phoneNumber: ?string, lastError: ?string, message: string}
     */
    public function getDeviceStatus(): array
    {
        $apiKey = $this->getApiKey();
        $baseUrl = $this->getBaseUrl();

        if (empty($apiKey)) {
            return [
                'success' => false,
                'state' => 'unconfigured',
                'isReady' => false,
                'phoneNumber' => null,
                'lastError' => null,
                'message' => 'API Key belum diisi.',
            ];
        }

        try {
            $response = Http::timeout(8)
                ->withHeaders([
                    'x-api-key' => $apiKey,
                    'Accept' => 'application/json',
                ])
                ->get("{$baseUrl}/api/v1/whatsapp/me");

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'success' => true,
                    'state' => $data['state'] ?? 'unknown',
                    'isReady' => (bool) ($data['isReady'] ?? false),
                    'phoneNumber' => $data['phoneNumber'] ?? null,
                    'lastError' => $data['lastError'] ?? null,
                    'message' => 'Status perangkat berhasil diperiksa.',
                ];
            }

            return [
                'success' => false,
                'state' => 'error',
                'isReady' => false,
                'phoneNumber' => null,
                'lastError' => $response->json('message') ?? $response->body(),
                'message' => "Gagal membaca status: HTTP {$response->status()}",
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'state' => 'exception',
                'isReady' => false,
                'phoneNumber' => null,
                'lastError' => $e->getMessage(),
                'message' => 'Gagal koneksi ke server gateway: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Get QR Code image as Base64 Data URI for pairing device.
     */
    public function getQrImageDataUri(): ?string
    {
        $apiKey = $this->getApiKey();
        $baseUrl = $this->getBaseUrl();

        if (empty($apiKey)) {
            return null;
        }

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'x-api-key' => $apiKey,
                ])
                ->get("{$baseUrl}/api/v1/whatsapp/me/qr-image");

            if ($response->successful()) {
                $imageBinary = $response->body();
                if (! empty($imageBinary)) {
                    return 'data:image/png;base64,'.base64_encode($imageBinary);
                }
            }

            return null;
        } catch (\Throwable $e) {
            Log::warning('WhatsApp QR Image Exception: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Register a new WhatsApp phone number to the application gateway (done once per app).
     *
     * @return array{success: bool, data: ?array, message: string}
     */
    public function registerNumber(string $phoneNumber): array
    {
        $apiKey = $this->getApiKey();
        $baseUrl = $this->getBaseUrl();

        if (empty($apiKey)) {
            return [
                'success' => false,
                'data' => null,
                'message' => 'API Key belum diisi di Pengaturan.',
            ];
        }

        $formattedPhone = $this->normalizePhoneNumber($phoneNumber);
        if (! $formattedPhone) {
            return [
                'success' => false,
                'data' => null,
                'message' => 'Nomor WhatsApp tidak valid.',
            ];
        }

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'x-api-key' => $apiKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->post("{$baseUrl}/api/v1/whatsapp/accounts", [
                    'phoneNumber' => $formattedPhone,
                ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                    'message' => "Nomor {$formattedPhone} berhasil didaftarkan ke gateway! Silakan lanjutkan dengan Scan QR Code.",
                ];
            }

            $errMsg = $response->json('message') ?? $response->body() ?? "HTTP {$response->status()}";

            return [
                'success' => false,
                'data' => null,
                'message' => "Gagal mendaftarkan nomor: {$errMsg}",
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'data' => null,
                'message' => 'Gagal koneksi ke server gateway: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Request logout for connected WhatsApp device.
     */
    public function logout(): array
    {
        $apiKey = $this->getApiKey();
        $baseUrl = $this->getBaseUrl();

        if (empty($apiKey)) {
            return [
                'success' => false,
                'message' => 'API Key belum diisi.',
            ];
        }

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'x-api-key' => $apiKey,
                ])
                ->post("{$baseUrl}/api/v1/whatsapp/me/logout");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Perangkat WhatsApp berhasil logout. Silakan scan QR ulang jika ingin menghubungkan kembali.',
                ];
            }

            return [
                'success' => false,
                'message' => 'Gagal logout: '.($response->json('message') ?? 'Respon tidak berhasil'),
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => 'Gagal menghubungi gateway: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Send WhatsApp notification for newly placed order to customer and admin.
     */
    public function sendOrderNotifications(Sale $sale): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        $sale->loadMissing(['items']);

        $itemsSummary = $sale->items->map(function ($item) {
            return "- {$item->product_name} ({$item->variant_name}) x{$item->quantity} = Rp ".number_format((float) $item->subtotal, 0, ',', '.');
        })->implode("\n");

        $formattedTotal = 'Rp '.number_format((float) $sale->total_amount, 0, ',', '.');

        // 1. Kirim Notifikasi ke Pelanggan
        if (Setting::get('whatsapp_notify_customer', '1') === '1' && ! empty($sale->customer_phone)) {
            $customerTemplate = Setting::get('whatsapp_order_template') ?: 'Halo {customer_name}! Pesanan Anda #{invoice_number} sebesar {total_amount} telah kami terima. Terima kasih telah berbelanja buah segar di ZahwaStrowbery.';
            $customerMsg = str_replace(
                ['{customer_name}', '{invoice_number}', '{invoice}', '{total_amount}', '{total}', '{items}'],
                [$sale->customer_name, $sale->invoice_number, $sale->invoice_number, $formattedTotal, $formattedTotal, $itemsSummary],
                $customerTemplate
            );

            $this->sendMessage($sale->customer_phone, $customerMsg);
        }

        // 2. Kirim Notifikasi ke Penerima (Admin Toko)
        if (Setting::get('whatsapp_notify_admin', '1') === '1') {
            $adminPhone = Setting::get('whatsapp_admin_number');
            if (! empty($adminPhone)) {
                $adminMsg = "🍓 *[PESANAN BARU MASUK - ZAHWASTROWBERY]* 🍓\n\n"
                    ."Invoice: *{$sale->invoice_number}*\n"
                    ."Pelanggan: {$sale->customer_name} ({$sale->customer_phone})\n"
                    ."Metode Pembayaran: {$sale->payment_method}\n"
                    ."Total Pembayaran: *{$formattedTotal}*\n\n"
                    ."Rincian Pesanan:\n{$itemsSummary}\n\n"
                    ."Alamat Pengiriman:\n".($sale->customer_address ?: '-')."\n\n"
                    .'Catatan: '.($sale->notes ?: '-')."\n"
                    .'Waktu Pesan: '.now()->format('d M Y H:i:s')."\n\n"
                    .'Silakan masuk ke panel admin untuk memproses pesanan ini.';

                $this->sendMessage($adminPhone, $adminMsg);
            }
        }
    }
}
