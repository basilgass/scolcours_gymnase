<?php

namespace Tests\Feature\Routes;

use Tests\TestCase;

class ApiStudentsRoutesRenameTest extends TestCase
{
    // Routes protégées par le middleware students → requête non-authentifiée → 302

    public function test_api_students_scores_reset_route_exists(): void
    {
        $this->patch(route('api.students.scores.reset'))
            ->assertRedirect();
    }

    public function test_api_students_cards_show_route_exists(): void
    {
        $this->get(route('api.students.cards.show', ['card' => 1]))
            ->assertRedirect();
    }

    public function test_api_teams_courses_calendars_index_route_exists(): void
    {
        $this->get(route('api.teams.courses.calendars.index', ['team' => 1, 'course' => 1]))
            ->assertRedirect();
    }
}
