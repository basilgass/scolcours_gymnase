<?php

namespace Tests\Feature\System;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserApiControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_verified_user_can_view_a_user_profile_with_courses(): void
    {
        // Le middleware 'students' = auth:sanctum + verified (sans can:admin) :
        // un utilisateur vérifié non-admin y accède.
        $this->actingAsUser();
        $target = User::factory()->create();

        $this->getJson(route('api.students.users.show', $target))
            ->assertStatus(200)
            ->assertJsonPath('user.id', $target->id)
            ->assertJsonStructure(['user' => ['id'], 'courses']);
    }

    public function test_show_requires_an_authenticated_user(): void
    {
        $target = User::factory()->create();

        $this->getJson(route('api.students.users.show', $target))
            ->assertStatus(401);
    }
}
