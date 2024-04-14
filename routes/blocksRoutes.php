<?php

use App\Http\Controllers\BlockController;
use App\Http\Controllers\PostController;

// TODO: Check that getting the components is no more used.
//Route::get('blocks/components', [BlockController::class, 'fetchWidgets'])
//    ->name('illustrations.components');

// Go to a particular block from a post -> redirects to themes.chapters.slide.anchor
Route::get('blocks/{block}', [BlockController::class, 'show'])
	->name('blocks.show');

// ---------------------
// Admin routes
// ---------------------
Route::middleware('can:admin')->group(function () {

	// Get
	Route::get('blocks/{block}/edit', [BlockController::class, 'edit'])
		->name('blocks.edit');


	// Posts
	Route::post('posts/{post}/blocks/create', [BlockController::class, 'storeInPost'])
		->name('posts.blocks.store');


	// Patch
	Route::patch('blocks/{block}', [BlockController::class, 'update'])
		->name("blocks.update");
	Route::patch('blocks/{block}/template', [BlockController::class, 'updateTemplate'])
		->name("blocks.updateTemplate");
	Route::patch('blocks/{block}/blur', [BlockController::class, 'toggleblur'])
		->name('blocks.blur');
	Route::patch('blocks/{block}/switch', [BlockController::class, 'toggleswitch'])
		->name('blocks.switch');
	Route::patch('blocks/{block}/moveTo/post/{post}', [BlockController::class, 'moveBlockToPost'])
		->name('blocks.moveTo.post');
	Route::patch('post/{post}/moveTo/chapter/{chapter}', [PostController::class, 'movePostToChapter'])
		->name('posts.moveTo.chapter');
	Route::patch('blocks/{block}/move', [BlockController::class, 'move'])
		->name('blocks.move');


	// Delete
	Route::delete('blocks/{block}', [BlockController::class, 'destroy'])
		->name("blocks.destroy");


});
