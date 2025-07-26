<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\api\ChallengeApiController;
use App\Http\Controllers\web\ChallengeController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     // Redirect routes to challenge.
	     Route::get('q/{challenge:slug}', [ChallengeController::class, 'quick'])
	          ->name("challenges.show");

	     // Challenge route show.
	     // REFACTOR : use resource

	     Route::get('{theme:slug}/{chapter:slug}/challenges/{challenge:slug}', [ChallengeController::class, 'show'])
	          ->withoutScopedBindings()
	          ->name('chapters.challenges.show');

	     // Admin routes
	     Route::middleware('admin')
	          ->as('admin.')
	          ->group(function () {

		          // ROUTE: Ces routes sont elles utiles ?
		          Route::resource('challenges', ChallengeController::class)
		               ->only(['edit']);

		          // ROUTE: Refactor this path.
		          Route::get('{theme:slug}/{chapter:slug}/challenges/{challenge:slug}/team/{team:name}', [ChallengeApiController::class, 'teams'])
		               ->withoutScopedBindings()
		               ->name('challenges.team');
	          });
     });




Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.
	     Route::apiResource('challenges', ChallengeApiController::class)
		     ->only(['index', 'show']);


	     // Admin api
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {

		          Route::apiResource('chapters.challenges', ChallengeApiController::class)
		               ->shallow();


		          Route::prefix('challenges')
		               ->as('challenges.')
		               ->group(function () {
			               Route::get('{challenge}/generators', [ChallengeApiController::class, 'indexGenerator'])
			                    ->name('generators.index');
			               Route::patch('{challenge}/generators/order', [ChallengeApiController::class, "updateGeneratorsOrder"])
			                    ->name('generators.updateOrder');
			               Route::post("{challenge}/generators", [ChallengeApiController::class, "storeGenerator"])
			                    ->name('generators.store');
			               Route::post("{challenge}/generators/{generator}/attach", [ChallengeApiController::class, "attachGenerator"])
			                    ->name('generators.attach');
			               Route::post("{challenge}/generators/{generator}/detach", [ChallengeApiController::class, "detachGenerator"])
			                    ->name('generators.detach');
		               });
	          });

     });
