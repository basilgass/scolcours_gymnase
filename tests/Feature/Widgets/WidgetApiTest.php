<?php

namespace Tests\Feature\Widgets;

use App\Models\Widget;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class WidgetApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // WidgetResource::control appelle Storage::disk('widgets')->exists() à chaque
        // sérialisation : on isole le disque pour ne jamais toucher le système réel.
        Storage::fake('widgets');
    }

    public function test_index_lists_widgets_ordered_by_name(): void
    {
        $this->actingAsAdmin();
        Widget::factory()->create(['name' => 'Bravo']);
        Widget::factory()->create(['name' => 'Alpha']);

        $this->getJson(route('api.admin.widgets.index'))
            ->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonPath('0.name', 'Alpha')
            ->assertJsonPath('1.name', 'Bravo')
            ->assertJsonPath('0.control', false);
    }

    public function test_admin_show_returns_a_single_widget(): void
    {
        $this->actingAsAdmin();
        $widget = Widget::factory()->create();

        $this->getJson(route('api.admin.widgets.show', $widget))
            ->assertStatus(200)
            ->assertJsonPath('id', $widget->id);
    }

    public function test_update_modifies_the_widget_and_defaults_description_to_empty(): void
    {
        $this->actingAsAdmin();
        $widget = Widget::factory()->create(['name' => 'Avant', 'description' => 'Ancienne']);

        // En omettant description, le contrôleur la force à "".
        $this->patchJson(route('api.admin.widgets.update', $widget), [
            'name' => 'Après',
        ])->assertStatus(200);

        $fresh = $widget->fresh();
        $this->assertSame('Après', $fresh->name);
        $this->assertSame('', $fresh->description);
    }

    public function test_admin_can_delete_a_widget(): void
    {
        $this->actingAsAdmin();
        $widget = Widget::factory()->create();

        $this->deleteJson(route('api.admin.widgets.destroy', $widget))
            ->assertStatus(200);

        $this->assertModelMissing($widget);
    }

    public function test_refresh_creates_widgets_from_the_disk(): void
    {
        $this->actingAsAdmin();
        Storage::disk('widgets')->put('MonWidget.vue', 'entete<info>une description</info>pied');

        $this->getJson(route('api.admin.widgets.refresh'))
            ->assertStatus(200);

        $this->assertDatabaseHas('widgets', [
            'component'   => 'MonWidget.vue',
            'name'        => 'MonWidget',
            'description' => 'une description',
        ]);
    }

    public function test_widget_endpoints_require_admin(): void
    {
        $widget = Widget::factory()->create();

        $this->getJson(route('api.admin.widgets.index'))->assertStatus(401);
        $this->getJson(route('api.admin.widgets.show', $widget))->assertStatus(401);
        $this->patchJson(route('api.admin.widgets.update', $widget), [])->assertStatus(401);
        $this->deleteJson(route('api.admin.widgets.destroy', $widget))->assertStatus(401);
        $this->getJson(route('api.admin.widgets.refresh'))->assertStatus(401);

        $this->actingAsUser();
        $this->getJson(route('api.admin.widgets.index'))->assertForbidden();
        $this->getJson(route('api.admin.widgets.show', $widget))->assertForbidden();
        $this->patchJson(route('api.admin.widgets.update', $widget), [])->assertForbidden();
        $this->deleteJson(route('api.admin.widgets.destroy', $widget))->assertForbidden();
        $this->getJson(route('api.admin.widgets.refresh'))->assertForbidden();
    }
}
