<?php

use App\Http\Controllers\ChallengeController;

// Public routes.
Route::get('q/{challenge:slug}', [ChallengeController::class, 'quick'])
	->name("challenges.show");
Route::get('{theme:slug}/{chapter:slug}/challenges/{challenge:slug}', [ChallengeController::class, 'show'])
	->name('chapters.challenge');

Route::middleware("can:admin")->group(function (){
	Route::post('chapters/{chapter}/challenges ', [ChallengeController::class, "store"])
		->name("chapters.challenges.store");
	Route::patch('challenges/{challenge} ', [ChallengeController::class, "update"])
		->name("challenges.update");
	Route::delete('challenges/{challenge} ', [ChallengeController::class, "destroy"])
		->name("challenges.destroy");

	// Generators handling inside the challenge
	Route::get('challenges/{challenge}/generators', [ChallengeController::class, 'indexGenerator'])
		->name('challenges.generators.index');
	Route::patch('challenges/{challenge}/generators/order', [ChallengeController::class, "updateGeneratorsOrder"])
		->name('challenges.generators.updateOrder');
	Route::post("challenges/{challenge}/generators", [ChallengeController::class, "storeGenerator"])
		->name('challenges.generators.store');
	Route::post("challenges/{challenge}/generators/{generator}/attach", [ChallengeController::class, "attachGenerator"])
		->name('challenges.generators.attach');
	Route::post("challenges/{challenge}/generators/{generator}/detach", [ChallengeController::class, "detachGenerator"])
		->name('challenges.generators.detach');
//	Route::apiResource('chapters.challenges', ChallengeController::class)
//		->parameters([
//			"chapters" => "chapter:slug"
//		])
//		->shallow();

	Route::get('challenges/{challenge}/edit', [ChallengeController::class, 'edit'])
		->name('challenges.edit');


	Route::get('{theme:slug}/{chapter:slug}/challenges/{challenge:slug}/team/{team:name}', [ChallengeController::class, 'teams'])
		->withoutScopedBindings()
		->name('challenges.team');
});
