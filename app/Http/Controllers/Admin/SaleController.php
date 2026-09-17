<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $query = Sale::with('items')->latest();

        if ($status && $status !== 'ALL') {
            $query->where('payment_status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%")
                    ->orWhere('payment_method', 'like', "%{$search}%")
                    ->orWhereHas('items', function ($itemQuery) use ($search) {
                        $itemQuery->where('product_name', 'like', "%{$search}%")
                            ->orWhere('variant_name', 'like', "%{$search}%");
                    });
            });
        }

        $sales = $query->paginate(10)->withQueryString()->through(function ($sale) {
            return [
                'id' => $sale->id,
                'invoice_number' => $sale->invoice_number,
                'customer_name' => $sale->customer_name,
                'customer_phone' => $sale->customer_phone,
                'customer_address' => $sale->customer_address,
                'total_amount' => (float) $sale->total_amount,
                'payment_method' => $sale->payment_method,
                'payment_status' => $sale->payment_status,
                'payment_proof' => $sale->payment_proof ? (str_starts_with($sale->payment_proof, 'http') ? $sale->payment_proof : Storage::url($sale->payment_proof)) : null,
                'notes' => $sale->notes,
                'rejection_reason' => $sale->rejection_reason,
                'paid_at' => $sale->paid_at ? $sale->paid_at->format('d M Y, H:i') : null,
                'created_at' => $sale->created_at->format('d M Y, H:i'),
                'items_count' => $sale->items->count(),
                'items' => $sale->items->map(fn ($i) => [
                    'product_name' => $i->product_name,
                    'variant_name' => $i->variant_name,
                    'quantity' => (float) $i->quantity,
                    'price' => (float) $i->price,
                    'subtotal' => (float) $i->subtotal,
                ]),
            ];
        });

        return Inertia::render('Admin/Sales/Index', [
            'sales' => $sales,
            'currentStatus' => $status ?? 'ALL',
            'searchQuery' => $search,
        ]);
    }

    public function verify(Request $request, int $id): RedirectResponse
    {
        $sale = Sale::findOrFail($id);

        $validated = $request->validate([
            'action' => ['required', 'string', 'in:approve,reject'],
            'rejection_reason' => ['nullable', 'string', 'max:500'],
        ]);

        if ($validated['action'] === 'approve') {
            $sale->update([
                'payment_status' => Sale::STATUS_PAID,
                'paid_at' => Carbon::now(),
                'rejection_reason' => null,
            ]);

            return back()->with('success', "Pembayaran untuk invoice {$sale->invoice_number} berhasil disetujui.");
        }

        $sale->update([
            'payment_status' => Sale::STATUS_REJECTED,
            'rejection_reason' => $validated['rejection_reason'] ?? 'Bukti transfer tidak valid atau belum masuk ke mutasi bank.',
        ]);

        return back()->with('success', "Pembayaran untuk invoice {$sale->invoice_number} telah ditolak.");
    }
}
