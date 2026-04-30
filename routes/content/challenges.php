<?php

use App\Http\Controllers\api\ChallengeApiController;
use App\Http\Controllers\api\ChallengeLevelApiController;
use App\Http\Controllers\web\ChallengeController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('challenges', ChallengeController::class)
	          ->only(['index', 'show']);

	     // Challenge route show.
	     Route::get('challenges/{challenge:slug}', [ChallengeController::class, 'show'])
	          ->name('challenges.show');

	     // Show hall of fame.
	     Route::get('challenges/{challenge:slug}/classement', [ChallengeController::class, 'leaderboard'])
	          ->name('challenges.leaderboard.show');

	     // Admin routes
	     Route::middleware('admin')
	          ->as('admin.')
	          ->prefix('admin')
	          ->group(function () {

		          Route::resource('challenges', ChallengeController::class)
		               ->only(['edit']);

	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.
	     Route::apiResource('challenges', ChallengeApiController::class)
	          ->only(['index', 'show']);

	     Route::get('challenges/{challenge}/leaderboard', [ChallengeApiController::class, 'leaderboard'])
	          ->name('challenges.leaderboard');

	     // Admin api
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {

		          Route::apiResource('chapters.challenges', ChallengeApiController::class)
		               ->only(['store', 'update', 'destroy'])
		               ->shallow();

		          Route::prefix('challengelevels')
		               ->as('challengelevels.')
		               ->group(function () {
			               Route::post('{challenge}/levels', [ChallengeLevelApiController::class, 'store'])
			                    ->name('store');
			               Route::patch('levels/{challengeLevel}', [ChallengeLevelApiController::class, 'update'])
			                    ->name('update');
			               Route::delete('levels/{challengeLevel}', [ChallengeLevelApiController::class, 'destroy'])
			                    ->name('destroy');
			               Route::post('levels/{challengeLevel}/generators/{generator}/attach', [ChallengeLevelApiController::class, 'attachGenerator'])
			                    ->name('generators.attach');
			               Route::post('levels/{challengeLevel}/generators/{generator}/detach', [ChallengeLevelApiController::class, 'detachGenerator'])
			                    ->name('generators.detach');
			               Route::patch('levels/{challengeLevel}/generators/{generator}', [ChallengeLevelApiController::class, 'updateGeneratorConfig'])
			                    ->name('generators.update');
		               });

		          Route::prefix('challenges')
		               ->as('challenges.')
		               ->group(function () {
			               Route::get('{challenge}/generators', [ChallengeApiController::class, 'indexGenerator'])
			                    ->name('generators.index');
			               Route::patch('{challenge}/generators/order', [ChallengeApiController::class, "updateGeneratorsOrder"])
			                    ->name('generators.order');
			               Route::post("{challenge}/generators", [ChallengeApiController::class, "storeGenerator"])
			                    ->name('generators.store');
			               Route::post("{challenge}/generators/{generator}/attach", [ChallengeApiController::class, "attachGenerator"])
			                    ->name('generators.attach');
			               Route::post("{challenge}/generators/{generator}/detach", [ChallengeApiController::class, "detachGenerator"])
			                    ->name('generators.detach');
		               });
	          });

     });
