<?php


use Inertia\Inertia;


Route::get('jeux/{game}', function (string $game) {
	if (!file_exists(resource_path('js/Pages/Games/' . $game . '.vue'))) {
		return Inertia::render('Error404', [
			'error' => $game
		]);
	}
	return Inertia::render('Games/' . $game);
});
