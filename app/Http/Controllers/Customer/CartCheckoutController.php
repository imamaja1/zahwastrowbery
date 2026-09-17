<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\CheckoutService;
use App\Services\WhatsAppService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CartCheckoutController extends Controller
{
    public function __construct(
        protected CheckoutService $checkoutService,
        protected WhatsAppService $whatsAppService
    ) {}

    public function index(): Response
    {
        $allSettings = Setting::all()->pluck('value', 'key')->toArray();

        $paymentSettings = [
            'qris' => [
                'is_active' => ($allSettings['payment_qris_is_active'] ?? '1') === '1',
                'name' => $allSettings['payment_qris_name'] ?? 'QRIS Zahwa Strowbery',
                'image_url' => $allSettings['payment_qris_image'] ?? '',
                'instructions' => $allSettings['payment_qris_instructions'] ?? 'Scan kode QRIS menggunakan GoPay, OVO, Dana, ShopeePay, LinkAja, atau Mobile Banking Anda.',
            ],
            'transfer' => [
                'is_active' => ($allSettings['payment_transfer_is_active'] ?? '1') === '1',
                'bank_name' => $allSettings['payment_transfer_bank_name'] ?? 'BCA',
                'account_number' => $allSettings['payment_transfer_account_number'] ?? '5220304050',
                'account_holder' => $allSettings['payment_transfer_account_holder'] ?? 'CV Zahwa Strowbery',
                'instructions' => $allSettings['payment_transfer_instructions'] ?? 'Transfer tepat sesuai nominal tagihan ke rekening bank di atas, lalu konfirmasi pesanan Anda.',
            ],
            'cod' => [
                'is_active' => ($allSettings['payment_cod_is_active'] ?? '1') === '1',
                'instructions' => $allSettings['payment_cod_instructions'] ?? 'Bayar tunai kepada kurir kami saat buah segar sampai di alamat tujuan Anda.',
            ],
        ];

        return Inertia::render('Customer/Cart/Checkout', [
            'user' => Auth::user(),
            'payment_settings' => $paymentSettings,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        if (! Auth::check()) {
            return back()->withErrors([
                'auth' => 'Silakan masuk / login terlebih dahulu untuk melakukan pemesanan.',
            ]);
        }

        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:50'],
            'customer_address' => ['nullable', 'string', 'max:500'],
            'payment_method' => ['required', 'string', 'in:QRIS,COD,TRANSFER'],
            'notes' => ['nullable', 'string', 'max:500'],
            'payment_proof' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'], // max 5MB
            'items' => ['required', 'array', 'min:1'],
            'items.*.variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001'],
        ], [
            'items.required' => 'Keranjang belanja tidak boleh kosong.',
            'payment_proof.mimes' => 'Format foto bukti pembayaran harus berupa JPG, PNG, atau WEBP.',
            'payment_proof.max' => 'Ukuran file foto bukti maksimal 5MB.',
        ]);

        $methodKey = match ($validated['payment_method']) {
            'QRIS' => 'payment_qris_is_active',
            'TRANSFER' => 'payment_transfer_is_active',
            'COD' => 'payment_cod_is_active',
            default => null,
        };

        if ($methodKey && Setting::get($methodKey, '1') !== '1') {
            return back()->withErrors([
                'payment_method' => 'Metode pembayaran '.$validated['payment_method'].' sedang dinonaktifkan oleh toko. Silakan pilih metode pembayaran lain.',
            ])->withInput();
        }

        $proofFile = $request->file('payment_proof');

        try {
            $sale = $this->checkoutService->createOrder(
                $validated,
                Auth::user(),
                $proofFile
            );

            // Trigger WhatsApp Notifications (Customer & Admin)
            try {
                $this->whatsAppService->sendOrderNotifications($sale);
            } catch (\Throwable $waErr) {
                Log::warning('Failed sending WhatsApp notification on checkout: '.$waErr->getMessage());
            }

            return redirect()->route('orders.show', $sale->invoice_number)
                ->with('success', 'Pesanan Anda berhasil dibuat dengan invoice: '.$sale->invoice_number);
        } catch (\Throwable $e) {
            return back()->withErrors([
                'items' => $e->getMessage(),
            ])->withInput();
        }
    }
}
