<?php

namespace Tests\Feature\Smoke;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_is_public(): void
    {
        $this->get(route('scolcours.index'))->assertStatus(200);
    }

    public function test_dashboard_requires_authentication(): void
    {
        $this->get(route('users.dashboard'))->assertRedirect();
    }

    public function test_authenticated_user_reaches_dashboard(): void
    {
        $this->actingAsUser();

        // 'auth' + 'verified' : l'utilisateur factory est vérifié (email_verified_at).
        $this->get(route('users.dashboard'))->assertStatus(200);
    }
}
