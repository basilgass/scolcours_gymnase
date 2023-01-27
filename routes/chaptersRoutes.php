<?php

use App\Http\Controllers\ChaptersController;

Route::resource('themes.chapters', ChaptersController::class)
	->parameters([
		'themes' => 'theme:slug',
		'chapters' => 'chapter:slug'
	])
	->shallow()
	->except('show');

Route::post('chapters/{chapter}/currentPost', [ChaptersController::class, 'updateCurrentPost'])->name('chapters.currentPost');
Route::patch('chapters/{chapter}/ordering', [ChaptersController::class, 'updatePostsOrder'])->name('chapters.updatePostsOrder');

// Themes and chapters main routes
Route::get('{theme:slug}/', [ChaptersController::class, 'index'])->name('theme');
Route::get('{theme:slug}/{chapter:slug}', [ChaptersController::class, 'intro'])->name('theme.chapter.intro');
Route::get('{theme:slug}/{chapter:slug}/complete', [ChaptersController::class, 'page'])->name('theme.chapter');
Route::get('{theme:slug}/{chapter:slug}/{order}', [ChaptersController::class, 'slide'])->name('theme.chapter.slide');
