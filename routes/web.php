<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BlockController;
use App\Http\Controllers\ChallengesController;
use App\Http\Controllers\ChaptersController;
use App\Http\Controllers\FormulaController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ScolcoursController;
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
Route::get('/', [ScolcoursController::class, 'index'])->name('home');

// Admin sections, Auth route
Route::get('/dashboard', function () {
	return Inertia::render('DashboardPage.vue');
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin controller and routes
Route::get('/admin', [AdminController::class, 'show'])
	->middleware(['auth', 'verified'])->name('admin');
Route::patch('/admin/chapters/{chapter:slug}', [AdminController::class, 'activate'])
	->middleware(['auth', 'verified'])->name('toggleChapterActive');

require __DIR__ . '/auth.php';


// Chapter controller
Route::resource('themes.chapters', ChaptersController::class)
	->parameters([
		'themes' => 'theme:slug',
		'chapters' => 'chapter:slug'
	])
	->shallow();

// Formulas controller
Route::apiResource('chapters.formulas', FormulaController::class)
	->parameters([
		'chapters' => 'chapter:slug'
	])
	->shallow();

Route::resource('chapters.posts', PostController::class)
	->parameters([
		"chapters" => "chapter:slug"
	])
	->shallow();
Route::patch('posts/{post}/numberOfVisibleBlocks', [PostController::class, 'updateNumberOfVisibleBlocks'])->name('posts.updateNumberOfVisibleBlocks');

//Route::apiResource('chapters.exercises', ExerciseController::class)
//	->parameters([
//		"chapters" => "chapter:slug"
//	])
//	->shallow();
//Route::post('exercises/{exercise}/replicate', [ExerciseController::class, "replicate"])->name('exercises.replicate');

Route::apiResource('posts.questions', QuestionController::class)
	->shallow();
Route::post('questions/{question}/validate', [QuestionController::class, 'storeAnswer'])->name('questions.validate');

Route::apiResource('blocks', BlockController::class);
Route::post('posts/{post}/blocks/create', [BlockController::class, 'storeInPost'])->name('posts.blocks.store');
Route::patch('blocks/{block}/blur', [BlockController::class, 'toggleblur'])->name('blocks.blur');
Route::patch('blocks/{block}/switch', [BlockController::class, 'toggleswitch'])->name('blocks.switch');
Route::get('chapters/{chapter:slug}/components', [ChaptersController::class, 'fetchComponents'])->name('chapters.components');

// Challenges
Route::get('q/{challenge:slug}', [ChallengesController::class, 'quick'])->name("challenges.quick");
Route::get('{theme:slug}/{chapter:slug}/challenges/{challenge:slug}', [ChallengesController::class, 'show'])->name('chapters.challenge');
Route::apiResource('challenges', ChallengesController::class);

//Route::get('/challenge', [ChallengesController::class, 'index']);
//Route::get('/challenge/{challenge:slug}', [ChallengesController::class, 'show']);
//Route::post('/challenge/{challenge:slug}/start', [ChallengesController::class, 'start']);


// Latex download - migrate to custom controller
//Route::get('/latex/dry', [LatexController::class, 'dry']);
//Route::post('/latex', [LatexController::class, 'latex']);
//Route::get('/download/{fileID}', [LatexController::class, 'download']);

// Developpement page
Route::get('dev/', [ScolcoursController::class, 'dev']);

// Post routes (for debug / dev)
//Route::post('post/', [PostController::class, 'store']);
//Route::get('post/create/{chapter:slug}', [PostController::class, 'create'])->name('post.create');
////Route::get('post/create', [PostController::class, 'create']);
//Route::get('post/fetch/{chapter:slug}', [PostController::class, 'fetch']);
//Route::get('post/{post}', [PostController::class, 'show']);

// Tools controller
Route::get('tools/', [ToolsController::class, 'index'])->name('tools');
Route::get('tools/{tool:slug}', [ToolsController::class, 'show'])->name('tools.tool');


//Route::get('{theme:slug}/create', [ChaptersController::class, 'create'])->name('chapter.create');
//Route::get('chapter/{chapter}', [ChaptersController::class, 'generic'])->name('chapter');
Route::get('{theme:slug}/', [ChaptersController::class, 'index'])->name('theme');
Route::get('{theme:slug}/{chapter:slug}', [ChaptersController::class, 'show'])->name('theme.chapter');

