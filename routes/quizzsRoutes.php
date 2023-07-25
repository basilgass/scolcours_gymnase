<?php

use App\Http\Controllers\QuizzController;

Route::middleware(["auth", "verified"])->group(function () {
// Quizz homepage - this is where the user will see their available quizz.
	Route::get('q', function (){return redirect()->route('quizzs.index');});
	Route::get('quizz', [QuizzController::class, "index"])
		->name('quizzs.index');

// Quizz session for user
	Route::get('quizz/{quizzSession:shortcode}', [QuizzController::class, "show"])
		->name('quizzs.sessions.show');
});

Route::middleware("can:admin")->group(function () {
// Main  page, to list all quizz.
	Route::get('admin/quizz', [QuizzController::class, "admin"])
		->name('quizzs.admin');

// One quizz admin page, with the list of sessions
	Route::get('admin/quizz/{quizz}', [QuizzController::class, "adminQuizz"])
		->name('quizzs.admin.quizz');

// Quizz session for admin
	Route::get('quizz/{quizzSession:shortcode}/dashboard', [QuizzController::class, "dashboard"])
		->name('quizzs.sessions.dashboard');
// Quizz session for projection
	Route::get('quizz/{quizzSession:shortcode}/projection', [QuizzController::class, "projection"])
		->name('quizzs.sessions.projection');

// Quizz API
	Route::post('quizz', [QuizzController::class, 'store'])
		->name('quizzs.store');
	Route::delete('quizz/{quizz}', [QuizzController::class, 'destroy'])
		->name('quizzs.destroy');

	Route::post('quizz/{quizz}/sessions/create', [QuizzController::class, "sessionCreate"])
		->name("quizzs.sessions.create");
	Route::delete('quizz/sessions/{quizzSession}/destroy', [QuizzController::class, "sessionDestroy"])
		->name("quizzs.sessions.destroy");

	Route::post('quizz/{quizzSession:shortcode}/updateCurrent', [QuizzController::class, "updateCurrent"])
		->name('quizzs.sessions.updateCurrent');
	Route::post('quizz/{quizzSession:shortcode}/updateEnable', [QuizzController::class, "updateEnable"])
		->name('quizzs.sessions.updateEnable');

	Route::patch('quizzs/{quizz}/update', [QuizzController::class, "update"])
		->name("quizzs.update");
});
