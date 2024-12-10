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

//		// TODO: remove once all touch are updated ... Then, it will just be needed to check the latest "posts.updated_at" instead of "blocks.updated_at"
//		$latestBlocks = DB::table('blocks')
//			->select('posts.chapter_id', DB::raw('MAX(blocks.updated_at) as latest_block_updated_at'))
//			->join('posts', 'blocks.blockable_id', '=', 'posts.id')
//			->where('blocks.blockable_type', Post::class)
//			->groupBy('posts.chapter_id');
//
//		$newChapters = Chapter::with(['theme', 'blocks', 'posts.blocks', 'posts.blocks.illustrations'])
//			->where('chapters.active', true)
//			->joinSub($latestBlocks, 'latest_blocks', function ($join) {
//				$join->on('chapters.id', '=', 'latest_blocks.chapter_id');
//			})
//			->orderBy('latest_blocks.latest_block_updated_at', 'desc')
//			->limit(5)
//			->get(['chapters.*', 'latest_blocks.latest_block_updated_at']);

		return Inertia::render('HomePage', [
//			'newChapters' => ChapterShowResource::collection($newChapters)
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
					'maxPost' => count($chapter->posts)
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

	public function search(string $terms)
	{
		// category: 'chapter' | 'post' | 'challenge' | 'quizz' | 'deck' | 'tool'
		// Do the search only if $terms has at least two caracters.
		if (strlen($terms) < 2) {
			return [];
		}

		$found = [];

		// Chapters
		// Search in title, slug and blocks.body
		$found[] = [
			'type' => 'chapter',
			'items' => $this->searchChapters($terms)
		];

		// Posts
		// Search in title and slug
		$found[] = [
			'type' => 'post',
			'items' => $this->searchPosts($terms)
		];

		// Blocks
		// Search in title and body
		$found[] = [
			'type' => 'block',
			'items' => $this->searchBlocks($terms)
		];

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

	public function searchPosts(string $terms)
	{
		return Post::where('title', 'like', '%' . $terms . '%')
			->orWhere('slug', 'like', '%' . $terms . '%')
			->get();
	}

	public function searchBlocks(string $terms)
	{
		return Block::where('title', 'like', '%' . $terms . '%')
			->orWhere('body', 'like', '%' . $terms . '%')
			->get();
	}
}
