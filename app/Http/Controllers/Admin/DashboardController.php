<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalSalesRevenue = (float) Sale::where('payment_status', Sale::STATUS_PAID)->sum('total_amount');
        $totalTransactionsCount = Sale::count();
        $totalProductsSold = (float) SaleItem::join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->where('sales.payment_status', Sale::STATUS_PAID)
            ->sum('sale_items.quantity');

        $pendingVerificationCount = Sale::where('payment_status', Sale::STATUS_WAITING_VERIFICATION)->count();

        // Recent pending verification transactions for immediate action in dashboard
        $pendingVerifications = Sale::where('payment_status', Sale::STATUS_WAITING_VERIFICATION)
            ->with('items')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($sale) => [
                'id' => $sale->id,
                'invoice_number' => $sale->invoice_number,
                'customer_name' => $sale->customer_name,
                'customer_phone' => $sale->customer_phone,
                'total_amount' => (float) $sale->total_amount,
                'payment_method' => $sale->payment_method,
                'payment_status' => $sale->payment_status,
                'payment_proof' => $sale->payment_proof ? (str_starts_with($sale->payment_proof, 'http') ? $sale->payment_proof : Storage::url($sale->payment_proof)) : null,
                'created_at' => $sale->created_at->format('d M Y, H:i'),
                'items_summary' => $sale->items->map(fn ($i) => "{$i->product_name} ({$i->variant_name}) × {$i->quantity}")->join(', '),
            ]);

        // Monthly sales data for graph
        $monthlySales = Sale::selectRaw("strftime('%m', created_at) as month, sum(total_amount) as total")
            ->where('payment_status', Sale::STATUS_PAID)
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('total', 'month')
            ->all();

        // Top selling products
        $topProducts = SaleItem::select('product_name', DB::raw('SUM(quantity) as total_qty'), DB::raw('SUM(subtotal) as total_rev'))
            ->groupBy('product_name')
            ->orderByDesc('total_qty')
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'name' => $item->product_name,
                'total_qty' => (float) $item->total_qty,
                'total_revenue' => (float) $item->total_rev,
            ]);

        // Recent sales for live activity feed
        $recentSales = Sale::with('items')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($sale) => [
                'id' => $sale->id,
                'invoice_number' => $sale->invoice_number,
                'customer_name' => $sale->customer_name,
                'customer_phone' => $sale->customer_phone,
                'total_amount' => (float) $sale->total_amount,
                'payment_method' => $sale->payment_method,
                'payment_status' => $sale->payment_status,
                'created_at' => $sale->created_at->format('d M, H:i'),
                'items_count' => $sale->items->count(),
                'items_summary' => $sale->items->map(fn ($i) => "{$i->product_name} × {$i->quantity}")->join(', '),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'total_revenue' => $totalSalesRevenue,
                'total_transactions' => $totalTransactionsCount,
                'total_products_sold' => $totalProductsSold,
                'pending_verifications_count' => $pendingVerificationCount,
            ],
            'pending_verifications' => $pendingVerifications,
            'recent_sales' => $recentSales,
            'top_products' => $topProducts,
            'monthly_sales' => $monthlySales,
        ]);
    }
}
