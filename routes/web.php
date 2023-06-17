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

// Home page - no controller
Route::get('/', [ScolcoursController::class, 'index'])->name('home');

// Admin sections, Auth route
Route::get('/dashboard', [ScolcoursController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__ . '/adminRoutes.php';
require __DIR__ . '/auth.php';

require __DIR__ . '/translationsRoutes.php';
require __DIR__ . '/questionsRoutes.php';
require __DIR__ . '/blocksRoutes.php';
require __DIR__ . '/formulasRoutes.php';
require __DIR__ . '/postsRoutes.php';
require __DIR__ . '/scoresRoutes.php';
require __DIR__ . '/challengesRoutes.php';
require __DIR__ . '/teamsRoutes.php';
require __DIR__ . '/devRoutes.php';
require __DIR__ . '/toolsRoutes.php';
require __DIR__ . '/quizzsRoutes.php';

require __DIR__ . '/gamesRoutes.php';
require __DIR__ . '/latexRoutes.php';
require __DIR__ . '/variousRoutes.php';

// Must be the last one !
require __DIR__ . '/chaptersRoutes.php';
