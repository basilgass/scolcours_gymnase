<?php

namespace Tests\Feature\Seo;

use App\Models\Chapter;
use App\Models\Theme;
use App\Models\Tool;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SeoAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_the_seo_audit(): void
    {
        $this->actingAsAdmin();
        $theme = Theme::factory()->create(['enabled' => true]);
        Chapter::factory()->create(['theme_id' => $theme->id, 'active' => true]);
        Tool::factory()->create();

        $this->get(route('admin.seo.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/AdminSeo')
                ->has('rows', fn (Assert $rows) => $rows->each(fn (Assert $row) => $row
                    ->has('url')
                    ->has('title')
                    ->has('description')
                    ->has('source')
                    ->has('length')
                    ->etc()))
                ->etc());
    }

    public function test_seo_audit_requires_admin(): void
    {
        // Invité : redirigé vers le login.
        $this->get(route('admin.seo.index'))->assertStatus(302);

        // Authentifié non-admin : interdit.
        $this->actingAsUser();
        $this->get(route('admin.seo.index'))->assertForbidden();
    }
}
