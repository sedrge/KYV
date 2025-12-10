<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditController extends Controller
{
    public function __construct(protected AuditService $auditService) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['user_id', 'event', 'auditable_type', 'auditable_id', 'start_date', 'end_date', 'tag', 'search']);
        $perPage = $request->input('per_page', 15);

        $audits = $this->auditService->getAudits($filters, $perPage);

        $users = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        $events = ['created', 'updated', 'deleted', 'auth.login', 'auth.logout', 'auth.register'];

        $auditableTypes = [
            'App\\Models\\User' => 'Utilisateurs',
            'App\\Models\\Place' => 'Lieux',
            'App\\Models\\TypePlace' => 'Types de lieux',
            'App\\Models\\Config' => 'Configurations',
            'Spatie\\Permission\\Models\\Role' => 'Rôles',
            'Spatie\\Permission\\Models\\Permission' => 'Permissions',
        ];

        return Inertia::render('Audits/Index', [
            'audits' => $audits->through(fn ($audit) => [
                'id' => $audit->id,
                'event' => $audit->event,
                'auditable_type' => $audit->auditable_type ? class_basename($audit->auditable_type) : null,
                'auditable_id' => $audit->auditable_id,
                'user' => $audit->user ? [
                    'id' => $audit->user->id,
                    'name' => $audit->user->name,
                    'email' => $audit->user->email,
                ] : null,
                'ip_address' => $audit->ip_address,
                'url' => $audit->url,
                'http_method' => $audit->http_method,
                'tags' => $audit->getTags(),
                'created_at' => $audit->created_at,
            ]),
            'filters' => $filters,
            'users' => $users,
            'events' => $events,
            'auditable_types' => $auditableTypes,
        ]);
    }

    public function show(int $id): Response
    {
        $audit = $this->auditService->getAuditById($id);

        if (! $audit) {
            abort(404);
        }

        return Inertia::render('Audits/Show', [
            'audit' => [
                'id' => $audit->id,
                'event' => $audit->event,
                'auditable_type' => $audit->auditable_type,
                'auditable_id' => $audit->auditable_id,
                'user' => $audit->user ? [
                    'id' => $audit->user->id,
                    'name' => $audit->user->name,
                    'email' => $audit->user->email,
                ] : null,
                'ip_address' => $audit->ip_address,
                'user_agent' => $audit->user_agent,
                'old_values' => $audit->old_values,
                'new_values' => $audit->new_values,
                'metadata' => $audit->metadata,
                'url' => $audit->url,
                'http_method' => $audit->http_method,
                'tags' => $audit->getTags(),
                'changes' => $audit->getChanges(),
                'created_at' => $audit->created_at,
            ],
        ]);
    }

    public function statistics(Request $request): Response
    {
        $filters = $request->only(['start_date', 'end_date']);

        $statistics = $this->auditService->getAuditStatistics($filters);

        return Inertia::render('Audits/Statistics', [
            'statistics' => $statistics,
            'filters' => $filters,
        ]);
    }

    public function export(Request $request)
    {
        $filters = $request->only(['user_id', 'event', 'start_date', 'end_date']);

        $audits = $this->auditService->exportAudits($filters);

        $filename = 'audits-'.now()->format('Y-m-d-His').'.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($audits) {
            $file = fopen('php://output', 'w');

            fputcsv($file, ['ID', 'Event', 'Type', 'User', 'IP Address', 'URL', 'Method', 'Tags', 'Date']);

            foreach ($audits as $audit) {
                fputcsv($file, [
                    $audit->id,
                    $audit->event,
                    $audit->auditable_type ? class_basename($audit->auditable_type) : '',
                    $audit->user ? $audit->user->name : 'N/A',
                    $audit->ip_address,
                    $audit->url,
                    $audit->http_method,
                    implode(', ', $audit->getTags()),
                    $audit->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function userAudits(int $userId): Response
    {
        $user = User::findOrFail($userId);
        $audits = $this->auditService->getUserAudits($userId, 100);

        return Inertia::render('Audits/UserAudits', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'audits' => $audits->map(fn ($audit) => [
                'id' => $audit->id,
                'event' => $audit->event,
                'auditable_type' => $audit->auditable_type ? class_basename($audit->auditable_type) : null,
                'auditable_id' => $audit->auditable_id,
                'ip_address' => $audit->ip_address,
                'url' => $audit->url,
                'http_method' => $audit->http_method,
                'tags' => $audit->getTags(),
                'created_at' => $audit->created_at,
            ]),
        ]);
    }
}
