<?php

namespace Tests\Feature\System;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ScolcoursProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_open_the_dashboard(): void
    {
        $this->actingAsUser();

        $this->get(route('users.dashboard'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('DashboardPage')
                ->has('teams')
                ->has('courses'));
    }

    public function test_user_can_regenerate_their_pseudo(): void
    {
        $user = User::factory()->create(['pseudo' => null]);
        $this->actingAs($user, 'sanctum');

        $this->patchJson(route('profile.pseudo.regenerate'))
            ->assertStatus(200)
            ->assertJsonStructure(['pseudo']);

        $this->assertNotNull($user->fresh()->pseudo);
    }

    public function test_user_can_update_show_real_name(): void
    {
        $user = User::factory()->create(['show_real_name' => false]);
        $this->actingAs($user, 'sanctum');

        $this->patchJson(route('profile.showRealName.update'), ['show_real_name' => true])
            ->assertStatus(200)
            ->assertJsonPath('show_real_name', true);

        $this->assertTrue($user->fresh()->show_real_name);
    }

    public function test_update_show_real_name_validates_the_flag(): void
    {
        $this->actingAsUser();

        $this->patchJson(route('profile.showRealName.update'), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['show_real_name']);
    }

    public function test_profile_endpoints_require_authentication(): void
    {
        $this->get(route('users.dashboard'))->assertRedirect();
        $this->patch(route('profile.pseudo.regenerate'))->assertRedirect();
        $this->patch(route('profile.showRealName.update'))->assertRedirect();
    }
}
