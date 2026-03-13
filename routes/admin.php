<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DevController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware('admin')
     ->prefix('admin')
     ->as('admin.')
     ->group(function () {
	     Route::get('/', [AdminController::class, 'show'])
	          ->name('index');

	     Route::prefix('config')
	          ->as('config.')
	          ->group(function () {
		          Route::get('/', [AdminController::class, 'config'])
		               ->name('index');
		          Route::patch('/update', [AdminController::class, 'configUpdate'])
		               ->name('update');
		          Route::patch('/updateOrder', [AdminController::class, 'configUpdateOrder'])
		               ->name('order');
	          });

	     Route::prefix('chapters')
	          ->as('chapters.')
	          ->group(function () {
		          Route::get('/', [AdminController::class, 'chapters'])
		               ->name('index');

	          });


	     Route::prefix('challenges')
	          ->as('challenges.')
	          ->group(function () {
		          Route::get('/', [AdminController::class, 'challenges'])
		               ->name('index');
	          });

	     Route::prefix('widgets')
	          ->as('widgets.')
	          ->group(function () {
		          Route::get('/', [AdminController::class, 'widgets'])
		               ->name('index');
	          });

	     // REFACTOR: séparer web / api
	     Route::prefix('users')
	          ->as('users.')
	          ->group(function () {
		          Route::get('/', [AdminController::class, 'users'])
		               ->name('index');
		          Route::post('/create', [AdminController::class, 'createUsers'])
		               ->name('store');
		          Route::patch('/{user}/update', [AdminController::class, 'updateUser'])
		               ->name('update');
		          Route::delete('/{user}/destroy', [AdminController::class, 'destroyUser'])
		               ->name('destroy');
	          });

	     Route::prefix('courses')
	          ->as('courses.')
	          ->group(function () {
		          Route::get('/', [AdminController::class, 'courses'])
		               ->name('index');
	          });

	     Route::get('agenda', [AdminController::class, 'agenda'])
	          ->name('agenda');

	     Route::prefix('illustrations')
	          ->as('illustrations.')
	          ->group(function () {
		          Route::get('/', [AdminController::class, "illustrations"])
		               ->name('index');
	          });


     });

Route::middleware('admin')
     ->prefix('dev')
     ->as('dev.')
     ->group(function () {
	     Route::get('/', [DevController::class, 'index'])
	          ->name('index');
	     Route::get('/{dev}', [DevController::class, 'show'])
	          ->name('show');
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api')
     ->group(function () {
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin')
	          ->group(function () {


	          });
     });
