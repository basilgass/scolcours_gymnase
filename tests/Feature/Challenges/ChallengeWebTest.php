<?php

namespace Tests\Feature\Challenges;

use App\Models\Challenge;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ChallengeWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_is_public_and_renders_the_list_page(): void
    {
        Challenge::factory()->count(3)->create();

        $this->get(route('challenges.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Challenges/ChallengeIndex')
                ->has('challenges', 3)
            );
    }

    public function test_show_is_public_and_binds_by_slug(): void
    {
        $challenge = Challenge::factory()->create();

        $this->get(route('challenges.show', $challenge->slug))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Challenges/ChallengeShow')
                ->where('challenge.slug', $challenge->slug)
            );
    }

    public function test_show_recreates_a_missing_block(): void
    {
        $challenge = Challenge::factory()->create();

        // La cascade booted() crée un block ; on le retire pour atteindre la
        // branche défensive qui en recrée un.
        $challenge->blocks()->delete();
        $this->assertSame(0, $challenge->blocks()->count());

        $this->get(route('challenges.show', $challenge->slug))->assertStatus(200);

        $this->assertSame(1, $challenge->fresh()->blocks()->count());
    }

    public function test_edit_is_forbidden_for_guests(): void
    {
        $challenge = Challenge::factory()->create();

        // Groupe admin = auth:sanctum + verified + can:admin ; invité non authentifié.
        $this->get(route('admin.challenges.edit', $challenge))
            ->assertStatus(302);
    }

    public function test_edit_is_forbidden_for_non_admins(): void
    {
        $this->actingAsUser();
        $challenge = Challenge::factory()->create();

        $this->get(route('admin.challenges.edit', $challenge))
            ->assertForbidden();
    }

    public function test_admin_can_reach_edit_page(): void
    {
        $this->actingAsAdmin();
        $challenge = Challenge::factory()->create();

        $this->get(route('admin.challenges.edit', $challenge))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Challenges/ChallengeEdit')
                ->where('challenge.id', $challenge->id)
            );
    }
}
