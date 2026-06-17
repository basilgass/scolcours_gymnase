<?php

namespace Tests\Feature\Smoke;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Str;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_any_admin_route(): void
    {
        $offenders = [];

        foreach ($this->adminRoutes() as $route) {
            /** @var RoutingRoute $route */
            $method = $this->primaryMethod($route);
            $url = $this->fakeUrlFor($route);

            $headers = Str::startsWith($route->uri(), 'api/')
                ? ['Accept' => 'application/json']
                : [];

            $status = $this->call($method, $url, [], [], [], $this->transformHeadersToServerVars($headers))->getStatusCode();

            // Un invité doit être rejeté : redirection login (302) ou non authentifié (401/403).
            if (! in_array($status, [302, 401, 403], true)) {
                $offenders[] = "$method {$route->uri()} (status $status, name {$route->getName()})";
            }
        }

        $this->assertSame(
            [],
            $offenders,
            "Routes admin accessibles/cassées pour un invité :\n" . implode("\n", $offenders)
        );
    }

    public function test_non_admins_are_forbidden_on_parameterless_admin_routes(): void
    {
        $this->actingAsUser();

        $offenders = [];

        foreach ($this->adminRoutes() as $route) {
            /** @var RoutingRoute $route */
            // Routes sans paramètre uniquement : sinon un faux param renvoie 404
            // (binding) avant que can:admin ne réponde 403.
            if (Str::contains($route->uri(), '{')) {
                continue;
            }

            $method = $this->primaryMethod($route);
            $url = $this->fakeUrlFor($route);
            $headers = Str::startsWith($route->uri(), 'api/')
                ? ['Accept' => 'application/json']
                : [];

            $status = $this->call($method, $url, [], [], [], $this->transformHeadersToServerVars($headers))->getStatusCode();

            // can:admin doit refuser le non-admin (403). Une route sans paramètre qui
            // ne renvoie pas 403 est suspecte : fuite (2xx) ou masquage par une route
            // paramétrée déclarée avant (404 via binding) → bug à corriger.
            if ($status !== 403) {
                $offenders[] = "$method {$route->uri()} (status $status, name {$route->getName()})";
            }
        }

        $this->assertSame(
            [],
            $offenders,
            "Routes admin sans paramètre n'ayant PAS renvoyé 403 à un non-admin :\n" . implode("\n", $offenders)
        );
    }

    public function test_admin_can_reach_parameterless_admin_get_pages(): void
    {
        $this->actingAsAdmin();

        $offenders = [];

        foreach ($this->adminRoutes() as $route) {
            /** @var RoutingRoute $route */
            if (Str::contains($route->uri(), '{')) {
                continue;
            }
            if (! in_array('GET', $route->methods(), true)) {
                continue; // on ne déclenche pas POST/PATCH/DELETE ici (effets de bord)
            }

            $url = $this->fakeUrlFor($route);
            $headers = Str::startsWith($route->uri(), 'api/')
                ? ['Accept' => 'application/json']
                : [];

            $status = $this->call('GET', $url, [], [], [], $this->transformHeadersToServerVars($headers))->getStatusCode();

            // L'admin doit passer l'autorisation : surtout PAS 401/403, et pas de crash 5xx.
            if (in_array($status, [401, 403], true) || $status >= 500) {
                $offenders[] = "GET {$route->uri()} (status $status, name {$route->getName()})";
            }
        }

        $this->assertSame(
            [],
            $offenders,
            "Pages d'index admin inaccessibles à un admin (401/403/5xx) :\n" . implode("\n", $offenders)
        );
    }
}
