<?php


use App\Http\Controllers\BlockController;
use App\Http\Controllers\IllustrationController;
use App\Http\Controllers\PostController;

Route::get('blocks/components', [BlockController::class, 'fetchComponents'])
    ->name('illustrations.components');

Route::get('blocks/{block}', [BlockController::class, 'show'])
    ->name('blocks.show');
//Route::apiResource('blocks', BlockController::class);

Route::middleware('can:admin')->group(function(){
	// Create block in post
	Route::post('posts/{post}/blocks/create', [BlockController::class, 'storeInPost'])
		->name('posts.blocks.store');
	Route::patch('blocks/{block}', [BlockController::class, 'update'])
		->name("blocks.update");
	Route::patch('blocks/{block}/template', [BlockController::class, 'updateTemplate'])
		->name("blocks.updateTemplate");
	Route::delete('blocks/{block}', [BlockController::class, 'destroy'])
		->name("blocks.destroy");

	// Edit / update blocks special attributes
	Route::patch('blocks/{block}/blur', [BlockController::class, 'toggleblur'])
		->name('blocks.blur');
	Route::patch('blocks/{block}/switch', [BlockController::class, 'toggleswitch'])
		->name('blocks.switch');
	Route::get('blocks/{block}/edit', [BlockController::class, 'edit'])
		->name('blocks.edit');

	// Edit / update illustrations.
	Route::post('blocks/{block}/illustrations/store', [IllustrationController::class, 'store'])
		->name('blocks.illustrations.store');
	Route::patch('illustrations/{illustration}/update', [IllustrationController::class, 'update'])
		->name('illustrations.update');
	Route::delete('illustrations/{illustration}/destroy', [IllustrationController::class, 'destroy'])
		->name('illustrations.destroy');
	Route::patch('blocks/{block}/illustrations/updateOrder', [BlockController::class, 'updateIllustrationsOrder'])
		->name('blocks.illustrations.order');
	Route::post('image', [IllustrationController::class, "upload"])
		->name('images.upload');
	Route::patch('blocks/{block}/updateIllustrationsGrid', [BlockController::class, 'updateIllustrationsGrid'])
		->name('blocks.updateIllustrationsGrid');

	Route::patch('blocks/{block}/moveTo/post/{post}', [BlockController::class, 'moveBlockToPost'])->name('blocks.moveTo.post');
	Route::patch('post/{post}/moveTo/chapter/{chapter}', [PostController::class, 'movePostToChapter'])->name('posts.moveTo.chapter');
});
