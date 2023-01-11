<?php

use App\Http\Controllers\QuestionController;

Route::apiResource('posts.questions', QuestionController::class)
	->shallow();
Route::post('questions/{question}/validate', [QuestionController::class, 'storeAnswer'])->name('questions.validate');
Route::post('questions/{question}/duplicate', [QuestionController::class, 'duplicate'])->name('questions.duplicate');
Route::patch('posts/{post}/questions/reset', [QuestionController::class, 'resetAnswers'])->name('posts.questions.reset');

Route::get('questions/{question}/edit', [QuestionController::class, 'edit'])->name('questions.edit');
