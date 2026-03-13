<?php

namespace Tests\Feature\Routes;

use Tests\TestCase;

/**
 * Ces tests vérifient uniquement que les noms de routes sont enregistrés dans Laravel.
 * Les routes API publiques requièrent une DB pour répondre ; on teste donc la résolution
 * du nom (route() → URL) sans faire de requête HTTP.
 */
class ApiPublicRoutesRenameTest extends TestCase
{
    public function test_api_school_timetables_index_route_exists(): void
    {
        $this->assertIsString(route('api.school.timetables.index'));
    }

    public function test_api_school_calendars_index_route_exists(): void
    {
        $this->assertIsString(route('api.school.calendars.index'));
    }

    public function test_api_chapters_posts_index_route_exists(): void
    {
        $this->assertIsString(route('api.chapters.posts.index', ['chapter' => 'fake-slug']));
    }

    public function test_api_teams_calendars_index_route_exists(): void
    {
        $this->assertIsString(route('api.teams.calendars.index', ['team' => 1]));
    }
}
