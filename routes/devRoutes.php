<?php


// Developpement page
use App\Http\Controllers\ScolcoursController;

Route::get('dev/{dev}', [ScolcoursController::class, 'dev'])->middleware(['auth', 'verified'])->name('dev');
Route::get('dev', [ScolcoursController::class, 'devIndex'])->middleware(['auth', 'verified'])->name('dev.index');
