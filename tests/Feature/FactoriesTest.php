<?php

namespace Tests\Feature;

use App\Models\Challenge;
use App\Models\ChallengeLevel;
use App\Models\Generator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FactoriesTest extends TestCase
{
    use RefreshDatabase;

    public function test_challenge_factory_creates_a_challenge_with_a_block(): void
    {
        $challenge = Challenge::factory()->create();

        $this->assertDatabaseHas('challenges', ['id' => $challenge->id]);
        // booted() crée automatiquement un Block polymorphe.
        $this->assertSame(1, $challenge->blocks()->count());
    }

    public function test_challenge_level_factory_creates_with_a_parent_challenge(): void
    {
        $level = ChallengeLevel::factory()->create();

        $this->assertDatabaseHas('challenge_levels', ['id' => $level->id]);
        $this->assertInstanceOf(Challenge::class, $level->challenge);
    }

    public function test_generator_factory_creates_with_a_theme(): void
    {
        $generator = Generator::factory()->create();

        $this->assertDatabaseHas('generators', ['id' => $generator->id]);
        $this->assertNotNull($generator->theme);
    }

    public function test_acting_as_admin_helper_marks_user_as_admin(): void
    {
        $admin = $this->actingAsAdmin();
        $user = $this->actingAsUser();

        $this->assertTrue($admin->admin);
        $this->assertFalse($user->admin);
    }
}
