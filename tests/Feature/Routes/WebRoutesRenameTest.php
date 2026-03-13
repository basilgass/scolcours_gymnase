<?php

namespace Tests\Feature\Routes;

use Tests\TestCase;

class WebRoutesRenameTest extends TestCase
{
	// ─── Web — Students ────────────────────────────────────────────────────────

	public function test_students_quizzes_sessions_index_route_exists(): void
	{
		$this
			->get(route('students.quizzes.sessions.index'))
			->assertRedirect();
	}

	public function test_students_quizzes_sessions_show_route_exists(): void
	{
		$this
			->get(route('students.quizzes.sessions.show', ['quizzSession' => 'fake-shortcode']))
			->assertRedirect();
	}

	// ─── Web — Admin ────────────────────────────────────────────────────────────

	public function test_admin_config_order_route_exists(): void
	{
		$this
			->patch(route('admin.config.order'))
			->assertRedirect();
	}

	public function test_admin_users_store_route_exists(): void
	{
		$this
			->post(route('admin.users.store'))
			->assertRedirect();
	}

	public function test_admin_courses_teams_dashboard_route_exists(): void
	{
		$this
			->get(route('admin.courses.teams.dashboard', ['course' => 'fake-slug', 'team' => 'fake-team']))
			->assertRedirect();
	}

	public function test_admin_courses_teams_lessons_show_route_exists(): void
	{
		$this
			->get(route('admin.courses.teams.lessons.show', ['course' => 'fake-slug', 'team' => 'fake-team', 'lesson' => 1]))
			->assertRedirect();
	}

	public function test_admin_courses_teams_show_route_exists(): void
	{
		$this
			->get(route('admin.courses.teams.show', ['course' => 'fake-slug', 'team' => 'fake-team']))
			->assertRedirect();
	}

	public function test_admin_quizzes_index_route_exists(): void
	{
		$this
			->get(route('admin.quizzes.index'))
			->assertRedirect();
	}

	public function test_admin_quizzes_edit_route_exists(): void
	{
		$this
			->get(route('admin.quizzes.edit', ['quizz' => 1]))
			->assertRedirect();
	}

	public function test_admin_quizzes_sessions_dashboard_route_exists(): void
	{
		$this
			->get(route('admin.quizzes.sessions.dashboard', ['quizzSession' => 'fake-shortcode']))
			->assertRedirect();
	}

	public function test_admin_quizzes_sessions_projection_route_exists(): void
	{
		$this
			->get(route('admin.quizzes.sessions.projection', ['quizzSession' => 'fake-shortcode']))
			->assertRedirect();
	}
}
