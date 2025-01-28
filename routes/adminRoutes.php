<?php


// Admin controller and routes
use App\Http\Controllers\AdminController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\WidgetController;

Route::prefix('admin')
	->middleware(["can:admin", "auth", "verified"])
	->group(function () {
		Route::get('/', [AdminController::class, 'show'])
			->name('admin');

		// DEV
		Route::get('/dev', [AdminController::class, 'dev'])
			->name('admin.dev');

		// WEBSITE CONFIGURATION
		Route::get('/config', [AdminController::class, 'config'])
			->name('admin.config');
		Route::patch('/config/update', [AdminController::class, 'configUpdate'])
			->name('admin.config.update');
		Route::patch('/config/updateOrder', [AdminController::class, 'configUpdateOrder'])
			->name('admin.config.updateOrder');
		Route::get('/chapters', [AdminController::class, 'chapters'])
			->name('admin.chapters');
		Route::get('/tools', [AdminController::class, 'tools'])
			->name('admin.tools');
		Route::get('/challenges', [AdminController::class, 'challenges'])
			->name('admin.challenges');
		Route::get('/generators', [AdminController::class, 'generators'])
			->name('admin.generators');
		Route::get('/widgets', [AdminController::class, 'widgets'])
			->name('admin.widgets');
		Route::get('/widgets/refresh', [WidgetController::class, 'refresh'])
			->name('admin.widgets.refresh');
		Route::patch('/widgets/{widget}/update', [WidgetController::class, 'update'])
			->name('widgets.update');
		Route::get("widgets/components", [WidgetController::class, "components"])
			->name('widgets.components');
		Route::get('/users', [AdminController::class, 'users'])
			->name('admin.users');
		Route::post('/users/create', [AdminController::class, 'createUsers'])
			->name('admin.users.create');
		Route::patch('/users/{user}/update', [AdminController::class, 'updateUser'])
			->name('admin.users.update');
		Route::delete('/users/{user}/destroy', [AdminController::class, 'destroyUser'])
			->name('admin.users.destroy');
		Route::patch('/chapters/{chapter:slug}', [AdminController::class, 'activate'])
			->name('toggleChapterActive');

// Route for teams
		Route::patch('/users/{user}/teams/{team}/toggle', [TeamController::class, "toggle"])
			->name('users.team.toggle');
		Route::post('/teams/store', [TeamController::class, "store"])
			->name('teams.store');
		Route::delete('/teams/{team}/destroy', [TeamController::class, "destroy"])
			->name('teams.destroy');

// Route for checking illustrations
		Route::get('/illustrations', [AdminController::class, "illustrations"])
			->name('admin.illustrations.index');

		// Route for generic data saves.
		Route::patch('/api/update/a/value', [AdminController::class, "updateAValue"])
			->name('api.update.a.value');
	});
