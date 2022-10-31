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
Route::get('/admin/', [AdminController::class, 'show'])
	->middleware(['auth', 'verified'])->name('admin');
Route::get('/admin/pages', [AdminController::class, 'pages'])
	->middleware(['auth', 'verified'])->name('admin.pages');
Route::get('/admin/users', [AdminController::class, 'users'])
	->middleware(['auth', 'verified'])->name('admin.users');
Route::post('/admin/users/create', [AdminController::class, 'createUsers'])->name('admin.users.create');
Route::delete('/admin/users/${user}/destroy', [AdminController::class, 'destroyUser'])->name('admin.users.destroy');

Route::patch('/admin/chapters/{chapter:slug}', [AdminController::class, 'activate'])
	->middleware(['auth', 'verified'])->name('toggleChapterActive');

Route::get('/admin/stats/{chapter:slug}', [AdminController::class, 'usersStats']);

require __DIR__ . '/auth.php';

// Chapter routes
Route::resource('themes.chapters', ChaptersController::class)
	->parameters([
		'themes' => 'theme:slug',
		'chapters' => 'chapter:slug'
	])
	->shallow();

// Formulas routes
Route::apiResource('chapters.formulas', FormulaController::class)
	->parameters([
		'chapters' => 'chapter:slug'
	])
	->shallow();
Route::post('formulas/{formula}/duplicate', [FormulaController::class, 'duplicate'])->name('formulas.duplicate');
Route::post('formulas/updateOrder', [FormulaController::class, 'updateOrder'])->name('formulas.updateOrder');

// Posts routes
Route::resource('chapters.posts', PostController::class)
	->parameters([
		"chapters" => "chapter:slug"
	])
	->shallow();
Route::patch('posts/{post}/numberOfVisibleBlocks', [PostController::class, 'updateNumberOfVisibleBlocks'])->name('posts.updateNumberOfVisibleBlocks');
Route::patch('posts/{post}/ordering', [PostController::class, 'updateBlocksOrder'])->name('posts.updateBlocksOrder');
Route::patch('posts/{post}/updateQuestionsGrid', [PostController::class, 'updateQuestionsGrid'])->name('posts.updateQuestionsGrid');
Route::patch('chapters/{chapter}/ordering', [ChaptersController::class, 'updatePostsOrder'])->name('chapters.updatePostsOrder');

// Questions routes
Route::apiResource('posts.questions', QuestionController::class)
	->shallow();
Route::post('questions/{question}/validate', [QuestionController::class, 'storeAnswer'])->name('questions.validate');
Route::post('questions/{question}/duplicate', [QuestionController::class, 'duplicate'])->name('questions.duplicate');
Route::patch('posts/{post}/questions/reset', [QuestionController::class, 'resetAnswers'])->name('posts.questions.reset');
Route::post('questions/updateOrder', [QuestionController::class, 'updateOrder'])->name('questions.updateOrder');

// Blocks routews
Route::apiResource('blocks', BlockController::class);
Route::post('posts/{post}/blocks/create', [BlockController::class, 'storeInPost'])->name('posts.blocks.store');
Route::patch('blocks/{block}/blur', [BlockController::class, 'toggleblur'])->name('blocks.blur');
Route::patch('blocks/{block}/switch', [BlockController::class, 'toggleswitch'])->name('blocks.switch');
Route::get('chapters/{chapter:slug}/components', [ChaptersController::class, 'fetchComponents'])->name('chapters.components');

// Challenges routes
Route::get('q/{challenge:slug}', [ChallengesController::class, 'quick'])->name("challenges.quick");
Route::get('{theme:slug}/{chapter:slug}/challenges/{challenge:slug}', [ChallengesController::class, 'show'])->name('chapters.challenge');
Route::apiResource('chapters.challenges', ChallengesController::class)
	->parameters([
		"chapters" => "chapter:slug"
	])
	->shallow();

// Games routes
Route::get('jeux/{game}', function (String $game){
	if(!file_exists(resource_path('js/Pages/Games/'.$game.'.vue'))){
		return Inertia::render('Error404', [
			'error'=>$game
		]);
	}
	return Inertia::render('Games/'.$game);
});

// Italiano routes.
Route::get('italiano', function (){
	return Inertia::render('languages/Italiano/italiano');
});
Route::get('italiano/{page}', function (String $page){
	return Inertia::render('languages/Italiano/'.$page);
});
// English routes.
Route::get('english', function (){
	return Inertia::render('languages/English/english');
});
Route::get('english/{page}', function (String $page){
	return Inertia::render('languages/English/'.$page);
});

// Latex download - migrate to custom controller
// TODO: Implement back the PDF output.
//Route::get('/latex/dry', [LatexController::class, 'dry']);
//Route::post('/latex', [LatexController::class, 'latex']);
//Route::get('/download/{fileID}', [LatexController::class, 'download']);

// Developpement page
Route::get('dev/{dev}', [ScolcoursController::class, 'dev'])->middleware(['auth', 'verified'])->name('dev');
Route::get('dev', [ScolcoursController::class, 'devIndex'])->middleware(['auth', 'verified']);


// Tools routes
Route::get('tools/', [ToolsController::class, 'index'])->name('tools');
Route::get('tools/{tool:slug}', [ToolsController::class, 'show'])->name('tools.tool');

// Themes and chapters main routes
Route::get('{theme:slug}/', [ChaptersController::class, 'index'])->name('theme');
Route::get('{theme:slug}/{chapter:slug}', [ChaptersController::class, 'show'])->name('theme.chapter');

