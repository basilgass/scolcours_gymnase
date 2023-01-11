<?php


// Admin controller and routes
use App\Http\Controllers\AdminController;

Route::get('/admin/', [AdminController::class, 'show'])
	->middleware(['auth', 'verified'])->name('admin');
Route::get('/admin/pages', [AdminController::class, 'pages'])
	->middleware(['auth', 'verified'])->name('admin.pages');
Route::get('/admin/users', [AdminController::class, 'users'])
	->middleware(['auth', 'verified'])->name('admin.users');
Route::post('/admin/users/create', [AdminController::class, 'createUsers'])->name('admin.users.create');
Route::delete('/admin/users/${user}/destroy', [AdminController::class, 'destroyUser'])->name('admin.users.destroy');
Route::patch('/admin/chapters/{chapter:slug}', [AdminController::class, 'activate'])
	->middleware(['auth', 'verified'])->name('toggleChapterActive');
Route::get('/admin/stats/{chapter:slug}', [AdminController::class, 'usersStats']);
