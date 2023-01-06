<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BlockController;
use App\Http\Controllers\ChallengesController;
use App\Http\Controllers\ChaptersController;
use App\Http\Controllers\FormulaController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ScolcoursController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\ToolsController;
use App\Http\Controllers\TranslationController;
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
//
//// Posts routes
//Route::get('dev/questions/{question}', function (Question $question) {
//	dd(QuestionResource::make($question));
//});
//Route::get('dev/posts/{post}', function (Post $post) {
//	dd(PostResource::make($pose));
//});
//Route::get('dev/blocks/{block}', function (Block $block) {
//	dd(BlockResource::make($block));
//});
//Route::get('dev/scores', function () {
//	$ch = Challenge::find(1);
//	dd($ch->scores->where('user_id', Auth::user()->id)->first()->score);
////	dd($ch->scores->pluck('score')->max());
//	dd(Score::where([
//		'user_id' => 1,
//		'challenge_id' => 2,
//	])->first()?->score);
//
//	dd(Challenge::find(1)->scores->max()->score);
//});

Route::get('dev/chapteruser', function () {
	$user = Auth::user();

	$chapters = DB::table('chapters')
		->join('posts', 'chapters.id', "=", "posts.chapter_id")
		->join('questions', 'posts.id', "=", "questions.post_id")
		->join('question_user', 'question_user.question_id', "=", "question_user.user_id")
		->select("chapters.id")
		->where("question_user.id","=", $user->id);

	dd(
		$chapters->toSql()
	);

	dd($chapters);

	$chapters = $user->questions->map(function ($question) {
		return $question->post->chapter_id;
	})->unique()->values()->all();

	dd($chapters);
});

//Route::apiResource('scores', ScoreController::class);


// Home page - no controller
Route::get('/', [ScolcoursController::class, 'index'])->name('home');

