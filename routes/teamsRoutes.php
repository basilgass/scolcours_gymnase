<?php

Route::get('team/{team:name}/challenge/{challenge:slug}', [\App\Http\Controllers\TeamController::class, 'challenge'])
	->withoutScopedBindings()
	->name('teams.challenge');
//Route::get('challenges/{challenge:slug}/team/{team:name}', [ChallengesController::class, 'teams'])->name('challenges.team');
