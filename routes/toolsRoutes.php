<?php

// Tools routes
use App\Http\Controllers\ToolController;

Route::get('tools/', [ToolController::class, 'index'])
	->name('tools');

Route::get('tools/list', [ToolController::class, 'fetch'])
	->name('tools.fetch');

Route::get('tools/{tool:slug}', [ToolController::class, 'show'])
	->name('tools.show');



Route::middleware("can:admin")->group(function (){
	Route::get('tools/{tool}/edit', [ToolController::class, 'edit'])
		->name('tools.edit');

	Route::post('tools/{tool}/update', [ToolController::class, 'update'])
		->name('tools.update');
});