// Admin sections, Auth route
Route::get('/dashboard', [ScolcoursController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

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
	->shallow()
	->except('show');

// Formulas routes
Route::apiResource('chapters.formulas', FormulaController::class)
	->parameters([
		'chapters' => 'chapter:slug'
	])
	->shallow();
Route::post('formulas/{formula}/duplicate', [FormulaController::class, 'duplicate'])->name('formulas.duplicate');
Route::post('formulas/updateOrder', [FormulaController::class, 'updateOrder'])->name('formulas.updateOrder');

Route::get('questions/{question}/edit', [QuestionController::class, 'edit'])->name('questions.edit');
Route::get('blocks/{block}/edit', [BlockController::class, 'edit'])->name('blocks.edit');
Route::get('posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
Route::get('challenges/{challenge}/edit', [ChallengesController::class, 'edit'])->name('challenges.edit');

Route::resource('posts', PostController::class)
	->only('show');
Route::resource('chapters.posts', PostController::class)
	->parameters([
		"chapters" => "chapter:slug"
	])
	->shallow()->except('show');

Route::post('chapters/{chapter}/currentPost', [ChaptersController::class, 'updateCurrentPost'])->name('chapters.currentPost');
Route::patch('posts/{post}/numberOfVisibleBlocks', [PostController::class, 'updateNumberOfVisibleBlocks'])->name('posts.updateNumberOfVisibleBlocks');
Route::patch('posts/{post}/ordering', [PostController::class, 'updateBlocksOrder'])->name('posts.updateBlocksOrder');
Route::patch('posts/{post}/updateQuestionsGrid', [PostController::class, 'updateQuestionsGrid'])->name('posts.updateQuestionsGrid');
Route::patch('chapters/{chapter}/ordering', [ChaptersController::class, 'updatePostsOrder'])->name('chapters.updatePostsOrder');

// scoring system
Route::post('scores/post/{post}/update', [ScoreController::class, 'updatePostScore'])->name('scores.post');
Route::post('scores/challenge/{challenge}/update', [ScoreController::class, 'updateChallengeScore'])->name('scores.challenge');

// Questions routes
Route::apiResource('posts.questions', QuestionController::class)
	->shallow();
Route::post('questions/{question}/validate', [QuestionController::class, 'storeAnswer'])->name('questions.validate');
Route::post('questions/{question}/duplicate', [QuestionController::class, 'duplicate'])->name('questions.duplicate');
Route::patch('posts/{post}/questions/reset', [QuestionController::class, 'resetAnswers'])->name('posts.questions.reset');
Route::patch('posts/{post}/questions/updateOrder', [PostController::class, 'updateQuestionsOrder'])->name('questions.updateOrder');

// Blocks routews
Route::post('posts/{post}/blocks/create', [BlockController::class, 'storeInPost'])->name('posts.blocks.store');
Route::get('blocks/components', [BlockController::class, 'fetchComponents'])->name('illustrations.components');
Route::apiResource('blocks', BlockController::class);
Route::patch('blocks/{block}/blur', [BlockController::class, 'toggleblur'])->name('blocks.blur');
Route::patch('blocks/{block}/switch', [BlockController::class, 'toggleswitch'])->name('blocks.switch');

// Challenges routes
Route::get('q/{challenge:slug}', [ChallengesController::class, 'quick'])->name("challenges.quick");
Route::get('{theme:slug}/{chapter:slug}/challenges/{challenge:slug}', [ChallengesController::class, 'show'])->name('chapters.challenge');
Route::apiResource('chapters.challenges', ChallengesController::class)
	->parameters([
		"chapters" => "chapter:slug"
	])
	->shallow();

// Games routes
Route::get('jeux/{game}', function (string $game) {
	if (!file_exists(resource_path('js/Pages/Games/' . $game . '.vue'))) {
		return Inertia::render('Error404', [
			'error' => $game
		]);
	}
	return Inertia::render('Games/' . $game);
});

// Languages routes.
Route::get("{language}", [TranslationController::class, "index"])
	->where('language', 'italiano|english')
	->name('translation.index');
Route::get("{language}/{game}", [TranslationController::class, "show"])
	->where('language', 'italiano|english')
	->where('game', 'memory|guess|list')
	->name('translation.show');
Route::get('translation', [TranslationController::class, 'import'])->name('translation.import');
Route::get('translation/{unit}/words', [TranslationController::class, 'fetchWords'])->name('translation.words');
Route::post('translation/word', [TranslationController::class, 'create'])->name('translation.create');

//Route::get('italiano', function (){
//	return Inertia::render('languages/Italiano/italiano');
//});
//Route::get('italiano/{page}', function (String $page){
//	return Inertia::render('languages/Italiano/'.$page);
//});
//// English routes.
//Route::get('english', function (){
//	return Inertia::render('languages/English/english');
//});
//Route::get('english/{page}', function (String $page){
//	return Inertia::render('languages/English/'.$page);
//});

// Latex download - migrate to custom controller
// TODO: Implement back the PDF output.
//Route::get('/latex/dry', [LatexController::class, 'dry']);
//Route::post('/latex', [LatexController::class, 'latex']);
//Route::get('/download/{fileID}', [LatexController::class, 'download']);

// Developpement page
Route::get('dev/{dev}', [ScolcoursController::class, 'dev'])->middleware(['auth', 'verified'])->name('dev');
Route::get('dev', [ScolcoursController::class, 'devIndex'])->middleware(['auth', 'verified'])->name('dev.index');


// Tools routes
Route::get('tools/', [ToolsController::class, 'index'])->name('tools');
Route::get('tools/{tool:slug}', [ToolsController::class, 'show'])->name('tools.tool');

// Themes and chapters main routes
Route::get('{theme:slug}/', [ChaptersController::class, 'index'])->name('theme');
Route::get('{theme:slug}/{chapter:slug}', [ChaptersController::class, 'page'])->name('theme.chapter');
Route::get('{theme:slug}/{chapter:slug}/accueil', [ChaptersController::class, 'intro'])->name('theme.chapter.intro');
Route::get('{theme:slug}/{chapter:slug}/{order}', [ChaptersController::class, 'slide'])->name('theme.chapter.slide');

