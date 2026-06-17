<?php

namespace Tests\Feature\Challenges;

use App\Models\Challenge;
use App\Models\ChallengeLevel;
use App\Models\Generator;
use App\Models\Generatorable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChallengeLevelApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_creates_the_first_level_with_defaults(): void
    {
        $this->actingAsAdmin();
        $challenge = Challenge::factory()->create();

        $this->postJson(route('api.admin.challengelevels.store', $challenge))
            ->assertStatus(201)
            ->assertJsonPath('level_number', 1)
            ->assertJsonPath('points_to_pass', 5);
    }

    public function test_store_increments_number_and_inherits_points(): void
    {
        $this->actingAsAdmin();
        $challenge = Challenge::factory()->create();
        ChallengeLevel::factory()->create([
            'challenge_id'   => $challenge->id,
            'level_number'   => 1,
            'points_to_pass' => 42,
        ]);

        $this->postJson(route('api.admin.challengelevels.store', $challenge))
            ->assertStatus(201)
            ->assertJsonPath('level_number', 2)
            ->assertJsonPath('points_to_pass', 42);
    }

    public function test_store_requires_admin(): void
    {
        $challenge = Challenge::factory()->create();

        $this->postJson(route('api.admin.challengelevels.store', $challenge))
            ->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.challengelevels.store', $challenge))
            ->assertForbidden();
    }

    public function test_update_persists_valid_points(): void
    {
        $this->actingAsAdmin();
        $level = ChallengeLevel::factory()->create(['points_to_pass' => 5]);

        $this->patchJson(route('api.admin.challengelevels.update', $level), [
            'points_to_pass' => 12,
        ])->assertStatus(200);

        $this->assertSame(12, $level->fresh()->points_to_pass);
    }

    public function test_update_rejects_invalid_points(): void
    {
        $this->actingAsAdmin();
        $level = ChallengeLevel::factory()->create();

        $this->patchJson(route('api.admin.challengelevels.update', $level), [
            'points_to_pass' => 0,
        ])->assertStatus(422)->assertJsonValidationErrors(['points_to_pass']);
    }

    public function test_destroy_renumbers_following_levels(): void
    {
        $this->actingAsAdmin();
        $challenge = Challenge::factory()->create();
        $l1 = ChallengeLevel::factory()->create(['challenge_id' => $challenge->id, 'level_number' => 1]);
        $l2 = ChallengeLevel::factory()->create(['challenge_id' => $challenge->id, 'level_number' => 2]);
        $l3 = ChallengeLevel::factory()->create(['challenge_id' => $challenge->id, 'level_number' => 3]);

        $this->deleteJson(route('api.admin.challengelevels.destroy', $l2))
            ->assertStatus(200);

        $this->assertModelMissing($l2);
        $this->assertSame(1, $l1->fresh()->level_number);
        $this->assertSame(2, $l3->fresh()->level_number); // décrémenté de 3 -> 2
    }

    public function test_destroy_refuses_the_last_remaining_level(): void
    {
        $this->actingAsAdmin();
        $challenge = Challenge::factory()->create();
        $level = ChallengeLevel::factory()->create(['challenge_id' => $challenge->id, 'level_number' => 1]);

        $this->deleteJson(route('api.admin.challengelevels.destroy', $level))
            ->assertStatus(422);

        $this->assertModelExists($level);
    }

    public function test_destroy_refuses_a_level_with_generators(): void
    {
        $this->actingAsAdmin();
        $challenge = Challenge::factory()->create();
        $l1 = ChallengeLevel::factory()->create(['challenge_id' => $challenge->id, 'level_number' => 1]);
        $l2 = ChallengeLevel::factory()->create(['challenge_id' => $challenge->id, 'level_number' => 2]);
        $l1->generators()->attach(Generator::factory()->create(), ['order' => 1]);

        $this->deleteJson(route('api.admin.challengelevels.destroy', $l1))
            ->assertStatus(422);

        $this->assertModelExists($l1);
    }

    public function test_attach_generator_adds_a_pivot_with_order(): void
    {
        $this->actingAsAdmin();
        $level = ChallengeLevel::factory()->create();
        $generator = Generator::factory()->create();

        $this->postJson(route('api.admin.challengelevels.generators.attach', [
            'challengeLevel' => $level,
            'generator'      => $generator,
        ]))->assertStatus(200);

        $pivot = Generatorable::where('generatorable_type', ChallengeLevel::class)
            ->where('generatorable_id', $level->id)
            ->first();

        $this->assertNotNull($pivot);
        $this->assertSame($generator->id, $pivot->generator_id);
        $this->assertSame(1, $pivot->order);
    }

    public function test_detach_generator_removes_the_pivot(): void
    {
        $this->actingAsAdmin();
        $level = ChallengeLevel::factory()->create();
        $level->generators()->attach(Generator::factory()->create(), ['order' => 1]);
        $pivot = Generatorable::where('generatorable_id', $level->id)->firstOrFail();

        $this->postJson(route('api.admin.challengelevels.generators.detach', [
            'challengeLevel' => $level,
            'generatorable'  => $pivot->id,
        ]))->assertStatus(200);

        $this->assertModelMissing($pivot);
    }

    public function test_update_generator_config_writes_pivot_fields(): void
    {
        $this->actingAsAdmin();
        $level = ChallengeLevel::factory()->create();
        $level->generators()->attach(Generator::factory()->create(), ['order' => 1]);
        $pivot = Generatorable::where('generatorable_id', $level->id)->firstOrFail();

        $this->patchJson(route('api.admin.challengelevels.generators.update', [
            'challengeLevel' => $level,
            'generatorable'  => $pivot->id,
        ]), [
            'time_per_question' => 30,
            'parameters'        => ['difficulty' => 'hard'],
        ])->assertStatus(200);

        $pivot->refresh();
        $this->assertSame(['time_per_question' => 30], json_decode($pivot->config, true));
        $this->assertSame(['difficulty' => 'hard'], json_decode($pivot->parameters, true));
    }

    public function test_pivot_routes_reject_a_generatorable_from_another_level(): void
    {
        $this->actingAsAdmin();
        $levelA = ChallengeLevel::factory()->create();
        $levelB = ChallengeLevel::factory()->create();
        $levelA->generators()->attach(Generator::factory()->create(), ['order' => 1]);
        $pivotA = Generatorable::where('generatorable_id', $levelA->id)->firstOrFail();

        // Pivot de A ciblé via le niveau B : doit être rejeté (sécurité de scoping).
        $this->postJson(route('api.admin.challengelevels.generators.detach', [
            'challengeLevel' => $levelB,
            'generatorable'  => $pivotA->id,
        ]))->assertStatus(404);

        $this->patchJson(route('api.admin.challengelevels.generators.update', [
            'challengeLevel' => $levelB,
            'generatorable'  => $pivotA->id,
        ]), ['time_per_question' => 10])->assertStatus(404);

        $this->assertModelExists($pivotA);
    }
}
