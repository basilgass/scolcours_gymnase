<?php

namespace Tests\Feature\Admin;

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_the_users_page(): void
    {
        $this->actingAsAdmin();
        User::factory()->count(2)->create();
        Team::factory()->create(['active' => true]);

        $this->get(route('admin.users.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/AdminUser')
                ->has('users')
                ->has('teams', 1));
    }

    public function test_create_users_parses_emails_into_names(): void
    {
        $this->actingAsAdmin();

        $this->post(route('admin.users.store'), [
            'users'    => ['jean.dupont@ecole.ch', 'admin@ecole.ch'],
            'password' => 'secret123',
        ])->assertRedirect(route('admin.users.index'));

        // "prenom.nom" → firstname Jean / name Dupont (ucwords).
        $this->assertDatabaseHas('users', [
            'email'     => 'jean.dupont@ecole.ch',
            'firstname' => 'Jean',
            'name'      => 'Dupont',
        ]);
        // Email sans point → name seul, firstname vide.
        $this->assertDatabaseHas('users', [
            'email'     => 'admin@ecole.ch',
            'firstname' => '',
            'name'      => 'Admin',
        ]);
    }

    public function test_create_users_validates_its_input(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('admin.users.store'), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['users', 'password']);
    }

    public function test_admin_can_update_a_user_name(): void
    {
        $this->actingAsAdmin();
        $user = User::factory()->create(['name' => 'Avant', 'firstname' => 'Pre']);

        $this->patchJson(route('admin.users.update', $user), [
            'name'      => 'Apres',
            'firstname' => 'Nouveau',
        ])->assertStatus(200)
          ->assertJsonPath('name', 'Apres');

        $fresh = $user->fresh();
        $this->assertSame('Apres', $fresh->name);
        $this->assertSame('Nouveau', $fresh->firstname);
    }

    public function test_update_user_requires_name_and_firstname(): void
    {
        $this->actingAsAdmin();
        $user = User::factory()->create();

        $this->patchJson(route('admin.users.update', $user), ['name' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'firstname']);
    }

    public function test_admin_can_delete_a_user(): void
    {
        $this->actingAsAdmin();
        $user = User::factory()->create();

        $this->delete(route('admin.users.destroy', $user))
            ->assertStatus(200);

        $this->assertModelMissing($user);
    }

    public function test_user_management_endpoints_require_admin(): void
    {
        $user = User::factory()->create();

        $this->post(route('admin.users.store'))->assertRedirect();
        $this->patch(route('admin.users.update', $user))->assertRedirect();
        $this->delete(route('admin.users.destroy', $user))->assertRedirect();

        $this->actingAsUser();
        $this->post(route('admin.users.store'))->assertForbidden();
        $this->patch(route('admin.users.update', $user))->assertForbidden();
        $this->delete(route('admin.users.destroy', $user))->assertForbidden();
    }
}
