<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(string $slug): Response
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'category',
                'activeVariants.packagingType',
                'activeVariants.size',
                'activeVariants.unit',
            ])
            ->firstOrFail();

        $variants = $product->activeVariants->map(function ($v) {
            return [
                'id' => $v->id,
                'sku' => $v->sku,
                'price' => (float) $v->price,
                'stock' => (float) $v->stock,
                'packaging_type_id' => $v->packaging_type_id,
                'packaging_type_name' => $v->packagingType?->name,
                'size_id' => $v->size_id,
                'size_name' => $v->size?->name,
                'unit_id' => $v->unit_id,
                'unit_symbol' => $v->unit?->symbol,
                'unit_name' => $v->unit?->name,
                'label' => $v->variant_label,
            ];
        });

        // Collect distinct available options for this product
        $packagingOptions = $product->activeVariants
            ->pluck('packagingType')
            ->filter()
            ->unique('id')
            ->values()
            ->map(fn ($p) => ['id' => $p->id, 'name' => $p->name]);

        $sizeOptions = $product->activeVariants
            ->pluck('size')
            ->filter()
            ->unique('id')
            ->values()
            ->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]);

        $unitOptions = $product->activeVariants
            ->pluck('unit')
            ->filter()
            ->unique('id')
            ->values()
            ->map(fn ($u) => ['id' => $u->id, 'name' => $u->name, 'symbol' => $u->symbol]);

        return Inertia::render('Customer/Products/Show', [
            'product' => [
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
                'variants' => $variants,
                'packaging_options' => $packagingOptions,
                'size_options' => $sizeOptions,
                'unit_options' => $unitOptions,
            ],
        ]);
    }
}
