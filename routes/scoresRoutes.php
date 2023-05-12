<?php


use App\Http\Controllers\ScoreController;

Route::middleware(["auth", "verified"])->group(function () {
	Route::post('scores/post/{post}/update', [ScoreController::class, 'updatePostScore'])
		->name('scores.post');
	Route::post('scores/challenge/{challenge}/update', [ScoreController::class, 'updateChallengeScore'])
		->name('scores.challenge');
});
