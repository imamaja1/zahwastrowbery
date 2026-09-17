<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'group',
        'key',
        'value',
    ];

    /**
     * In-memory cache for settings.
     *
     * @var array<string, mixed>
     */
    protected static array $cache = [];

    /**
     * Clear the in-memory cache.
     */
    public static function clearCache(): void
    {
        static::$cache = [];
    }

    /**
     * Get a setting value by key with optional default.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        if (array_key_exists($key, static::$cache)) {
            return static::$cache[$key];
        }

        $setting = static::where('key', $key)->first();
        $value = $setting ? $setting->value : $default;
        static::$cache[$key] = $value;

        return $value;
    }

    /**
     * Set / update a setting value.
     */
    public static function set(string $key, mixed $value, string $group = 'general'): static
    {
        static::clearCache();

        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => is_bool($value) ? ($value ? '1' : '0') : (string) $value,
                'group' => $group,
            ]
        );
    }

    /**
     * Get all settings grouped by group.
     */
    public static function getAllGrouped(): array
    {
        $settings = static::all();
        $grouped = [];

        foreach ($settings as $setting) {
            $grouped[$setting->group][$setting->key] = $setting->value;
        }

        return $grouped;
    }
}
