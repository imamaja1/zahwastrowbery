<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Carbon;
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

        // 7-day dynamic sales trend for realtime chart
        $salesTrend = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);
            $dateStr = $date->toDateString();
            $total = (float) Sale::where('payment_status', Sale::STATUS_PAID)
                ->whereDate('created_at', $dateStr)
                ->sum('total_amount');
            $count = Sale::where('payment_status', Sale::STATUS_PAID)
                ->whereDate('created_at', $dateStr)
                ->count();

            return [
                'date' => $dateStr,
                'day_name' => $date->translatedFormat('D'),
                'label' => $daysAgo === 0 ? 'Hari Ini' : ($daysAgo === 1 ? 'Kemarin' : $date->format('d/m')),
                'total' => $total,
                'count' => $count,
            ];
        })->values()->all();

        // Monthly sales data for graph (Compatible with MySQL, PostgreSQL, and SQLite)
        $monthExpr = match (DB::getDriverName()) {
            'sqlite' => "strftime('%m', created_at)",
            'pgsql' => "to_char(created_at, 'MM')",
            default => "DATE_FORMAT(created_at, '%m')",
        };

        $monthlySales = Sale::selectRaw("{$monthExpr} as month, sum(total_amount) as total")
            ->where('payment_status', Sale::STATUS_PAID)
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('total', 'month')
            ->all();

        // Top selling products (only paid transactions)
        $topProducts = SaleItem::select(
            'sale_items.product_name',
            DB::raw('SUM(sale_items.quantity) as total_qty'),
            DB::raw('SUM(sale_items.subtotal) as total_rev')
        )
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->where('sales.payment_status', Sale::STATUS_PAID)
            ->groupBy('sale_items.product_name')
            ->orderByDesc('total_qty')
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'name' => $item->product_name,
                'total_qty' => (float) $item->total_qty,
                'total_revenue' => (float) $item->total_rev,
            ]);

        // Recent sales with pagination for dashboard feed
        $recentSales = Sale::with('items')
            ->latest()
            ->paginate(5)
            ->withQueryString()
            ->through(fn ($sale) => [
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
            'sales_trend' => $salesTrend,
            'monthly_sales' => $monthlySales,
        ]);
    }
}
