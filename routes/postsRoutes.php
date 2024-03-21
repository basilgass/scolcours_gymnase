<?php

use App\Http\Controllers\PostController;

// Public routes
Route::get('posts/{post}', [PostController::class, 'show'])
	->name('posts.show');

// Admin routes
Route::middleware('can:admin')->group(function () {
	// GET
	Route::get("posts/{post}/edit", [PostController::class, 'edit'])
		->name("posts.edit");
	Route::get('posts/{post}/info', [PostController::class, 'info'])
		->name('posts.info');


	// POST
	Route::post('chapters/{chapter:slug}/posts', [PostController::class, 'store'])
		->name("chapters.posts.store");


	// PATCH
	Route::patch("posts/{post}", [PostController::class, 'update'])
		->name("posts.update");
	Route::patch('posts/{post}/ordering', [PostController::class, 'updateBlocksOrder'])
		->name('posts.updateBlocksOrder');
	Route::patch('posts/{post}/update/questionsGrid', [PostController::class, 'updateQuestionsGrid'])
		->name('posts.updateQuestionsGrid');


	// DELETE
	Route::delete("posts/{post}", [PostController::class, 'destroy'])
		->name("posts.destroy");

});
