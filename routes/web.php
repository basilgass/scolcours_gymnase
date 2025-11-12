<?php

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

Route::get('/', [ScolcoursController::class, 'index'])
     ->name('scolcours.index');

Route::get('/search/{type}/{terms}', [ScolcoursController::class, 'search'])
     ->name('scolcours.search');

// Profile de l'utilisateur
Route::get('/dashboard', [ScolcoursController::class, 'dashboard'])
     ->middleware(['auth', 'verified'])
     ->name('users.dashboard');


// Check if a word is in the dictionary
Route::get('/dico/check/{language}/{word}', [ScolcoursController::class, 'wordExistsInDictionary'])
     ->name('api.dico.exists');

// Get a word from the dictionary
// TODO: merge size,number and common to a comma separate string
// TODO: add a no-duplicate letter option
Route::get('/dico/{language}/{number?}/{size?}/{common?}/{withoutDuplicateLetters?}', [ScolcoursController::class, 'dico'])
     ->name('api.dico.fetch');

Route::get('/qr/', [ScolcoursController::class, 'qrcode'])
     ->name('qrcode.show');

Route::get('/fullscreen', [ScolcoursController::class, 'fullscreen'])
     ->name('widget.fullscreen');

require __DIR__ . '/auth.php'; // REFACTOR: Routes with API: auth.php
require __DIR__ . '/latexRoutes.php'; // REFACTOR: Routes with API: auth.php
require __DIR__ . '/gamesRoutes.php'; // REFACTOR: Routes with API: auth.php
