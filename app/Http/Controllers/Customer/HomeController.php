<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $categorySlug = $request->query('category');
        $search = $request->query('search');

        $categories = Category::where('is_active', true)->select(['id', 'name', 'slug', 'description'])->get();

        $productsQuery = Product::where('is_active', true)
            ->select(['id', 'category_id', 'name', 'slug', 'description', 'image', 'is_active'])
            ->with([
                'category:id,name,slug',
                'activeVariants' => function ($q) {
                    $q->select(['id', 'product_id', 'packaging_type_id', 'size_id', 'unit_id', 'sku', 'price', 'stock', 'is_active'])
                        ->with(['packagingType:id,name', 'size:id,name', 'unit:id,symbol']);
                },
            ]);

        if ($categorySlug) {
            $productsQuery->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        if ($search) {
            $productsQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $productsQuery->latest()->get()->map(function ($product) {
            $minPrice = $product->activeVariants->min('price') ?? 0;
            $maxPrice = $product->activeVariants->max('price') ?? 0;
            $totalStock = $product->activeVariants->sum('stock');
            $defaultUnit = $product->activeVariants->first()?->unit?->symbol ?? 'Pcs';

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'image' => $product->image_url,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ] : null,
                'min_price' => (float) $minPrice,
                'max_price' => (float) $maxPrice,
                'total_stock' => (float) $totalStock,
                'default_unit' => $defaultUnit,
                'variants_count' => $product->activeVariants->count(),
                'variants' => $product->activeVariants->map(function ($v) {
                    return [
                        'id' => $v->id,
                        'sku' => $v->sku,
                        'price' => (float) $v->price,
                        'stock' => (float) $v->stock,
                        'label' => $v->variant_label,
                        'packaging' => $v->packagingType?->name,
                        'size' => $v->size?->name,
                        'unit' => $v->unit->symbol,
                    ];
                }),
            ];
        });

        return Inertia::render('Customer/Home', [
            'categories' => $categories,
            'products' => $products,
            'selectedCategory' => $categorySlug,
            'searchQuery' => $search,
        ]);
    }
}
