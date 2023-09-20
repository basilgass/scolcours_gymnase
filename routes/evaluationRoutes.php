<?php

use App\Http\Controllers\EvaluationController;

Route::get('evaluation/{evaluation:slug}', [EvaluationController::class, 'show'])
    ->name('evaluations.show');

Route::middleware("can:admin")->group(function () {

});
