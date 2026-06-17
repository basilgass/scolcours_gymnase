<?php

namespace Tests\Feature\Challenges;

use App\Models\Challenge;
use App\Models\Chapter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChallengeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_is_public_and_orders_by_title(): void
    {
        Challenge::factory()->create(['title' => 'Zeta']);
        Challenge::factory()->create(['title' => 'Alpha']);

        $response = $this->getJson(route('api.challenges.index'))->assertStatus(200);

        $titles = collect($response->json())->pluck('title')->all();
        $this->assertSame(['Alpha', 'Zeta'], $titles);
    }

    public function test_show_is_public(): void
    {
        $challenge = Challenge::factory()->create();

        $this->getJson(route('api.challenges.show', $challenge))
            ->assertStatus(200)
            ->assertJsonPath('slug', $challenge->slug);
    }

    public function test_store_requires_admin(): void
    {
        $chapter = Chapter::factory()->create();

        // Invité
        $this->postJson(route('api.admin.chapters.challenges.store', $chapter), [
            'title' => 'Un titre valide',
        ])->assertStatus(401);

        // Utilisateur non-admin
        $this->actingAsUser();
        $this->postJson(route('api.admin.chapters.challenges.store', $chapter), [
            'title' => 'Un titre valide',
        ])->assertForbidden();

        $this->assertSame(0, Challenge::count());
    }

    public function test_store_validates_title_min_length(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();

        $this->postJson(route('api.admin.chapters.challenges.store', $chapter), [
            'title' => 'abc',
        ])->assertStatus(422)->assertJsonValidationErrors(['title']);
    }

    public function test_admin_can_create_a_challenge_with_a_block(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();

        $response = $this->post(route('api.admin.chapters.challenges.store', $chapter), [
            'title' => 'Mon nouveau challenge',
        ]);

        $response->assertRedirect();

        $challenge = Challenge::where('slug', 'mon-nouveau-challenge')->first();
        $this->assertNotNull($challenge);
        $this->assertSame($chapter->id, $challenge->chapter_id);
        $this->assertSame(1, $challenge->blocks()->count());
    }

    public function test_store_does_not_duplicate_an_existing_slug(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();
        Challenge::factory()->create(['slug' => 'titre-existant', 'title' => 'Titre existant']);

        $this->post(route('api.admin.chapters.challenges.store', $chapter), [
            'title' => 'Titre existant',
        ])->assertRedirect();

        $this->assertSame(1, Challenge::where('slug', 'titre-existant')->count());
    }

    public function test_update_persists_valid_attributes(): void
    {
        $this->actingAsAdmin();
        $challenge = Challenge::factory()->create(['active' => false, 'lives' => 3]);

        $this->patchJson(route('api.admin.challenges.update', $challenge), [
            'slug'       => 'slug-maj',
            'title'      => 'Titre maj',
            'active'     => true,
            'time_limit' => 10,
            'lives'      => 5,
            'type'       => 'classic',
        ])->assertStatus(200);

        $challenge->refresh();
        $this->assertSame('slug-maj', $challenge->slug);
        $this->assertSame('Titre maj', $challenge->title);
        $this->assertSame(5, $challenge->lives);
        $this->assertTrue((bool) $challenge->active);
    }

    public function test_update_rejects_invalid_attributes(): void
    {
        $this->actingAsAdmin();
        $challenge = Challenge::factory()->create();

        // slug trop court, type hors liste
        $this->patchJson(route('api.admin.challenges.update', $challenge), [
            'slug'  => 'a',
            'title' => 'ok titre',
            'type'  => 'inexistant',
        ])->assertStatus(422)->assertJsonValidationErrors(['slug', 'type']);
    }

    public function test_update_requires_admin(): void
    {
        $challenge = Challenge::factory()->create();

        $this->patchJson(route('api.admin.challenges.update', $challenge), [
            'slug' => 'x', 'title' => 'y',
        ])->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.challenges.update', $challenge), [
            'slug' => 'x', 'title' => 'y',
        ])->assertForbidden();
    }

    public function test_admin_can_delete_a_challenge(): void
    {
        $this->actingAsAdmin();
        // forChapter() monte la chaîne Theme -> Chapter -> Challenge requise par
        // destroy (qui lit $challenge->chapter->theme->slug).
        $challenge = Challenge::factory()->forChapter()->create();

        $this->deleteJson(route('api.admin.challenges.destroy', $challenge))
            ->assertStatus(200);

        $this->assertModelMissing($challenge);
    }

    public function test_destroy_requires_admin(): void
    {
        $challenge = Challenge::factory()->forChapter()->create();

        $this->deleteJson(route('api.admin.challenges.destroy', $challenge))
            ->assertStatus(401);

        $this->actingAsUser();
        $this->deleteJson(route('api.admin.challenges.destroy', $challenge))
            ->assertForbidden();

        $this->assertModelExists($challenge);
    }
}
