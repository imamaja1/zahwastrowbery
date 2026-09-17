<?php

namespace App\Services;

use App\Models\ProductVariant;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockMutation;
use App\Models\User;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    /**
     * Process order checkout with strict backend price and stock validation.
     *
     * @param  array{
     *     customer_name: string,
     *     customer_phone: string,
     *     customer_address?: string|null,
     *     payment_method: string,
     *     notes?: string|null,
     *     items: array<array{variant_id: int, quantity: float}>
     * }  $data
     *
     * @throws ValidationException|Exception
     */
    public function createOrder(array $data, ?User $user = null, $paymentProofFile = null): Sale
    {
        return DB::transaction(function () use ($data, $user, $paymentProofFile) {
            $itemsData = $data['items'] ?? [];
            if (empty($itemsData)) {
                throw ValidationException::withMessages([
                    'items' => 'Keranjang belanja masih kosong.',
                ]);
            }

            $totalAmount = 0.0;
            $saleItemsToCreate = [];

            foreach ($itemsData as $item) {
                $variantId = (int) ($item['variant_id'] ?? 0);
                $quantity = (float) ($item['quantity'] ?? 1);

                if ($quantity <= 0) {
                    continue;
                }

                /** @var ProductVariant|null $variant */
                $variant = ProductVariant::with(['product', 'packagingType', 'size', 'unit'])
                    ->lockForUpdate()
                    ->find($variantId);

                if (! $variant || ! $variant->is_active || ! $variant->product || ! $variant->product->is_active) {
                    throw ValidationException::withMessages([
                        'items' => 'Produk atau varian tidak ditemukan atau sudah tidak aktif.',
                    ]);
                }

                if ($variant->stock < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => "Stok untuk {$variant->product->name} ({$variant->variant_label}) tidak mencukupi. Sisa stok: {$variant->stock} {$variant->unit->symbol}.",
                    ]);
                }

                $price = (float) $variant->price;
                $subtotal = $price * $quantity;
                $totalAmount += $subtotal;

                // Reduce variant stock
                $stockBefore = (float) $variant->stock;
                $variant->stock -= $quantity;
                $variant->save();

                StockMutation::create([
                    'product_variant_id' => $variant->id,
                    'user_id' => $user?->id,
                    'type' => 'SALE',
                    'quantity' => $quantity,
                    'stock_before' => $stockBefore,
                    'stock_after' => (float) $variant->stock,
                    'reference_number' => 'SALE-CHECKOUT',
                    'notes' => "Pengurangan stok pesanan pelanggan {$variant->variant_label}",
                ]);

                $saleItemsToCreate[] = [
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product->name,
                    'variant_name' => $variant->variant_label,
                    'quantity' => $quantity,
                    'price' => $price,
                    'subtotal' => $subtotal,
                ];
            }

            // Generate unique, collision-proof invoice number: INV-YYYYMMDD-XXXX
            $datePrefix = Carbon::now()->format('Ymd');
            $lastInvoice = Sale::where('invoice_number', 'like', "INV-{$datePrefix}-%")
                ->orderByDesc('id')
                ->value('invoice_number');

            $sequence = 1;
            if ($lastInvoice) {
                $parts = explode('-', $lastInvoice);
                $lastSeq = (int) end($parts);
                $sequence = $lastSeq + 1;
            }

            do {
                $invoiceNumber = sprintf('INV-%s-%04d', $datePrefix, $sequence);
                $sequence++;
            } while (Sale::where('invoice_number', $invoiceNumber)->exists());

            // Determine initial status based on payment method
            $paymentMethod = strtoupper($data['payment_method']);
            $proofPath = null;

            if ($paymentProofFile) {
                $proofPath = $paymentProofFile->store('payment_proofs', 'public');
            }

            $paymentStatus = Sale::STATUS_PENDING;
            if (in_array($paymentMethod, ['QRIS', 'TRANSFER']) && $proofPath) {
                $paymentStatus = Sale::STATUS_WAITING_VERIFICATION;
            } elseif ($paymentMethod === 'COD') {
                $paymentStatus = Sale::STATUS_PENDING;
            }

            $sale = Sale::create([
                'user_id' => $user?->id,
                'invoice_number' => $invoiceNumber,
                'customer_name' => $data['customer_name'] ?? ($user?->name ?? 'Pelanggan'),
                'customer_phone' => $data['customer_phone'] ?? ($user?->phone ?? '-'),
                'customer_address' => $data['customer_address'] ?? null,
                'total_amount' => $totalAmount,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentStatus,
                'payment_proof' => $proofPath,
                'notes' => $data['notes'] ?? null,
                'expired_at' => Carbon::now()->addHours(24),
            ]);

            foreach ($saleItemsToCreate as $itemData) {
                $itemData['sale_id'] = $sale->id;
                SaleItem::create($itemData);
            }

            return $sale;
        });
    }
}
