<?php

Route::middleware("can:admin")->group(function () {
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

	Route::get('team/{team:name}/stats2/{chapter:slug}', [\App\Http\Controllers\TeamController::class, "statsByUser"])
		->withoutScopedBindings();

});
