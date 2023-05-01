<?php

use App\Http\Controllers\QuizzController;

// admin part
// Main  page, to list all quizz.
Route::get('quizz/admin', [QuizzController::class, "admin"])
	->name('quizzs.admin');
// One quizz admin page, with the list of sessions
Route::get('quizz/admin/{quizz}', [QuizzController::class, "adminQuizz"])
	->name('quizzs.admin.quizz');

// Quizz homepage - this is where the user will see their available quizz.
Route::get('quizz', [QuizzController::class, "index"])
	->name('quizzs.index');

// Quizz session for user
Route::get('quizz/{quizzSession:shortcode}', [QuizzController::class, "show"])
	->name('quizzs.sessions.show');

// Quizz session for admin
//TODO: must create an admin middleware to block all these
Route::get('quizz/{quizzSession:shortcode}/dashboard', [QuizzController::class, "dashboard"])
	->name('quizzs.sessions.dashboard');
// Quizz session for projection
Route::get('quizz/{quizzSession:shortcode}/projection', [QuizzController::class, "projection"])
	->name('quizzs.sessions.projection');

// Quizz API
Route::post('quizz/{quizz}/sessions/create', [QuizzController::class, "sessionCreate"])
	->name("quizzs.sessions.create");

Route::post('quizz/{quizzSession:shortcode}/updateCurrent', [QuizzController::class, "updateCurrent"])
	->name('quizzs.sessions.updateCurrent');
Route::post('quizz/{quizzSession:shortcode}/updateEnable', [QuizzController::class, "updateEnable"])
	->name('quizzs.sessions.updateEnable');
//Route::patch('quizzs/{quizz}/questions/updateOrder', [QuizzController::class, 'updateQuestionsOrder'])
//	->name('quizzs.questions.updateOrder');
