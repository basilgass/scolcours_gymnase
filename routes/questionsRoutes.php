<?php

use App\Http\Controllers\QuestionController;

// Store and validate an answer for a user.
Route::post('questions/{question}/validate', [QuestionController::class, 'storeAnswer'])
	->middleware('auth', 'verified')
	->name('questions.validate');

Route::get('questions/{question}', [QuestionController::class, "show"])
	->name('questions.show');

/*
* -----------------------------------------
* Admin routes
* -----------------------------------------
*/
Route::middleware("can:admin")
	->group(function () {
		// Get
		Route::get('questions/{question}/edit', [QuestionController::class, 'edit'])
			->name('questions.edit');

		// Post
		Route::post('questions/{question}/duplicate', [QuestionController::class, 'duplicate'])
			->name('questions.duplicate');


		// Patch
		Route::patch('questions/{question}', [QuestionController::class, 'update'])
			->name('questions.update');

		Route::post('questions/store/to/{type}/{id}', [QuestionController::class, 'store'])
			->name('questions.storeTo');

		Route::patch('questions/update/order/for/{type}/{id}', [QuestionController::class, 'updateQuestionsOrder'])
			->name('questions.updateOrder');

		Route::patch('questions/reset/answers/for/{type}/{id}', [QuestionController::class, 'resetAnswers'])
			->name('questions.answers.reset');

		Route::patch('questions/patch/update/displayIf', [QuestionController::class, 'updateQuestionsDisplayIf'])
			->name('questions.batch.updateDisplayIf');

		Route::patch('questions/{question}/update/displayIf', [QuestionController::class, 'updateQuestionDisplayIf'])
			->name('questions.updateDisplayIf');

		Route::patch('questions/{question}/moveTo/{post}', [QuestionController::class, 'moveToPost'])
			->name('questions.moveTo.post');


		// Destroy
		Route::delete('questions/{question}', [QuestionController::class, 'destroy'])
			->name('questions.destroy');
	});
