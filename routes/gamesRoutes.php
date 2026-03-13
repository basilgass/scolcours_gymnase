<?php


use Inertia\Inertia;


Route::get('jeux/{game}', function (string $game) {
	$component = ucfirst($game);
	if (!file_exists(resource_path('js/Pages/Games/' . $component . '.vue'))) {
		return Inertia::render('Error404', [
			'error' => $game
		]);
	}
	return Inertia::render('Games/' . $component);
});
