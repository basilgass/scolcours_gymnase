<?php

use App\Http\Controllers\QuestionController;

// TODO: remove posts references to questionsRoutes
Route::apiResource('posts.questions', QuestionController::class)
	->shallow();

Route::post('questions/{type}/{id}/store', [QuestionController::class, 'store'])
	->name('questions.storeTo');
Route::post('questions/{question}/validate', [QuestionController::class, 'storeAnswer'])
	->name('questions.validate');
Route::post('questions/{question}/duplicate', [QuestionController::class, 'duplicate'])
	->name('questions.duplicate');
Route::patch('questions/{type}/{id}/reset', [QuestionController::class, 'resetAnswers'])
	->name('questions.answers.reset');

Route::get('questions/{question}/edit', [QuestionController::class, 'edit'])
	->name('questions.edit');

Route::post('questions/updateOrder', [QuestionController::class, 'updateQuestionsOrder'])
	->name('questions.updateOrder');
