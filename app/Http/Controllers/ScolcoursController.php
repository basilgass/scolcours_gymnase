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
//		$newChapters = Chapter::with(['theme', 'blocks', 'posts.blocks', 'posts.blocks.illustrations'])
//			->where('active', true)
//			->addSelect(['latest_block_updated_at' => Block::select('blocks.updated_at')
//				->join('posts', 'blocks.blockable_id', '=', 'posts.id')
//				->whereColumn('posts.chapter_id', '=', 'chapters.id')
//				->where('blockable_type', Post::class)
//				->orderBy('blocks.updated_at', 'desc')
//				->limit(1)
//			])
//			->orderBy('latest_block_updated_at', 'desc')
//			->limit(5)
//			->get();

		$latestBlocks = DB::table('blocks')
			->select('posts.chapter_id', DB::raw('MAX(blocks.updated_at) as latest_block_updated_at'))
			->join('posts', 'blocks.blockable_id', '=', 'posts.id')
			->where('blocks.blockable_type', Post::class)
			->groupBy('posts.chapter_id');

		$newChapters = Chapter::with(['theme', 'blocks', 'posts.blocks', 'posts.blocks.illustrations'])
			->where('chapters.active', true)
			->joinSub($latestBlocks, 'latest_blocks', function ($join) {
				$join->on('chapters.id', '=', 'latest_blocks.chapter_id');
			})
			->orderBy('latest_blocks.latest_block_updated_at', 'desc')
			->limit(5)
			->get(['chapters.*', 'latest_blocks.latest_block_updated_at']);

		return Inertia::render('HomePage', [
			'newChapters' => ChapterShowResource::collection($newChapters)
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
		return response()->streamDownload(function () {
			echo "hello world";
		}, 'users.txt');

		$validate = $request->validate([
			'svg' => ['string', 'min:2']
		]);

		$content = $validate['svg'];
		$filename = 'grapheur.svg';
		return response()->streamDownload(function () use ($content) {
			echo $content;
		}, $filename);
	}
}
