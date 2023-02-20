<?php


use App\Http\Controllers\BlockController;
use App\Http\Controllers\IllustrationController;

Route::post('posts/{post}/blocks/create', [BlockController::class, 'storeInPost'])->name('posts.blocks.store');
Route::get('blocks/components', [BlockController::class, 'fetchComponents'])->name('illustrations.components');
Route::apiResource('blocks', BlockController::class);
Route::patch('blocks/{block}/blur', [BlockController::class, 'toggleblur'])->name('blocks.blur');
Route::patch('blocks/{block}/switch', [BlockController::class, 'toggleswitch'])->name('blocks.switch');


Route::get('blocks/{block}/edit', [BlockController::class, 'edit'])->name('blocks.edit');

Route::post('blocks/{block}/illustrations/store', [IllustrationController::class, 'store'])->name('blocks.illustrations.store');
Route::patch('illustrations/{illustration}/update', [IllustrationController::class, 'update'])->name('illustrations.update');
Route::delete('illustrations/{illustration}/destroy', [IllustrationController::class, 'destroy'])->name('illustrations.destroy');
Route::patch('blocks/{block}/illustrations/updateOrder', [BlockController::class, 'updateIllustrationsOrder'])->name('blocks.illustrations.order');

Route::post('image', [IllustrationController::class, "upload"])->name('images.upload');
