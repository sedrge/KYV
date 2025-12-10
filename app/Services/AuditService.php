<?php

namespace App\Services;

use App\Models\Audit;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class AuditService
{
    public function getAudits(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Audit::query()->with(['user', 'auditable']);

        if (! empty($filters['user_id'])) {
            $query->forUser($filters['user_id']);
        }

        if (! empty($filters['event'])) {
            $query->forEvent($filters['event']);
        }

        if (! empty($filters['auditable_type'])) {
            $query->forModel($filters['auditable_type'], $filters['auditable_id'] ?? null);
        }

        if (! empty($filters['start_date']) && ! empty($filters['end_date'])) {
            $query->betweenDates($filters['start_date'], $filters['end_date']);
        }

        if (! empty($filters['tag'])) {
            $query->withTag($filters['tag']);
        }

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('url', 'like', "%{$filters['search']}%")
                    ->orWhere('ip_address', 'like', "%{$filters['search']}%")
                    ->orWhereHas('user', function ($userQuery) use ($filters) {
                        $userQuery->where('name', 'like', "%{$filters['search']}%")
                            ->orWhere('email', 'like', "%{$filters['search']}%");
                    });
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function getAuditById(int $id): ?Audit
    {
        return Audit::with(['user', 'auditable'])->find($id);
    }

    public function getUserAudits(int $userId, int $limit = 50): Collection
    {
        return Audit::query()
            ->forUser($userId)
            ->with('auditable')
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getModelAudits(string $modelType, int $modelId, int $limit = 50): Collection
    {
        return Audit::query()
            ->forModel($modelType, $modelId)
            ->with('user')
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getRecentAudits(int $hours = 24, int $limit = 100): Collection
    {
        $startDate = Carbon::now()->subHours($hours);

        return Audit::query()
            ->where('created_at', '>=', $startDate)
            ->with(['user', 'auditable'])
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getAuditStatistics(array $filters = []): array
    {
        $query = Audit::query();

        if (! empty($filters['start_date']) && ! empty($filters['end_date'])) {
            $query->betweenDates($filters['start_date'], $filters['end_date']);
        } else {
            $query->where('created_at', '>=', Carbon::now()->subDays(30));
        }

        $totalAudits = $query->count();
        $auditsByEvent = $query->selectRaw('event, COUNT(*) as count')
            ->groupBy('event')
            ->pluck('count', 'event')
            ->toArray();

        $auditsByUser = Audit::query()
            ->when(! empty($filters['start_date']) && ! empty($filters['end_date']), function ($q) use ($filters) {
                $q->betweenDates($filters['start_date'], $filters['end_date']);
            })
            ->selectRaw('user_id, COUNT(*) as count')
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->orderByDesc('count')
            ->limit(10)
            ->with('user:id,name,email')
            ->get()
            ->map(fn ($audit) => [
                'user' => $audit->user ? [
                    'id' => $audit->user->id,
                    'name' => $audit->user->name,
                    'email' => $audit->user->email,
                ] : null,
                'count' => $audit->count,
            ]);

        $auditsByModel = Audit::query()
            ->when(! empty($filters['start_date']) && ! empty($filters['end_date']), function ($q) use ($filters) {
                $q->betweenDates($filters['start_date'], $filters['end_date']);
            })
            ->selectRaw('auditable_type, COUNT(*) as count')
            ->whereNotNull('auditable_type')
            ->groupBy('auditable_type')
            ->pluck('count', 'auditable_type')
            ->toArray();

        return [
            'total_audits' => $totalAudits,
            'audits_by_event' => $auditsByEvent,
            'audits_by_user' => $auditsByUser,
            'audits_by_model' => $auditsByModel,
        ];
    }

    public function logCustomEvent(string $event, ?int $userId = null, array $metadata = [], array $tags = []): Audit
    {
        return Audit::create([
            'event' => $event,
            'auditable_type' => null,
            'auditable_id' => null,
            'user_id' => $userId ?? auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'metadata' => $metadata,
            'url' => request()->fullUrl(),
            'http_method' => request()->method(),
            'tags' => $tags,
        ]);
    }

    public function pruneOldAudits(int $days = 90): int
    {
        $date = Carbon::now()->subDays($days);

        return Audit::where('created_at', '<', $date)->delete();
    }

    public function exportAudits(array $filters = []): Collection
    {
        $query = Audit::query()->with(['user', 'auditable']);

        if (! empty($filters['user_id'])) {
            $query->forUser($filters['user_id']);
        }

        if (! empty($filters['event'])) {
            $query->forEvent($filters['event']);
        }

        if (! empty($filters['start_date']) && ! empty($filters['end_date'])) {
            $query->betweenDates($filters['start_date'], $filters['end_date']);
        }

        return $query->latest()->get();
    }
}
