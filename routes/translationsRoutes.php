<?php

use App\Http\Controllers\TranslationController;
use App\Models\TranslationLanguage;

// Langues autorisées
//$languages = 'italiano|english|deutsch|espanol';

$languages = Cache::rememberForever('languages', function () {
    try {
        return TranslationLanguage::all()
            ->pluck('slug')->toArray();
    } catch (Exception $exception) {
        return ["italiano", "english", "espanol", "deutsch"];
    }
});

Route::whereIn('language', $languages)->group(function () {
    // For each languages, show the different games
    Route::get("{language:slug}", [TranslationController::class, "index"])
        ->name('translations.index');

// Show a game
    Route::get("{language:slug}/{game}", [TranslationController::class, "show"])
        ->where('game', 'memory|guess|list|type')
        ->name('translations.show');
});


// Get the list of units for a book
Route::get('translation/{book}/units', [TranslationController::class, 'fetchUnits'])
    ->name('translations.units');
// Get the list of words for a unit
Route::get('translation/{unit}/words', [TranslationController::class, 'fetchWords'])
    ->name('translations.words');


Route::middleware("can:admin")->group(function () {
    // GET
    Route::get('translation', [TranslationController::class, 'import'])
        ->name('translations.import');

    // POST
    Route::post('translation/word', [TranslationController::class, 'create'])
        ->name('translations.create');

    // PATCH
    Route::patch('translation/words/{translation}/edit', [TranslationController::class, 'updateTranslation'])
        ->name('translations.words.update');

    // DELETE

});
