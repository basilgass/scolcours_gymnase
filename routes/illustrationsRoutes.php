<?php

use App\Http\Controllers\BlockController;
use App\Http\Controllers\IllustrationController;

// Go to a particular illustration from a post -> redirects to themes.chapters.slide.anchor
Route::get('illustrations/{illustration}', [IllustrationController::class, 'show'])
	->name('illustrations.show');


// ---------------------
// Admin routes
// ---------------------
Route::middleware('can:admin')->group(function () {
	// GET
	Route::get('illustrations/{illustration}/edit', [IllustrationController::class, 'edit'])
		->name('illustrations.edit');


	// POST
	Route::post('illustrations/store/to/blocks/{block}', [IllustrationController::class, 'store'])
		->name('illustrations.store');
	Route::post('image', [IllustrationController::class, "upload"])
		->name('images.upload');


	// PATCH
	Route::patch('illustrations/{illustration}/update', [IllustrationController::class, 'update'])
		->name('illustrations.update');

	// TODO: Move blocks illustrations to block or keep it in Illustrations
	Route::patch('blocks/{block}/illustrations/updateOrder', [BlockController::class, 'updateIllustrationsOrder'])
		->name('blocks.illustrations.order');
	Route::patch('blocks/{block}/updateIllustrationsGrid', [BlockController::class, 'updateIllustrationsGrid'])
		->name('blocks.updateIllustrationsGrid');


	// DELETE
	Route::delete('illustrations/{illustration}/destroy', [IllustrationController::class, 'destroy'])
		->name('illustrations.destroy');
});
