<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DevController;
use App\Http\Controllers\ScolcoursController;
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

Route::middleware(['web', 'admin'])
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
		               ->name('updateOrder');
	          });

	     Route::prefix('chapters')
	          ->as('chapters.')
	          ->group(function () {
		          Route::get('/', [AdminController::class, 'chapters'])
		               ->name('index');
		          Route::patch('/{chapter:slug}', [AdminController::class, 'activate'])
		               ->name('toggleActive');
	          });


	     Route::prefix('challenges')
	          ->as('challenges.')
	          ->group(function () {
		          Route::get('/', [AdminController::class, 'challenges'])
		               ->name('index');
	          });

	     Route::prefix('generators')
	          ->as('generators.')
	          ->group(function () {
		          Route::get('/', [AdminController::class, 'generators'])
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
		               ->name('create');
		          Route::patch('/{user}/update', [AdminController::class, 'updateUser'])
		               ->name('update');
		          Route::delete('/{user}/destroy', [AdminController::class, 'destroyUser'])
		               ->name('destroy');
	          });


	     Route::prefix('illustrations')
	          ->as('illustrations.')
	          ->group(function () {
		          Route::get('/', [AdminController::class, "illustrations"])
		               ->name('index');
	          });


	     Route::prefix('dev')
	          ->as('dev.')
	          ->group(function () {
		          Route::get('/', [DevController::class, 'index'])
		               ->name('index');
		          Route::get('/{dev}', [DevController::class, 'show'])
		               ->name('show');
	          });


     });
