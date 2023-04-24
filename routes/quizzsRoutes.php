<?php

use App\Http\Controllers\QuizzController;

Route::get('quizz', [QuizzController::class, "index"]);
Route::get('quizz/{quizzSession:shortcode}', [QuizzController::class, "show"])->name('quizzs.show');

//TODO: must create an admin middleware to block all these
Route::get('quizz/admin/{quizz}', [QuizzController::class, "dashboard"])->name('quizzs.admin');
Route::get('quizz/{quizzSession:shortcode}/dashboard', [QuizzController::class, "dashboard"])->name('quizzs.dashboard');
Route::get('quizz/{quizzSession:shortcode}/projection', [QuizzController::class, "projection"])->name('quizzs.projection');

Route::post('quizz/{quizzSession:shortcode}/updateCurrent', [QuizzController::class, "updateCurrent"])->name('quizzs.updateCurrent');
Route::post('quizz/{quizzSession:shortcode}/updateEnable', [QuizzController::class, "updateEnable"])->name('quizzs.updateEnable');
