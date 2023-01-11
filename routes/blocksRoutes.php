<?php


use App\Http\Controllers\BlockController;

Route::post('posts/{post}/blocks/create', [BlockController::class, 'storeInPost'])->name('posts.blocks.store');
Route::get('blocks/components', [BlockController::class, 'fetchComponents'])->name('illustrations.components');
Route::apiResource('blocks', BlockController::class);
Route::patch('blocks/{block}/blur', [BlockController::class, 'toggleblur'])->name('blocks.blur');
Route::patch('blocks/{block}/switch', [BlockController::class, 'toggleswitch'])->name('blocks.switch');


Route::get('blocks/{block}/edit', [BlockController::class, 'edit'])->name('blocks.edit');
