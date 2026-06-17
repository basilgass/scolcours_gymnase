<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Collection;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Authentifie un utilisateur standard (gardes web ET sanctum) et le retourne.
     */
    protected function actingAsUser(array $attributes = []): User
    {
        $user = User::factory()->create($attributes);
        $this->actingAs($user);
        Sanctum::actingAs($user);

        return $user;
    }

    /**
     * Authentifie un administrateur (role = 'admin') et le retourne.
     */
    protected function actingAsAdmin(array $attributes = []): User
    {
        $user = User::factory()->admin()->create($attributes);
        $this->actingAs($user);
        Sanctum::actingAs($user);

        return $user;
    }

    /**
     * Toutes les routes protégées par le groupe middleware "admin".
     *
     * @return Collection<int, RoutingRoute>
     */
    protected function adminRoutes(): Collection
    {
        return collect(app('router')->getRoutes()->getRoutes())
            ->filter(fn (RoutingRoute $route) => in_array('admin', $route->gatherMiddleware()));
    }

    /**
     * Construit un chemin testable en remplaçant chaque paramètre par "1".
     */
    protected function fakeUrlFor(RoutingRoute $route): string
    {
        $uri = preg_replace('/\{[^}]+\}/', '1', $route->uri());

        return '/' . ltrim($uri, '/');
    }

    /**
     * Première méthode HTTP utile de la route (hors HEAD).
     */
    protected function primaryMethod(RoutingRoute $route): string
    {
        return collect($route->methods())->first(fn ($m) => $m !== 'HEAD') ?? 'GET';
    }
}
