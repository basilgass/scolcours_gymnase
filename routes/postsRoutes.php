<?php


use App\Http\Controllers\PostController;

Route::resource('posts', PostController::class)
	->only('show');
Route::resource('chapters.posts', PostController::class)
	->parameters([
		"chapters" => "chapter:slug"
	])
	->shallow()->except('show');


Route::patch('posts/{post}/numberOfVisibleBlocks', [PostController::class, 'updateNumberOfVisibleBlocks'])->name('posts.updateNumberOfVisibleBlocks');
Route::patch('posts/{post}/ordering', [PostController::class, 'updateBlocksOrder'])->name('posts.updateBlocksOrder');
Route::patch('posts/{post}/updateQuestionsGrid', [PostController::class, 'updateQuestionsGrid'])->name('posts.updateQuestionsGrid');


Route::get('posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');

Route::patch('posts/{post}/questions/updateOrder', [PostController::class, 'updateQuestionsOrder'])->name('questions.updateOrder');
