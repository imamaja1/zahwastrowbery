<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\PackagingType;
use App\Models\Product;
use App\Models\Size;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with([
            'category',
            'variants.packagingType',
            'variants.size',
            'variants.unit',
        ])->withCount('variants');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        $products = $query->latest()->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'category_id' => $product->category_id,
                'category_name' => $product->category?->name ?? 'Uncategorized',
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'image' => $product->image_url,
                'raw_image' => $product->image,
                'is_active' => $product->is_active,
                'variants_count' => $product->variants_count,
                'min_price' => (float) ($product->variants->min('price') ?? 0),
                'max_price' => (float) ($product->variants->max('price') ?? 0),
                'total_stock' => (float) ($product->variants->sum('stock') ?? 0),
                'created_at' => $product->created_at?->format('d M Y'),
                'variants' => $product->variants->map(function ($v) {
                    return [
                        'id' => $v->id,
                        'product_id' => $v->product_id,
                        'sku' => $v->sku,
                        'label' => $v->variant_label,
                        'packaging_type_id' => $v->packaging_type_id,
                        'packaging_name' => $v->packagingType?->name ?? 'Tanpa Kemasan',
                        'size_id' => $v->size_id,
                        'size_name' => $v->size?->name ?? 'Standard',
                        'unit_id' => $v->unit_id,
                        'unit_name' => $v->unit?->name ?? '-',
                        'unit_symbol' => $v->unit?->symbol ?? 'Pcs',
                        'price' => (float) $v->price,
                        'stock' => (float) $v->stock,
                        'is_active' => (bool) $v->is_active,
                    ];
                }),
            ];
        });

        $categories = Category::where('is_active', true)->get(['id', 'name', 'slug']);
        $packagingTypes = PackagingType::where('is_active', true)->get(['id', 'name']);
        $sizes = Size::where('is_active', true)->get(['id', 'name']);
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'packaging_types' => $packagingTypes,
            'sizes' => $sizes,
            'units' => $units,
            'filters' => [
                'search' => $request->input('search', ''),
                'category_id' => $request->input('category_id', ''),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:4096'],
            'image' => ['nullable', 'string', 'max:500'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $slug = Str::slug($validated['name']);
        // Ensure slug uniqueness
        $originalSlug = $slug;
        $count = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        $imagePath = $validated['image'] ?? 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600';

        if ($request->hasFile('image_file')) {
            $imagePath = $request->file('image_file')->store('products', 'public');
        }

        $product = Product::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'image' => $imagePath,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.products.index')
            ->with('success', "Produk {$product->name} berhasil ditambahkan!");
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:4096'],
            'image' => ['nullable', 'string', 'max:500'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($product->name !== $validated['name']) {
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $count = 1;
            while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = "{$originalSlug}-{$count}";
                $count++;
            }
            $product->slug = $slug;
        }

        $imagePath = $product->image;

        if ($request->hasFile('image_file')) {
            // Delete old file if stored in public disk
            if ($product->image && ! str_starts_with($product->image, 'http') && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $imagePath = $request->file('image_file')->store('products', 'public');
        } elseif (isset($validated['image']) && $validated['image'] !== '') {
            $imagePath = $validated['image'];
        }

        $product->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'image' => $imagePath,
            'is_active' => $validated['is_active'] ?? $product->is_active,
        ]);

        return back()->with('success', "Produk {$product->name} berhasil diperbarui!");
    }

    public function toggle(int $id): RedirectResponse
    {
        $product = Product::findOrFail($id);
        $product->is_active = ! $product->is_active;
        $product->save();

        $status = $product->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with('success', "Status produk {$product->name} berhasil {$status}.");
    }

    public function destroy(int $id): RedirectResponse
    {
        $product = Product::findOrFail($id);
        $name = $product->name;

        // Delete image from storage if local
        if ($product->image && ! str_starts_with($product->image, 'http') && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return back()->with('success', "Produk {$name} berhasil dihapus.");
    }
}
