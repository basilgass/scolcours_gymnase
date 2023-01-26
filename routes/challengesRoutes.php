<?php

use App\Http\Controllers\ChallengesController;

Route::get('q/{challenge:slug}', [ChallengesController::class, 'quick'])->name("challenges.quick");
Route::get('{theme:slug}/{chapter:slug}/challenges/{challenge:slug}', [ChallengesController::class, 'show'])->name('chapters.challenge');
Route::apiResource('chapters.challenges', ChallengesController::class)
	->parameters([
		"chapters" => "chapter:slug"
	])
	->shallow();

Route::get('challenges/{challenge}/edit', [ChallengesController::class, 'edit'])->name('challenges.edit');

Route::get('{theme:slug}/{chapter:slug}/challenges/{challenge:slug}/team/{team:name}', [ChallengesController::class, 'teams'])
	->withoutScopedBindings()
	->name('challenges.team');
