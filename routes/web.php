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

// Home page
Route::get('/', [ScolcoursController::class, 'index'])
	->name('home');

Route::get('/search/{type}/{terms}', [ScolcoursController::class, 'search'])
	->name('scolcours.search');

// Profile de l'utilisateur
Route::get('/dashboard', [ScolcoursController::class, 'dashboard'])
	->middleware(['auth', 'verified'])
	->name('dashboard');

// REFACTOR : Routes refactoring - api prefix

require __DIR__ . '/adminRoutes.php'; // REFACTOR: Routes with API: adminRoutes.php
require __DIR__ . '/auth.php'; // REFACTOR: Routes with API: auth.php
require __DIR__ . '/translationsRoutes.php'; // REFACTOR: Routes with API: translationsRoutes.php
require __DIR__ . '/questionsRoutes.php'; // REFACTOR: Routes with API: questionsRoutes.php
require __DIR__ . '/blocksRoutes.php'; // REFACTOR: Routes with API: blocksRoutes.php
require __DIR__ . '/illustrationsRoutes.php'; // REFACTOR: Routes with API: illustrationsRoutes.php
require __DIR__ . '/formulasRoutes.php'; // REFACTOR: Routes with API: formulasRoutes.php
require __DIR__ . '/postsRoutes.php'; // REFACTOR: Routes with API: postsRoutes.php
require __DIR__ . '/scoresRoutes.php'; // REFACTOR: Routes with API: scoresRoutes.php
require __DIR__ . '/generatorsRoutes.php'; // REFACTOR: Routes with API: generatorsRoutes.php
require __DIR__ . '/challengesRoutes.php'; // REFACTOR: Routes with API: challengesRoutes.php
require __DIR__ . '/teamsRoutes.php'; // REFACTOR: Routes with API: teamsRoutes.php
require __DIR__ . '/decksRoutes.php'; // REFACTOR: Routes with API: decksRoutes.php
require __DIR__ . '/devRoutes.php'; // REFACTOR: Routes with API: devRoutes.php
require __DIR__ . '/toolsRoutes.php'; // REFACTOR: Routes with API: toolsRoutes.php
require __DIR__ . '/quizzsRoutes.php'; // REFACTOR: Routes with API: quizzsRoutes.php
require __DIR__ . '/evaluationRoutes.php'; // REFACTOR: Routes with API: evaluationRoutes.php
require __DIR__ . '/coursesRoutes.php'; // REFACTOR: Routes with API: coursesRoutes.php

require __DIR__ . '/gamesRoutes.php'; // REFACTOR: Routes with API: gamesRoutes.php
require __DIR__ . '/latexRoutes.php'; // REFACTOR: Routes with API: latexRoutes.php
require __DIR__ . '/variousRoutes.php'; // REFACTOR: Routes with API: variousRoutes.php

// Must be the last one!
require __DIR__ . '/chaptersRoutes.php'; // REFACTOR: Routes with API: chaptersRoutes.php
