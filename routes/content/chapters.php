<?php

use App\Http\Controllers\api\ChapterApiController;
use App\Http\Controllers\web\ChapterController;
use App\Models\Chapter;
use Illuminate\Support\Facades\Route;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('chapters', ChapterController::class)
	          ->only(['index']);

	     // ROUTE: Rendre les choses plus logique (dans le Controller, et déplacer le "slide" dans une autre fonction.
	     Route::get('chapters/{chapter}', function (Chapter $chapter) {
		     return redirect()->route('themes.chapters.show', [
			     "theme"   => $chapter->theme,
			     "chapter" => $chapter
		     ]);
	     })->name('chapters.show');

	     // Public routes
	     Route::get('{theme:slug}/', [ChapterController::class, 'index'])
	          ->name('themes.show');

	     Route::get('{theme:slug}/{chapter:slug}', [ChapterController::class, 'show'])
	          ->name('themes.chapters.show');


	     Route::get('chapters/{chapter}}/{order}', [ChapterController::class, 'slide'])
	          ->name('chapters.slide');


	     Route::get('{theme:slug}/{chapter:slug}/{order}', [ChapterController::class, 'slide'])
	          ->name('themes.chapters.posts.show');

	     Route::get('{theme:slug}/{chapter:slug}/{order}/{type}/{id}', [ChapterController::class, 'slide'])
	          ->where('type', 'block|illustration|question')
	          ->name('themes.chapters.posts.anchor');


	     // Admin routes
	     // ROUTE: ajotuer ->prefix('admin') à toutes les routes web admin
	     Route::middleware('admin')
	          ->as('admin.')
	          ->prefix('admin')
	          ->group(function () {
		          Route::resource('chapters', ChapterController::class)
		               ->only(['edit']);
	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.
	     Route::apiResource('themes.chapters', ChapterApiController::class)
	          ->shallow()
	          ->only(['index']);

	     // Get basic chapter info
	     Route::get('chapters/{chapter}/info', [ChapterApiController::class, 'info'])
	          ->name('chapters.info');

	     Route::get("chapters/{chapter:slug}/theorems", [ChapterApiController::class, 'getTheoremsFromChapter'])
	          ->name('chapters.theorems.index');

	     Route::get("chapters/{chapter:slug}/posts", [ChapterApiController::class, 'getPosts'])
	          ->name('chapters.posts.index');

	     // Admin api
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {

		          Route::apiResource('themes.chapters', ChapterApiController::class)
		               ->shallow()
		               ->only(['store', 'update', 'destroy']);

		          Route::get('chapters/fetch', [ChapterApiController::class, 'index'])
		               ->name('chapters.index');

		          Route::prefix('chapters')
		               ->as('chapters.')
		               ->group(function () {
			               Route::patch('/{chapter:slug}/toggleActiveState', [ChapterApiController::class, 'activate'])
			                    ->name('active');
			               Route::post('{chapter}/currentPost', [ChapterApiController::class, 'updateCurrentPost'])
			                    ->name('current');
			               Route::patch('{chapter}/ordering', [ChapterApiController::class, 'updatePostsOrder'])
			                    ->name('posts.order');
			               Route::post('{chapter}/relations/{related}', [ChapterApiController::class, 'toggleRelated'])
			                    ->name('relations.toggle');
		               });
	          });

     });
