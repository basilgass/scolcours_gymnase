<?php

namespace Tests\Feature\Admin;

use App\Models\Scolcours;
use App\Models\Theme;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminConfigTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_the_config_page(): void
    {
        // Les thèmes de référence sont seedés par la migration create_themes_table.
        $this->actingAsAdmin();

        $this->get(route('admin.config.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/AdminConfig')
                ->has('allThemes'));
    }

    public function test_admin_can_update_the_title_and_theme_states(): void
    {
        // configUpdate agit sur Scolcours::find(1), seedé par create_scolcours_table.
        $this->actingAsAdmin();
        $theme = Theme::factory()->create(['enabled' => true]);

        $this->patchJson(route('admin.config.update'), [
            'title'  => 'Nouveau titre',
            'themes' => [
                ['slug' => $theme->slug, 'enabled' => false],
            ],
        ])->assertStatus(200);

        $this->assertSame('Nouveau titre', Scolcours::find(1)->title);
        $this->assertFalse((bool) $theme->fresh()->enabled);
    }

    public function test_config_update_validates_its_input(): void
    {
        $this->actingAsAdmin();

        $this->patchJson(route('admin.config.update'), [
            'title'  => 'a',
            'themes' => [
                ['slug' => 'theme-inexistant', 'enabled' => 'pas-un-booleen'],
            ],
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['title', 'themes.0.slug', 'themes.0.enabled']);
    }

    public function test_admin_can_reorder_the_themes(): void
    {
        $this->actingAsAdmin();
        $t1 = Theme::factory()->create(['order' => 1]);
        $t2 = Theme::factory()->create(['order' => 2]);

        $this->patchJson(route('admin.config.order'), [
            'order' => [
                ['id' => $t1->id, 'order' => 5],
                ['id' => $t2->id, 'order' => 6],
            ],
        ])->assertStatus(200);

        $this->assertSame(5, $t1->fresh()->order);
        $this->assertSame(6, $t2->fresh()->order);
    }

    public function test_config_order_validates_a_minimum_order(): void
    {
        $this->actingAsAdmin();
        $theme = Theme::factory()->create();

        $this->patchJson(route('admin.config.order'), [
            'order' => [
                ['id' => $theme->id, 'order' => 0],
            ],
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['order.0.order']);
    }

    public function test_config_write_endpoints_require_admin(): void
    {
        $this->patch(route('admin.config.update'))->assertRedirect();
        $this->patch(route('admin.config.order'))->assertRedirect();

        $this->actingAsUser();
        $this->patch(route('admin.config.update'))->assertForbidden();
        $this->patch(route('admin.config.order'))->assertForbidden();
    }
}
