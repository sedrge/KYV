<?php

namespace App\Models\Installation;

use App\Models\Place;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Config extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'content',
        'place_id',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
        ];
    }

    public function place(): BelongsTo
    {
        return $this->belongsTo(Place::class);
    }
}
