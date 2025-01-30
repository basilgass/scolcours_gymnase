<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChapterResource;
use App\Http\Resources\ChapterShowResource;
use App\Models\Block;
use App\Models\Chapter;
use App\Models\Post;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
		$chapters = Auth::user()->chapters;
		$chapters->load("posts");

		$courses = ChapterResource::collection($chapters)
			->map(function ($chapter) {
				return $chapter->additional([
												'currentPost' => $chapter->posts->where('id', $chapter->pivot->post_id)->first()->order,
												'maxPost'     => count($chapter->posts)
											]);
			});

		// $courses = ChapterResource + CurrentPost + MaxPost
		return Inertia::render('DashboardPage', [
			'courses' => $courses
		]);
	}

	public function devIndex()
	{
		// Get all devs.
		$devPages = collect(Storage::disk('devs')->files())->map(function ($p) {
			return pathinfo($p)['filename'];
		});

		return Inertia::render("Devs/DevsIndex", [
			'pages' => $devPages
		]);
	}

	public function dev($page)
	{
		return Inertia::render('Devs/DevsShow', [
			"dev" => $page
		]);
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
				$query->where('title', 'like', '%' . $terms . '%')
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
}
