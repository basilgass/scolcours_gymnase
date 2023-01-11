<?php

// Tools routes
use App\Http\Controllers\ToolsController;

Route::get('tools/', [ToolsController::class, 'index'])->name('tools');
Route::get('tools/{tool:slug}', [ToolsController::class, 'show'])->name('tools.tool');
