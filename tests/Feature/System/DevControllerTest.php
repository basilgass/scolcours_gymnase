<?php

namespace Tests\Feature\System;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DevControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_index_lists_the_dev_pages_from_the_disk(): void
    {
        Storage::fake('devs');
        Storage::disk('devs')->put('MonComposant.vue', '<template></template>');

        $this->actingAsAdmin();

        $this->get(route('dev.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Devs/DevIndex')
                ->has('pages', 1)
                ->where('pages.0', 'MonComposant'));
    }

    public function test_admin_can_open_a_dev_page(): void
    {
        $this->actingAsAdmin();

        $this->get(route('dev.show', 'widget-demo'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Devs/DevShow')
                ->where('dev', 'widget-demo'));
    }

    public function test_dev_pages_are_restricted_to_admins(): void
    {
        $this->get(route('dev.index'))->assertRedirect();

        $this->actingAsUser();
        $this->get(route('dev.index'))->assertForbidden();
    }
}
