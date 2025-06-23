<?php

use App\Http\Controllers\api\ChapterApiController;
use App\Http\Controllers\web\ChapterController;
use App\Models\Chapter;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('chapters', ChapterController::class)
	          ->only(['index']);
		 Route::get('chapters/{chapter:slug}', [ChapterController::class, 'show'])
			 ->name('chapters.show');

	     // Public routes
	     Route::get('{theme:slug}/', [ChapterController::class, 'index'])
	          ->name('theme');

	     Route::get('{theme:slug}/{chapter:slug}', [ChapterController::class, 'show'])
	          ->name('themes.chapters.show');



	     Route::get('chapters/{chapter}}/{order}', [ChapterController::class, 'slide'])
	          ->name('chapters.slide');



	     Route::get('{theme:slug}/{chapter:slug}/{order}', [ChapterController::class, 'slide'])
	          ->name('themes.chapters.posts.show');

	     Route::get('{theme:slug}/{chapter:slug}/{order}/{type}/{id}', [ChapterController::class, 'slide'])
	          ->where('type', 'block|illustration|question')
	          ->name('themes.chapters.posts.anchor');



	     // Redirection
//	     Route::get('chapter/{chapter:slug}', function (Chapter $chapter) {
//		     return redirect()->route('themes.chapters.intro', [$chapter->theme->slug, $chapter->slug]);
//	     })->name('chapters.show');


	     // Students routes
	     Route::middleware('students')
		     ->prefix('students')
		     ->as('students.')
	          ->group(function () {

	          });


	     // Admin routes
	     Route::middleware('admin')
		     ->prefix('admin')
		     ->as('admin.')
		     ->group(function () {
		          Route::resource('chapters', ChapterController::class)
		               ->only(['show', 'index', 'edit']);
	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.

	     // Get basic chapter info
	     Route::get('chapters/{chapter}/info', [ChapterApiController::class, 'info'])
	          ->name('chapters.info');

	     Route::get("chapters/{chapter:slug}/theorems", [ChapterApiController::class, 'getTheoremsFromChapter'])
	          ->name('chapters.theorems.index');

	     // Students api
	     Route::middleware('students')
	          ->group(function () {

	          });

	     // Admin api
	     Route::middleware('admin')
	          ->group(function () {

		          Route::apiResource('themes.chapters', ChapterApiController::class)
		               ->shallow();

		          Route::prefix('chapters')
		               ->as('chapters.')
		               ->group(function () {
			               Route::post('{chapter}/currentPost', [ChapterApiController::class, 'updateCurrentPost'])
			                    ->name('currentPost');
			               Route::patch('{chapter}/ordering', [ChapterApiController::class, 'updatePostsOrder'])
			                    ->name('updatePostsOrder');
			               Route::post('{chapter}/relations/{related}', [ChapterApiController::class, 'toggleRelated'])
			                    ->name('relations.toggle');
		               });
	          });

     });
