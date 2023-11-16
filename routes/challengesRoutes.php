<?php

use App\Http\Controllers\ChallengesController;

// Public routes.
Route::get('q/{challenge:slug}', [ChallengesController::class, 'quick'])
	->name("challenges.show");
Route::get('{theme:slug}/{chapter:slug}/challenges/{challenge:slug}', [ChallengesController::class, 'show'])
	->name('chapters.challenge');

Route::middleware("can:admin")->group(function (){
	Route::post('chapters/{chapter}/challenges ', [ChallengesController::class, "store"])
		->name("chapters.challenges.store");
	Route::patch('challenges/{challenge} ', [ChallengesController::class, "update"])
		->name("challenges.update");
	Route::delete('challenges/{challenge} ', [ChallengesController::class, "destroy"])
		->name("challenges.destroy");

	// Generators handling inside the challenge
	// TODO: make the generators route more "customisable"
	Route::get('challenges/{challenge}/generators', [ChallengesController::class, 'indexGenerator'])
		->name('challenges.generators.index');
	Route::patch('challenges/{challenge}/generators/order', [ChallengesController::class, "updateGeneratorsOrder"])
		->name('challenges.generators.updateOrder');
	Route::post("challenges/{challenge}/generators", [ChallengesController::class, "storeGenerator"])
		->name('challenges.generators.store');
	Route::post("challenges/{challenge}/generators/{generator}/attach", [ChallengesController::class, "attachGenerator"])
		->name('challenges.generators.attach');
	Route::post("challenges/{challenge}/generators/{generator}/detach", [ChallengesController::class, "detachGenerator"])
		->name('challenges.generators.detach');
//	Route::apiResource('chapters.challenges', ChallengesController::class)
//		->parameters([
//			"chapters" => "chapter:slug"
//		])
//		->shallow();

	Route::get('challenges/{challenge}/edit', [ChallengesController::class, 'edit'])
		->name('challenges.edit');


	Route::get('{theme:slug}/{chapter:slug}/challenges/{challenge:slug}/team/{team:name}', [ChallengesController::class, 'teams'])
		->withoutScopedBindings()
		->name('challenges.team');
});
