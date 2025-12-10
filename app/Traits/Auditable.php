<?php

namespace App\Traits;

use App\Models\Audit;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(function ($model) {
            $model->auditEvent('created');
        });

        static::updated(function ($model) {
            if ($model->isDirty() && ! $model->wasRecentlyCreated) {
                $model->auditEvent('updated');
            }
        });

        static::deleted(function ($model) {
            $model->auditEvent('deleted');
        });
    }

    public function audits(): MorphMany
    {
        return $this->morphMany(Audit::class, 'auditable')->latest();
    }

    public function auditEvent(string $event, array $metadata = [], array $tags = []): Audit
    {
        $oldValues = null;
        $newValues = null;

        if ($event === 'updated' && $this->wasChanged()) {
            $oldValues = $this->getOriginal();
            $newValues = $this->getAttributes();

            $oldValues = $this->filterAuditableAttributes($oldValues);
            $newValues = $this->filterAuditableAttributes($newValues);
        } elseif ($event === 'created') {
            $newValues = $this->filterAuditableAttributes($this->getAttributes());
        } elseif ($event === 'deleted') {
            $oldValues = $this->filterAuditableAttributes($this->getAttributes());
        }

        return Audit::create([
            'event' => $event,
            'auditable_type' => get_class($this),
            'auditable_id' => $this->getKey(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'metadata' => $metadata,
            'url' => request()->fullUrl(),
            'http_method' => request()->method(),
            'tags' => $tags,
        ]);
    }

    protected function filterAuditableAttributes(array $attributes): array
    {
        $exclude = $this->getAuditExclude();

        if (! empty($exclude)) {
            $attributes = array_diff_key($attributes, array_flip($exclude));
        }

        $include = $this->getAuditInclude();

        if (! empty($include)) {
            $attributes = array_intersect_key($attributes, array_flip($include));
        }

        return $attributes;
    }

    protected function getAuditExclude(): array
    {
        return property_exists($this, 'auditExclude') ? $this->auditExclude : [
            'password',
            'remember_token',
            'two_factor_secret',
            'two_factor_recovery_codes',
        ];
    }

    protected function getAuditInclude(): array
    {
        return property_exists($this, 'auditInclude') ? $this->auditInclude : [];
    }

    public function getLastAudit(): ?Audit
    {
        return $this->audits()->first();
    }

    public function getAuditHistory(int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        return $this->audits()->limit($limit)->get();
    }
}
