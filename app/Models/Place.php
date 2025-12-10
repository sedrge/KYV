<?php

namespace App\Models;

use App\Models\Installation\Config;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Place extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'type_place_id',
        'address',
        'city',
        'phone',
        'email',
        'description',
        'latitude',
        'longitude',
        'website',
        'rating',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'rating' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function typePlace(): BelongsTo
    {
        return $this->belongsTo(TypePlace::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function config(): HasOne
    {
        return $this->hasOne(Config::class);
    }

    public function getConfig(): Config
    {
        $consfig = $this->config()->where('is_active', true)->latest()->first();
        if (! $consfig) {
            $consfig = Config::query()->where('place_id', null)->where('is_active', true)->latest()->first();
        }
        if (! $consfig) {
            $consfig = Config::query()->where('place_id', null)->latest()->first();
        }

        return $consfig;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeNotActive($query)
    {
        return $query->where('is_active', false);
    }
}
