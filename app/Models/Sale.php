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
 * @property int|null $user_id
 * @property string $invoice_number
 * @property string $customer_name
 * @property string $customer_phone
 * @property string|null $customer_address
 * @property float $total_amount
 * @property string $payment_method
 * @property string $payment_status
 * @property string|null $payment_proof
 * @property string|null $notes
 * @property string|null $rejection_reason
 * @property Carbon|null $paid_at
 * @property Carbon|null $expired_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id',
    'invoice_number',
    'customer_name',
    'customer_phone',
    'customer_address',
    'total_amount',
    'payment_method',
    'payment_status',
    'payment_proof',
    'notes',
    'rejection_reason',
    'paid_at',
    'expired_at',
])]
class Sale extends Model
{
    use HasFactory;

    public const PAYMENT_METHODS = ['QRIS', 'COD', 'TRANSFER'];

    public const STATUS_PENDING = 'PENDING';

    public const STATUS_WAITING_VERIFICATION = 'WAITING_VERIFICATION';

    public const STATUS_PAID = 'PAID';

    public const STATUS_REJECTED = 'REJECTED';

    public const STATUS_EXPIRED = 'EXPIRED';

    public const STATUS_CANCELLED = 'CANCELLED';

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'expired_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<SaleItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }
}
