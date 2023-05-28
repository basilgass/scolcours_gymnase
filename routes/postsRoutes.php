<?php


use App\Http\Controllers\PostController;

//Route::resource('posts', PostController::class)
//	->only('show');
//Route::resource('chapters.posts', PostController::class)
//	->parameters([
//		"chapters" => "chapter:slug"
//	])
//	->shallow()
//	->except('show');

// Public
Route::get('chapters/{chapter:slug}/posts', [PostController::class, 'show'])
	->name("chapters.posts.index");

Route::middleware('can:admin')->group(function () {
	Route::get('chapters/{chapter:slug}/posts/create', [PostController::class, 'create'])
		->name("chapters.posts.create");
	Route::post('chapters/{chapter:slug}/posts', [PostController::class, 'store'])
		->name("chapters.posts.store");
	Route::get("posts/{post}/edit", [PostController::class, 'edit'])
		->name("posts.edit");
	Route::patch("posts/{post}", [PostController::class, 'update'])
		->name("posts.update");
	Route::delete("posts/{post}", [PostController::class, 'destroy'])
		->name("posts.destroy");

	Route::patch('posts/{post}/numberOfVisibleBlocks', [PostController::class, 'updateNumberOfVisibleBlocks'])
		->name('posts.updateNumberOfVisibleBlocks');
	Route::patch('posts/{post}/ordering', [PostController::class, 'updateBlocksOrder'])
		->name('posts.updateBlocksOrder');
	Route::patch('posts/{post}/updateQuestionsGrid', [PostController::class, 'updateQuestionsGrid'])
		->name('posts.updateQuestionsGrid');
	Route::get('posts/{post}/edit', [PostController::class, 'edit'])
		->name('posts.edit');
	Route::get('posts/{post}', [PostController::class, 'show'])
		->name('posts.show');

	// TODO: remove the display of one post as a separate item ?
	Route::get('posts/{post}', [PostController::class, 'show'])
		->name("posts.show");
});

//Route::patch('posts/{post}/questions/updateOrder', [PostController::class, 'updateQuestionsOrder'])->name('questions.updateOrder');
