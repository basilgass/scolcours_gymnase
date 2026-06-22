<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Http\Resources\TeamResource;
use App\Models\Block;
use App\Models\Chapter;
use App\Models\Post;
use App\Services\PseudoGenerator;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

//use App\Models\Exercise;

class ScolcoursController extends Controller
{
	public function index()
	{
		return Inertia::render('HomePage', [
		]);
	}

	public function dashboard()
	{
		//		$chapters = Auth::user()->chapters;
		//		$chapters->load("posts");

		//		$courses = ChapterResource::collection($chapters)
		//			->map(function ($chapter) {
		//				return $chapter->additional([
		//												'currentPost' => $chapter->posts->where('id', $chapter->pivot->post_id)->first()->order,
		//												'maxPost'     => count($chapter->posts)
		//											]);
		//			});

		// $courses = ChapterResource + CurrentPost + MaxPost

		$user = Auth::user();
		$teams = $user->teams;

		return Inertia::render('DashboardPage', [
			//			'userCourses' => CourseResource::collection($user->courses),
			//			'teamCourses' => CourseResource::collection($teams->flatMap->courses),
			'teams'   => TeamResource::collection($teams),
			'courses' => CourseResource::collection($user->courses),
		]);
	}

	public function regeneratePseudo(): \Illuminate\Http\JsonResponse
	{
		$user = Auth::user();
		$user->update(['pseudo' => PseudoGenerator::generateUnique()]);

		return response()->json(['pseudo' => $user->pseudo]);
	}

	public function updateShowRealName(Request $request): \Illuminate\Http\JsonResponse
	{
		$validated = $request->validate(['show_real_name' => ['required', 'boolean']]);
		Auth::user()->update($validated);

		return response()->json($validated);
	}

	public function download(Request $request)
	{
		//		return response()->streamDownload(function () {
		//			echo "hello world";
		//		}, 'users.txt');

		$validate = $request->validate([
			'svg' => ['string', 'min:2']
		]);

		$content = $validate['svg'];
		$filename = 'grapheur.svg';
		return response()->streamDownload(function () use ($content) {
			echo $content;
		}, $filename);
	}

	public function search(string $type, string $terms)
	{
		// export type searchFilter = 'chapters' | 'posts' | 'challenges' | 'quizzes' | 'decks' | 'tools' | 'howtos'

		// Do the search only if $terms has at least two characters.
		if (strlen($terms) < 2) {
			return [];
		}

		$found = [];

		// Chapters
		// Search in title, slug and blocks.body
		if ($type === 'all' or $type === 'chapters') {
			$found['chapters'] = $this->searchChapters($terms);
		}

		// Posts
		// Search in title and slug
		if ($type === 'all' or $type === 'posts') {
			$found['posts'] = $this->searchPosts($terms);


		}

		if ($type === 'howtos') {
			$found['howtos'] = $this->searchPosts($terms, 'howto');
		}


		// Blocks
		// Search in title and body
		if ($type === 'all' or $type === 'blocks') {
			$found['blocks'] = $this->searchBlocks($terms);
		}

		// Challenges

		return $found;
	}

	public function searchChapters(string $terms)
	{
		return Chapter::with(['blocks'])
		              ->where('title', 'like', '%' . $terms . '%')
		              ->orWhere('slug', 'like', '%' . $terms . '%')
		              ->orWhereHas('blocks', function ($query) use ($terms) {
			              $query
				              ->where('title', 'like', '%' . $terms . '%')
				              ->orWhere('body', 'like', '%' . $terms . '%');
		              })
		              ->get();
	}

	public function searchPosts(string $terms, string $type = null)
	{
		if ($type === 'howto') {
			return Post::where('title', 'like', '%' . $terms . '%')
			           ->where('type', '=', $type)
			           ->get();
		}

		return Post::with(['chapter'])
		           ->where('title', 'like', '%' . $terms . '%')
		           ->get();
	}

	public function searchBlocks(string $terms)
	{
		return Block::where('title', 'like', '%' . $terms . '%')
		            ->orWhere('body', 'like', '%' . $terms . '%')
		            ->get();
	}

	public function dico(string $language, int $number = 1, string $size = 'infinity', string $common = '1', bool $withoutDuplicateLetters = false)
	{
		// Query from the database dictionary table.
		// $size is the number of the letter in the word column
		// $number is the number of word to fetch.
		$query = DB::table('dictionary')
		           ->where('language', $language)
		           ->where('common', $common);

		if ($withoutDuplicateLetters) {
			// REGEXP est spécifique à MySQL : on ne l'applique que sur ce moteur.
			// (Mots en majuscule sans accent : la classe [A-Z] suffit.)
			if (DB::connection()->getDriverName() === 'mysql') {
				$query->whereRaw('word REGEXP ?', "^(?!.*([A-Z])\\1).*$");
			}
		}

		// $size peut valoir 'infinity' (pas de filtre). On ne filtre que pour un entier positif.
		// LENGTH() est portable et équivaut à CHAR_LENGTH pour des mots ASCII en majuscule.
		if (is_numeric($size) and (int) $size > 0) {
			$query->whereRaw('LENGTH(word) = ?', [(int) $size]);
		}

		$words = $query
			->inRandomOrder()
			->limit($number)
			->pluck('word');

		return $words;
	}

	public function wordExistsInDictionary(string $language, string $word)
	{
		// TODO: Pour l'instant, tous les mots sont en majuscule, sans accent. Il faudra peut-être changer ça.
		$found = DB::table('dictionary')
		           ->where('language', $language)
		           ->where('word', $word)
		           ->exists();

		return $found;
	}

	public function qrcode()
	{
		return Inertia::render('QRCode', []);
	}

	public function fullscreen()
	{
		return Inertia::render('WidgetFullscreen');
	}
}
