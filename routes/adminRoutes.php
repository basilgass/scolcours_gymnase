<?php


// Admin controller and routes
use App\Http\Controllers\AdminController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\WidgetController;

Route::middleware(["can:admin","auth", "verified"])->group(function () {

	Route::get('/admin/', [AdminController::class, 'show'])
		->name('admin');

	// WEBSITE CONFIGURATION
	Route::get('/admin/config', [AdminController::class, 'config'])->name('admin.config');
	Route::patch('/admin/config/update', [AdminController::class, 'configUpdate'])->name('admin.config.update');
	Route::patch('/admin/config/updateOrder', [AdminController::class, 'configUpdateOrder'])->name('admin.config.updateOrder');


	Route::get('/admin/pages', [AdminController::class, 'pages'])
		->name('admin.pages');

	Route::get('/admin/widgets', [AdminController::class, 'widgets'])
		->name('admin.widgets');
	Route::get('/admin/widgets/refresh', [WidgetController::class, 'refresh'])
		->name('admin.widgets.refresh');
	Route::patch('/widgets/{widget}/update', [WidgetController::class, 'update'])
		->name('widgets.update');
	Route::get("widgets/components", [WidgetController::class, "components"])
		->name('widgets.components');

	Route::get('/admin/users', [AdminController::class, 'users'])
		->name('admin.users');
	Route::post('/admin/users/create', [AdminController::class, 'createUsers'])
		->name('admin.users.create');
	Route::delete('/admin/users/{user}/destroy', [AdminController::class, 'destroyUser'])
		->name('admin.users.destroy');
	Route::patch('/admin/chapters/{chapter:slug}', [AdminController::class, 'activate'])
		->name('toggleChapterActive');
	Route::get('/admin/stats/{chapter:slug}', [AdminController::class, 'usersStats'])
		->name('admin.stats.chapter');

// Route for teams
	Route::patch('/admin/users/{user}/teams/{team}/toggle', [TeamController::class, "toggle"])
		->name('users.team.toggle');
	Route::post('/admin/teams/store', [TeamController::class, "store"])
		->name('teams.store');
	Route::delete('/admin/teams/{team}/destroy', [TeamController::class, "destroy"])
		->name('teams.destroy');

// Route for checking illustrations
	Route::get('/admin/illustrations', [AdminController::class, "illustrations"])
		->name('admin.illustrations.index');
});
