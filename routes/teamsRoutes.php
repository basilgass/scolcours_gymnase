<?php

Route::middleware("can:admin")->group(function () {
	Route::get('teams', [\App\Http\Controllers\TeamController::class, "index"])
		->name('teams.index');
	Route::get('teams/{team:name}', [\App\Http\Controllers\TeamController::class, 'show'])
		->name('teams.show');
	Route::get('teams/{team:name}/challenge/{challenge:slug}', [\App\Http\Controllers\TeamController::class, 'challenge'])
		->withoutScopedBindings()
		->name('teams.challenge');

	Route::get('teams/{team:name}/stats/{chapter:slug}', [\App\Http\Controllers\TeamController::class, "stats"])
		->withoutScopedBindings()
		->name('teams.chapters.stats');

	Route::get('teams/{team:name}/stats2/{chapter:slug}', [\App\Http\Controllers\TeamController::class, "statsByUser"])
		->withoutScopedBindings();

});
