<?php

use App\Http\Controllers\QuestionController;

Route::get('questions/admin/{question}', function(\App\Models\Question $question){
	return \App\Http\Resources\QuestionResource::make($question);
});
// TODO: remove posts references to questionsRoutes
Route::apiResource('posts.questions', QuestionController::class)
	->shallow();


// Must be a verified user
Route::post('questions/{question}/validate', [QuestionController::class, 'storeAnswer'])
	->middleware('auth', 'verified')
	->name('questions.validate');

Route::middleware("can:admin")->group(function () {
	Route::post('questions/{type}/{id}/store', [QuestionController::class, 'store'])
		->name('questions.storeTo');

	Route::patch('questions/{question}', [QuestionController::class, 'update'])
		->name('questions.update');
	Route::delete('questions/{question}', [QuestionController::class, 'destroy'])
		->name('questions.destroy');

	Route::post('questions/{question}/duplicate', [QuestionController::class, 'duplicate'])
		->name('questions.duplicate');

	// Apply to all questions related to a specific "questionable"
	Route::post('questions/{type}/{id}/updateOrder', [QuestionController::class, 'updateQuestionsOrder'])
		->name('questions.updateOrder');

	Route::patch('questions/{type}/{id}/reset', [QuestionController::class, 'resetAnswers'])
		->name('questions.answers.reset');

	Route::get('questions/{question}/edit', [QuestionController::class, 'edit'])
		->name('questions.edit');


});
