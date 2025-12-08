<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TypePlace extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
    ];

    public function places(): HasMany
    {
        return $this->hasMany(Place::class);
    }
}
