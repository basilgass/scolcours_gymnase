<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ChallengesController;
use App\Http\Controllers\ChaptersController;
use App\Http\Controllers\FormulaController;
use App\Http\Controllers\FormulasController;
use App\Http\Controllers\LatexController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ToolsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
Route::get('/', [ChaptersController::class, 'home'])->name('home');

// Challenges
Route::get('/challenge', [ChallengesController::class, 'index']);
Route::get('/challenge/{challenge:slug}', [ChallengesController::class, 'show']);
Route::post('/challenge/{challenge:slug}/start', [ChallengesController::class, 'start']);

// Auth route
Route::get('/dashboard', function () {
	return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin controller and routes
Route::get('/admin', [AdminController::class, 'show'])
	->middleware(['auth', 'verified'])->name('admin');
Route::patch('/admin/chapters/{chapter:slug}', [AdminController::class, 'activate'])
	->middleware(['auth', 'verified'])->name('toggleChapterActive');

require __DIR__ . '/auth.php';

// Latex download - migrate to custom controller
Route::get('/latex/dry', [LatexController::class, 'dry']);
Route::post('/latex', [LatexController::class, 'latex']);
Route::get('/download/{fileID}', [LatexController::class, 'download']);

// Developpement page
Route::get('dev/', function () {
	return Inertia::render("Dev");
});

// Post routes (for debug / dev)
Route::post('post/', [PostController::class, 'store']);
Route::get('post/create/{chapter:slug}', [PostController::class, 'create'])->name('post.create');
//Route::get('post/create', [PostController::class, 'create']);
Route::get('post/fetch/{chapter:slug}', [PostController::class, 'fetch']);
Route::get('post/{post}', [PostController::class, 'show']);

// Tools controller
Route::get('tools/', [ToolsController::class, 'index'])->name('tools');
Route::get('tools/{tool:slug}', [ToolsController::class, 'show'])->name('tools.tool');

// Formulas controller
Route::post('formula/', [FormulaController::class, 'store']);
Route::delete('formula/delete/{id}', [FormulaController::class, 'destroy']);
Route::get('formula/fetch/{chapter:slug}', [FormulaController::class, 'fetch'])->name('formula.fetch');

// Chapter controller
Route::get('chapter/{chapter}', [ChaptersController::class, 'generic'])->name('chapter');
Route::get('{theme:slug}/', [ChaptersController::class, 'index'])->name('theme');
Route::get('{theme:slug}/{chapter:slug}', [ChaptersController::class, 'show'])->name('theme.chapter');

