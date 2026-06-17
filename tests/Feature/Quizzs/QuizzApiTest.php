<?php

namespace Tests\Feature\Quizzs;

use App\Models\Chapter;
use App\Models\Quizz;
use App\Models\Theme;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizzApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_creates_a_quizz_with_intro_and_outro_blocks(): void
    {
        $this->actingAsAdmin();

        $response = $this->postJson(route('api.admin.quizzes.store'));

        // store renvoie l'id brut du quizz (entier), pas une Resource → 200.
        $response->assertStatus(200);

        $quizz = Quizz::find($response->json());
        $this->assertNotNull($quizz);
        $this->assertSame('sans titre', $quizz->title);
        $this->assertSame(2, $quizz->blocks()->count());
        $this->assertSame('intro', $quizz->blocks[0]->title);
        $this->assertSame('outro', $quizz->blocks[1]->title);
    }

    public function test_store_requires_admin(): void
    {
        $this->postJson(route('api.admin.quizzes.store'))->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.quizzes.store'))->assertForbidden();

        $this->assertSame(0, Quizz::count());
    }

    public function test_update_persists_title_and_chapter(): void
    {
        $this->actingAsAdmin();
        $theme = Theme::factory()->create();
        $chapter = Chapter::factory()->create(['theme_id' => $theme->id]);
        $quizz = Quizz::factory()->create(['title' => 'ancien titre']);

        $this->patchJson(route('api.admin.quizzes.update', $quizz), [
            'title'      => 'nouveau titre',
            'chapter_id' => $chapter->id,
        ])->assertStatus(200);

        $quizz->refresh();
        $this->assertSame('nouveau titre', $quizz->title);
        $this->assertSame($chapter->id, $quizz->chapter_id);
    }

    public function test_update_rejects_a_too_short_title(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();

        $this->patchJson(route('api.admin.quizzes.update', $quizz), [
            'title' => 'a',
        ])->assertStatus(422)->assertJsonValidationErrors(['title']);
    }

    public function test_update_rejects_an_unknown_chapter(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();

        $this->patchJson(route('api.admin.quizzes.update', $quizz), [
            'chapter_id' => 999999,
        ])->assertStatus(422)->assertJsonValidationErrors(['chapter_id']);
    }

    public function test_update_requires_admin(): void
    {
        $quizz = Quizz::factory()->create(['title' => 'intact']);
        $payload = ['title' => 'piraté'];

        $this->patchJson(route('api.admin.quizzes.update', $quizz), $payload)
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.quizzes.update', $quizz), $payload)
            ->assertForbidden();

        $this->assertSame('intact', $quizz->fresh()->title);
    }

    public function test_destroy_deletes_the_quizz(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();

        $this->deleteJson(route('api.admin.quizzes.destroy', $quizz))
            ->assertStatus(200);

        $this->assertModelMissing($quizz);
    }

    public function test_destroy_requires_admin(): void
    {
        $quizz = Quizz::factory()->create();

        $this->deleteJson(route('api.admin.quizzes.destroy', $quizz))
            ->assertStatus(401);

        $this->actingAsUser();
        $this->deleteJson(route('api.admin.quizzes.destroy', $quizz))
            ->assertForbidden();

        $this->assertModelExists($quizz);
    }
}
