<?php

// Tools routes
use App\Http\Controllers\ToolController;

Route::get('tools/', [ToolController::class, 'index'])->name('tools');
Route::get('tools/{tool:slug}', [ToolController::class, 'show'])->name('tools.tool');
