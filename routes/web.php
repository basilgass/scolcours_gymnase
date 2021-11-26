<?php
	
	use App\Http\Controllers\AdminController;
	use App\Http\Controllers\ChaptersController;
	use App\Http\Controllers\ExercisesController;
	use App\Http\Controllers\QuizzController;
	use App\Http\Controllers\ThemesController;
	use App\Models\Theme;
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

Route::get('/', function () {
	$themes = Theme::all();
	return Inertia::render('Welcome', [
		'canLogin' => Route::has('login'),
		'canRegister' => Route::has('register'),
		'themes' => $themes
	]);
})->name('home');

Route::get('/quizz', [QuizzController::class, 'index']);
Route::get('/quizz/{slug}', [QuizzController::class, 'show']);

Route::resource('chapter', ChaptersController::class);
Route::resource('exercise', ExercisesController::class);

Route::get('/dashboard', function () {
	return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin', [AdminController::class, 'show'])->middleware(['auth', 'verified']);

require __DIR__ . '/auth.php';

Route::get('{theme:slug}/', [ThemesController::class, 'show'])->name('theme');
Route::get('{theme:slug}/{chapter:slug}', [ThemesController::class, 'chapter'])->name('theme.chapter');
