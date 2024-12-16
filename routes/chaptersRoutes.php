<?php

use App\Http\Controllers\ChapterController;
use App\Models\Chapter;
use App\Models\Theme;

// Store the themes cache.
//Cache::forget('themes');
try{
    $themesList = Theme::getThemesFromCache()->pluck('slug')->toArray();
}catch(Exception $exception){
    return Theme::all()->pluck('slug')->toArray();
}

// Themes and chapters main routes
// Public routes !
Route::whereIn('theme', $themesList)->group(function () {
	// Public routes
	Route::get('{theme:slug}/', [ChapterController::class, 'index'])
		->name('theme');

	Route::get('{theme:slug}/{chapter:slug}', [ChapterController::class, 'intro'])
		->name('themes.chapters.intro');

    Route::get("chapters/{chapter:slug}/theorems", [ChapterController::class, 'getTheoremsFromChapter'])
        ->name('chapters.theorems.index');

    Route::get('chapters/{chapter}}/{order}', [ChapterController::class, 'slide'])
		->name('chapters.slide');

	Route::get('chapter/{chapter:slug}', function (Chapter $chapter) {
		return redirect()->route('themes.chapters.intro', [$chapter->theme->slug, $chapter->slug]);
	})->name('chapters.show');

	Route::get('{theme:slug}/{chapter:slug}/{order}', [ChapterController::class, 'slide'])
		->name('themes.chapters.slide');

	Route::get('{theme:slug}/{chapter:slug}/{order}/{type}/{id}', [ChapterController::class, 'slide'])
		->where('type', 'block|illustration|question')
		->name('themes.chapters.slide.anchor');

	//Admin routes
	Route::middleware("can:admin")->group(function () {

		Route::get('chapters/{chapter}/edit', [ChapterController::class, 'edit'])
			->name('chapters.edit');

		Route::post('themes/{theme:slug}/chapters', [ChapterController::class, 'store'])
			->name('themes.chapters.store');

		Route::patch('chapters/{chapter}', [ChapterController::class, 'update'])
			->name('chapters.update');
		Route::delete('chapters/{chapter}', [ChapterController::class, 'destroy'])
			->name('chapters.destroy');

		Route::post('chapters/{chapter}/currentPost', [ChapterController::class, 'updateCurrentPost'])->name('chapters.currentPost');
		Route::patch('chapters/{chapter}/ordering', [ChapterController::class, 'updatePostsOrder'])->name('chapters.updatePostsOrder');

		Route::get('chapters/min', [ChapterController::class, 'indexMin'])
			->name('chapters.index.min');
		Route::post('chapters/{chapter}/relations/{related}', [ChapterController::class, 'toggleRelated'])
			->name('chapters.relations.toggle');

	});

	// Get basic chapter info
	Route::get('chapters/{chapter}/info', [ChapterController::class, 'info'])
		->name('chapters.info');
});
