<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $product_id
 * @property int|null $packaging_type_id
 * @property int|null $size_id
 * @property int $unit_id
 * @property string $sku
 * @property float $price
 * @property float $stock
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'product_id',
    'packaging_type_id',
    'size_id',
    'unit_id',
    'sku',
    'price',
    'stock',
    'is_active',
])]
class ProductVariant extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'decimal:3',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return BelongsTo<PackagingType, $this>
     */
    public function packagingType(): BelongsTo
    {
        return $this->belongsTo(PackagingType::class);
    }

    /**
     * @return BelongsTo<Size, $this>
     */
    public function size(): BelongsTo
    {
        return $this->belongsTo(Size::class);
    }

    /**
     * @return BelongsTo<Unit, $this>
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * @return HasMany<SaleItem, $this>
     */
    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    /**
     * @return HasMany<StockMutation, $this>
     */
    public function mutations(): HasMany
    {
        return $this->hasMany(StockMutation::class);
    }

    /**
     * Format variant readable label (e.g. "Mika Medium (Pcs)" or "Per Kg")
     */
    public function getVariantLabelAttribute(): string
    {
        $parts = [];
        if ($this->packagingType) {
            $parts[] = $this->packagingType->name;
        }
        if ($this->size) {
            $parts[] = $this->size->name;
        }
        $unitName = $this->unit ? $this->unit->symbol : '';

        $title = count($parts) > 0 ? implode(' ', $parts) : 'Standar';

        return $unitName ? "{$title} ({$unitName})" : $title;
    }
}
