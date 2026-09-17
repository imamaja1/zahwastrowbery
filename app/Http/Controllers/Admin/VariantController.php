<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StockMutation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VariantController extends Controller
{
    public function index(Request $request): RedirectResponse
    {
        return redirect()->route('admin.products.index');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'packaging_type_id' => ['nullable', 'exists:packaging_types,id'],
            'size_id' => ['nullable', 'exists:sizes,id'],
            'unit_id' => ['required', 'exists:units,id'],
            'sku' => ['nullable', 'string', 'max:50', 'unique:product_variants,sku'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        // Auto-generate SKU if not provided
        $sku = $validated['sku'] ?? null;
        if (! $sku) {
            $product = Product::find($validated['product_id']);
            $productPrefix = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $product->name ?? 'FRUIT'), 0, 3));
            $randomNum = rand(100, 999);
            $sku = "VAR-{$productPrefix}-{$randomNum}";
            while (ProductVariant::where('sku', $sku)->exists()) {
                $sku = "VAR-{$productPrefix}-".rand(1000, 9999);
            }
        }

        $initialStock = (float) ($validated['stock'] ?? 0);

        $variant = ProductVariant::create([
            'product_id' => $validated['product_id'],
            'packaging_type_id' => $validated['packaging_type_id'] ?: null,
            'size_id' => $validated['size_id'] ?: null,
            'unit_id' => $validated['unit_id'],
            'sku' => strtoupper($sku),
            'price' => $validated['price'],
            'stock' => $initialStock,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if ($initialStock > 0) {
            StockMutation::create([
                'product_variant_id' => $variant->id,
                'user_id' => Auth::id(),
                'type' => 'IN',
                'quantity' => $initialStock,
                'stock_before' => 0,
                'stock_after' => $initialStock,
                'reference_number' => 'INIT-STOCK',
                'notes' => 'Stok awal saat pendaftaran varian baru',
            ]);
        }

        return back()->with('success', "Varian {$variant->sku} berhasil ditambahkan!");
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $variant = ProductVariant::findOrFail($id);

        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'packaging_type_id' => ['nullable', 'exists:packaging_types,id'],
            'size_id' => ['nullable', 'exists:sizes,id'],
            'unit_id' => ['required', 'exists:units,id'],
            'sku' => ['required', 'string', 'max:50', "unique:product_variants,sku,{$variant->id}"],
            'price' => ['required', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $variant->update([
            'product_id' => $validated['product_id'],
            'packaging_type_id' => $validated['packaging_type_id'] ?: null,
            'size_id' => $validated['size_id'] ?: null,
            'unit_id' => $validated['unit_id'],
            'sku' => strtoupper($validated['sku']),
            'price' => $validated['price'],
            'is_active' => $validated['is_active'] ?? $variant->is_active,
        ]);

        return back()->with('success', "Varian {$variant->sku} berhasil diperbarui!");
    }

    public function toggle(int $id): RedirectResponse
    {
        $variant = ProductVariant::findOrFail($id);
        $variant->is_active = ! $variant->is_active;
        $variant->save();

        $status = $variant->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with('success', "Varian {$variant->sku} berhasil {$status}.");
    }

    public function destroy(int $id): RedirectResponse
    {
        $variant = ProductVariant::findOrFail($id);
        $sku = $variant->sku;
        $variant->delete();

        return back()->with('success', "Varian {$sku} berhasil dihapus.");
    }
}
