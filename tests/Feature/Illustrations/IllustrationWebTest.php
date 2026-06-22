<?php

namespace Tests\Feature\Illustrations;

use App\Models\Illustration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class IllustrationWebTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('widgets');
    }

    public function test_admin_can_open_the_edit_page_with_parent_info(): void
    {
        $this->actingAsAdmin();
        // La factory rattache l'illustration à un block dont le blockable est un Post.
        $illustration = Illustration::factory()->create();
        $parent = $illustration->block->blockable;

        $this->get(route('admin.illustrations.edit', $illustration))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Illustrations/IllustrationEdit')
                ->where('illustration.id', $illustration->id)
                ->where('parent.id', $parent->id)
                ->where('parent.type', 'Post'));
    }

    public function test_edit_is_restricted_to_admins(): void
    {
        $illustration = Illustration::factory()->create();

        $this->get(route('admin.illustrations.edit', $illustration))->assertRedirect();

        $this->actingAsUser();
        $this->get(route('admin.illustrations.edit', $illustration))->assertForbidden();
    }
}
