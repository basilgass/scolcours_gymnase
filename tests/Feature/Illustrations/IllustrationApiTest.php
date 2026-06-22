<?php

namespace Tests\Feature\Illustrations;

use App\Models\Block;
use App\Models\Illustration;
use App\Models\Widget;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class IllustrationApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Le disque widgets est touché lors de la sérialisation d'une illustration
        // dont le widget est chargé (attribut control).
        Storage::fake('widgets');
    }

    public function test_admin_can_store_an_illustration_on_a_block(): void
    {
        $this->actingAsAdmin();
        $block = Block::factory()->create();

        $this->postJson(route('api.admin.illustrations.store', $block), [])
            ->assertStatus(201)
            ->assertJsonPath('block_id', $block->id)
            ->assertJsonPath('code', '');

        $this->assertSame(1, $block->illustrations()->count());
    }

    public function test_admin_can_store_an_illustration_referencing_a_widget(): void
    {
        $this->actingAsAdmin();
        $block = Block::factory()->create();
        $widget = Widget::factory()->create();

        $this->postJson(route('api.admin.illustrations.store', $block), [
            'widget_id' => $widget->id,
            'code'      => 'dessin',
        ])->assertStatus(201)
            ->assertJsonPath('widget_id', $widget->id)
            ->assertJsonPath('code', 'dessin');
    }

    public function test_admin_can_upload_an_image(): void
    {
        $this->actingAsAdmin();
        Storage::fake('public');

        // UploadedFile::fake()->image() exige l'extension GD (absente ici) ;
        // create() avec un MIME image satisfait la règle de validation 'image'.
        $this->postJson(route('api.admin.illustrations.upload'), [
            'image' => UploadedFile::fake()->create('schema.png', 100, 'image/png'),
        ])->assertStatus(200)
            ->assertSee('illustrations');
    }

    public function test_upload_rejects_a_non_image_file(): void
    {
        $this->actingAsAdmin();
        Storage::fake('public');

        $this->postJson(route('api.admin.illustrations.upload'), [
            'image' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
        ])->assertStatus(422)->assertJsonValidationErrors(['image']);
    }

    public function test_upload_requires_a_file(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.illustrations.upload'), [])
            ->assertStatus(422)->assertJsonValidationErrors(['image']);
    }

    public function test_store_and_upload_require_admin(): void
    {
        $block = Block::factory()->create();

        $this->postJson(route('api.admin.illustrations.store', $block), [])->assertStatus(401);
        $this->postJson(route('api.admin.illustrations.upload'), [])->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.illustrations.store', $block), [])->assertForbidden();
        $this->postJson(route('api.admin.illustrations.upload'), [])->assertForbidden();
    }
}
