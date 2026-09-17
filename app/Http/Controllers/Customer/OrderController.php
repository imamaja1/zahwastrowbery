<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $orders = Sale::where('user_id', $user?->id)
            ->withCount('items')
            ->latest()
            ->paginate(10)
            ->through(function ($sale) {
                return [
                    'id' => $sale->id,
                    'invoice_number' => $sale->invoice_number,
                    'customer_name' => $sale->customer_name,
                    'total_amount' => (float) $sale->total_amount,
                    'payment_method' => $sale->payment_method,
                    'payment_status' => $sale->payment_status,
                    'created_at' => $sale->created_at->format('d M Y, H:i'),
                    'items_count' => $sale->items_count,
                ];
            });

        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(string $invoiceNumber): Response
    {
        $sale = Sale::where('invoice_number', $invoiceNumber)
            ->with('items')
            ->firstOrFail();

        // Check if authorized (if user is logged in, must match or be admin, or allow viewing recent invoice)
        if (Auth::check() && ! Auth::user()->isAdmin() && $sale->user_id && $sale->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses ke invoice ini.');
        }

        return Inertia::render('Customer/Orders/Show', [
            'sale' => [
                'id' => $sale->id,
                'invoice_number' => $sale->invoice_number,
                'customer_name' => $sale->customer_name,
                'customer_phone' => $sale->customer_phone,
                'customer_address' => $sale->customer_address,
                'total_amount' => (float) $sale->total_amount,
                'payment_method' => $sale->payment_method,
                'payment_status' => $sale->payment_status,
                'payment_proof' => $sale->payment_proof ? Storage::url($sale->payment_proof) : null,
                'notes' => $sale->notes,
                'rejection_reason' => $sale->rejection_reason,
                'paid_at' => $sale->paid_at ? $sale->paid_at->format('d M Y, H:i') : null,
                'created_at' => $sale->created_at->format('d M Y, H:i'),
                'items' => $sale->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'variant_name' => $item->variant_name,
                    'quantity' => (float) $item->quantity,
                    'price' => (float) $item->price,
                    'subtotal' => (float) $item->subtotal,
                ]),
            ],
        ]);
    }

    public function uploadProof(Request $request, string $invoiceNumber): RedirectResponse
    {
        $sale = Sale::where('invoice_number', $invoiceNumber)->firstOrFail();

        if (Auth::check() && ! Auth::user()->isAdmin() && $sale->user_id && $sale->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'payment_proof' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        $path = $request->file('payment_proof')->store('payment_proofs', 'public');

        $sale->update([
            'payment_proof' => $path,
            'payment_status' => Sale::STATUS_WAITING_VERIFICATION,
            'rejection_reason' => null,
        ]);

        return back()->with('success', 'Bukti pembayaran berhasil diupload dan sedang menunggu verifikasi admin.');
    }
}
