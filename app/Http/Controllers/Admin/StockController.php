<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StockMutation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ProductVariant::with([
            'product.category',
            'packagingType',
            'size',
            'unit',
        ]);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($p) use ($search) {
                        $p->where('name', 'like', "%{$search}%")
                            ->orWhereHas('category', function ($c) use ($search) {
                                $c->where('name', 'like', "%{$search}%");
                            });
                    })
                    ->orWhereHas('packagingType', function ($pkg) use ($search) {
                        $pkg->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('size', function ($sz) use ($search) {
                        $sz->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('unit', function ($u) use ($search) {
                        $u->where('name', 'like', "%{$search}%")
                            ->orWhere('symbol', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status === 'out') {
                $query->where('stock', '<=', 0);
            } elseif ($status === 'low') {
                $query->where('stock', '>', 0)->where('stock', '<=', 5);
            } elseif ($status === 'safe') {
                $query->where('stock', '>', 5);
            }
        }

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->input('product_id'));
        }

        $stats = DB::table('product_variants')->selectRaw('
            COUNT(*) as total_variants,
            COUNT(CASE WHEN stock > 5 THEN 1 END) as safe_count,
            COUNT(CASE WHEN stock > 0 AND stock <= 5 THEN 1 END) as low_count,
            COUNT(CASE WHEN stock <= 0 THEN 1 END) as out_count,
            COALESCE(SUM(stock * price), 0) as total_valuation
        ')->first();

        $stocks = $query->latest('updated_at')->get()->map(function ($variant) {
            $stock = (float) $variant->stock;
            $status = 'safe';
            $statusLabel = 'Aman';
            if ($stock <= 0) {
                $status = 'out';
                $statusLabel = 'Habis';
            } elseif ($stock <= 5) {
                $status = 'low';
                $statusLabel = 'Menipis';
            }

            return [
                'id' => $variant->id,
                'product_id' => $variant->product_id,
                'sku' => $variant->sku,
                'product_name' => $variant->product?->name ?? '-',
                'product_image' => $variant->product?->image_url,
                'variant_label' => $variant->variant_label,
                'unit_symbol' => $variant->unit?->symbol ?? 'Pcs',
                'price' => (float) $variant->price,
                'stock' => $stock,
                'asset_value' => (float) ($stock * (float) $variant->price),
                'status' => $status,
                'status_label' => $statusLabel,
                'is_active' => $variant->is_active,
                'updated_at' => $variant->updated_at?->format('d/m/Y H:i'),
            ];
        });

        // Recent 15 mutations
        $recentMutations = StockMutation::with(['variant.product', 'variant.unit', 'user'])
            ->latest()
            ->take(15)
            ->get()
            ->map(function ($m) {
                return [
                    'id' => $m->id,
                    'sku' => $m->variant?->sku ?? '-',
                    'product_name' => $m->variant?->product?->name ?? 'Produk Dihapus',
                    'unit_symbol' => $m->variant?->unit?->symbol ?? 'Pcs',
                    'type' => $m->type,
                    'quantity' => (float) $m->quantity,
                    'stock_before' => (float) $m->stock_before,
                    'stock_after' => (float) $m->stock_after,
                    'reference_number' => $m->reference_number ?? '-',
                    'notes' => $m->notes ?? '-',
                    'user_name' => $m->user?->name ?? 'Sistem',
                    'created_at' => $m->created_at?->format('d/m/Y H:i'),
                ];
            });

        $products = Product::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Admin/Stocks/Index', [
            'stocks' => $stocks,
            'summary' => [
                'total_variants' => (int) ($stats->total_variants ?? 0),
                'safe_count' => (int) ($stats->safe_count ?? 0),
                'low_count' => (int) ($stats->low_count ?? 0),
                'out_count' => (int) ($stats->out_count ?? 0),
                'total_valuation' => (float) ($stats->total_valuation ?? 0),
            ],
            'recent_mutations' => $recentMutations,
            'products' => $products,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'product_id' => $request->input('product_id', ''),
            ],
        ]);
    }

    public function adjust(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'variant_id' => ['required', 'exists:product_variants,id'],
            'type' => ['required', 'in:IN,OUT,ADJUSTMENT'],
            'quantity' => ['required', 'numeric', 'min:0.01'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($validated) {
            $variant = ProductVariant::lockForUpdate()->findOrFail($validated['variant_id']);
            $currentStock = (float) $variant->stock;
            $qty = (float) $validated['quantity'];

            $type = $validated['type'];
            $newStock = $currentStock;

            if ($type === 'IN') {
                $newStock = $currentStock + $qty;
            } elseif ($type === 'OUT') {
                $newStock = max(0, $currentStock - $qty);
            } elseif ($type === 'ADJUSTMENT') {
                $newStock = $qty; // Qty becomes the direct new target stock
            }

            $variant->stock = $newStock;
            $variant->save();

            StockMutation::create([
                'product_variant_id' => $variant->id,
                'user_id' => Auth::id(),
                'type' => $type,
                'quantity' => $type === 'ADJUSTMENT' ? abs($newStock - $currentStock) : $qty,
                'stock_before' => $currentStock,
                'stock_after' => $newStock,
                'reference_number' => 'ADJ-'.date('Ymd').'-'.rand(100, 999),
                'notes' => $validated['notes'] ?: match ($type) {
                    'IN' => 'Penambahan stok panen / masuk',
                    'OUT' => 'Pengurangan stok rusak / afkir',
                    'ADJUSTMENT' => 'Penyesuaian stok fisik (Opname)',
                },
            ]);
        });

        return back()->with('success', 'Penyesuaian stok berhasil disimpan dan tercatat di riwayat mutasi.');
    }
}
