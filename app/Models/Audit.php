<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Audit extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'event',
        'auditable_type',
        'auditable_id',
        'user_id',
        'ip_address',
        'user_agent',
        'old_values',
        'new_values',
        'metadata',
        'url',
        'http_method',
        'tags',
    ];

    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
            'metadata' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getChanges(): array
    {
        $changes = [];

        if ($this->old_values && $this->new_values) {
            $oldValues = $this->old_values;
            $newValues = $this->new_values;

            foreach ($newValues as $key => $newValue) {
                $oldValue = $oldValues[$key] ?? null;

                if ($oldValue !== $newValue) {
                    $changes[$key] = [
                        'old' => $oldValue,
                        'new' => $newValue,
                    ];
                }
            }
        }

        return $changes;
    }

    public function hasAuditChanges(): bool
    {
        return ! empty($this->getChanges());
    }

    public function getTags(): array
    {
        return $this->tags ? explode(',', $this->tags) : [];
    }

    public function setTagsAttribute(?array $value): void
    {
        $this->attributes['tags'] = $value ? implode(',', $value) : null;
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForEvent($query, string $event)
    {
        return $query->where('event', $event);
    }

    public function scopeForModel($query, string $type, ?int $id = null)
    {
        $query->where('auditable_type', $type);

        if ($id !== null) {
            $query->where('auditable_id', $id);
        }

        return $query;
    }

    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    public function scopeWithTag($query, string $tag)
    {
        return $query->where('tags', 'like', "%{$tag}%");
    }
}
