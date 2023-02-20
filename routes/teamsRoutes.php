<?php

Route::get('team', [\App\Http\Controllers\TeamController::class, "index"])
	->name('teams.index');
Route::get('team/{team:name}', [\App\Http\Controllers\TeamController::class, 'show'])
	->name('teams.show');
Route::get('team/{team:name}/challenge/{challenge:slug}', [\App\Http\Controllers\TeamController::class, 'challenge'])
	->withoutScopedBindings()
	->name('teams.challenge');

Route::get('team/{team:name}/stats/{chapter:slug}', [\App\Http\Controllers\TeamController::class, "stats"])
	->withoutScopedBindings()
	->name('teams.chapters.stats');
//Route::get('challenges/{challenge:slug}/team/{team:name}', [ChallengesController::class, 'teams'])->name('challenges.team');
