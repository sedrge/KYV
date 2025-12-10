<?php

namespace App\Http\Middleware;

use App\Services\AuditService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditMiddleware
{
    public function __construct(protected AuditService $auditService) {}

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (auth()->check() && $this->shouldAudit($request, $response)) {
            $this->logRequest($request, $response);
        }

        return $response;
    }

    protected function shouldAudit(Request $request, Response $response): bool
    {
        if ($request->is('_boost/*')) {
            return false;
        }

        if ($request->method() === 'GET' && ! $request->is('api/*')) {
            return false;
        }

        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            return true;
        }

        if ($request->is('api/*') && $request->method() === 'GET') {
            return true;
        }

        return false;
    }

    protected function logRequest(Request $request, Response $response): void
    {
        $event = $this->determineEvent($request, $response);

        $metadata = [
            'status_code' => $response->getStatusCode(),
            'request_data' => $this->filterSensitiveData($request->all()),
        ];

        $tags = $this->determineTags($request);

        $this->auditService->logCustomEvent($event, auth()->id(), $metadata, $tags);
    }

    protected function determineEvent(Request $request, Response $response): string
    {
        $method = $request->method();
        $path = $request->path();
        $statusCode = $response->getStatusCode();

        if ($statusCode >= 400) {
            return "request.{$method}.failed";
        }

        if ($request->is('login') && $method === 'POST') {
            return 'auth.login';
        }

        if ($request->is('logout') && $method === 'POST') {
            return 'auth.logout';
        }

        if ($request->is('register') && $method === 'POST') {
            return 'auth.register';
        }

        return "request.{$method}.success";
    }

    protected function determineTags(Request $request): array
    {
        $tags = [];

        if ($request->is('api/*')) {
            $tags[] = 'api';
        }

        if ($request->is('auth/*') || $request->is('login') || $request->is('register')) {
            $tags[] = 'authentication';
        }

        return $tags;
    }

    protected function filterSensitiveData(array $data): array
    {
        $sensitiveFields = ['password', 'password_confirmation', 'token', 'secret', 'api_key'];

        foreach ($sensitiveFields as $field) {
            if (isset($data[$field])) {
                $data[$field] = '[FILTERED]';
            }
        }

        return $data;
    }
}
