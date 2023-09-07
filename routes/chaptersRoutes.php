<?php

use App\Http\Controllers\ChaptersController;
use App\Models\Chapter;
use App\Models\Theme;

// Store the themes cache.
//Cache::forget('themes');
$themesList = Cache::rememberForever('themes', function () {
	try {
		return Theme::where("enabled", "=", 1)
			->orderBy('order')
			->get()->pluck('slug')->toArray();
	} catch (Exception $exception) {
		return ["arithmetique", "algebre", "geometrie", "analyse", "statistiques", "jeux", "numeric"];
	}
});

// Themes and chapters main routes
// Public routes !
Route::whereIn('theme', $themesList)->group(function () {
	// Public routes
	Route::get('{theme:slug}/', [ChaptersController::class, 'index'])
		->name('theme');

	Route::get('{theme:slug}/{chapter:slug}', [ChaptersController::class, 'intro'])
		->name('theme.chapter.intro');

	Route::get('{theme:slug}/{chapter:slug}/complete', [ChaptersController::class, 'page'])
		->name('theme.chapter');

	Route::get('chapter/{chapter:slug}', function(Chapter $chapter){
		return redirect()->route('theme.chapter.intro', [$chapter->theme->slug, $chapter->slug]);
	})->name('chapter.show');
	
	Route::get('{theme:slug}/{chapter:slug}/{order}', [ChaptersController::class, 'slide'])
		->name('theme.chapter.slide');

	//Admin routes
	Route::middleware("can:admin")->group(function () {
		Route::post('themes/{theme:slug}/chapters', [ChaptersController::class, 'store'])
			->name('themes.chapters.store');
		Route::patch('chapters/{chapter}', [ChaptersController::class, 'update'])
			->name('chapters.update');
		Route::delete('chapters/{chapter}', [ChaptersController::class, 'destroy'])
			->name('chapters.destroy');

		Route::post('chapters/{chapter}/currentPost', [ChaptersController::class, 'updateCurrentPost'])->name('chapters.currentPost');
		Route::patch('chapters/{chapter}/ordering', [ChaptersController::class, 'updatePostsOrder'])->name('chapters.updatePostsOrder');

		Route::get('chapters/min', [ChaptersController::class, 'indexMin'])
			->name('chapters.index.min');
		Route::post('chapters/{chapter}/relations/{related}', [ChaptersController::class, 'toggleRelated'])
			->name('chapters.relations.toggle');
	});

});
