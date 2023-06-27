<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use Auth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

//use App\Models\Exercise;

class ScolcoursController extends Controller
{
	public function index()
	{
		$newChapters = Chapter::without(['posts', 'formulas', 'challenges'])
			->orderBy('updated_at', 'desc')
			->limit(5)
			->where('active', true)
			->get();

		$newChapters = $newChapters->Map(function (Chapter $item) {
//			$modified = $item->updated_at->diffInDays();
//			if ($modified === 0) {
//				$modified = $item->updated_at->diffForHumans();
//			} else {
//				$modified = "Il y a $modified jour" . ($modified > 1 ? "s" : "");
//			}
//
//			$modified = $item->updated_at->diffForHumans();
			return [
				"id"=>$item->id,
				"slug"=>$item->slug,
				"title"=>$item->title,
				"url"=>$item->url,
				"modified"=>$item->updated_at->diffForHumans()
			];
		});

		// TODO : canLogin and canRegister could be removed ?
		return Inertia::render('HomePage.vue', [
			'canLogin' => Route::has('login'),
			'canRegister' => Route::has('register'),
			'newChapters' => $newChapters
		]);
	}

	public function dashboard()
	{
		$courses = Auth::user()->chapters
			->map(function ($chapter) {
				return [
					'slug' => $chapter->slug,
					'title' => $chapter->title,
					'theme' => $chapter->theme->slug,
					'currentPost' => $chapter->posts->where('id', $chapter->pivot->post_id)->first()->order,
					'maxPost' =>count($chapter->posts),
					'open' => $chapter->pivot->open,
					'updated_at' => Carbon::parse($chapter->pivot->updated_at)->diffForHumans()
				];
			});

		return Inertia::render('DashboardPage.vue', [
			'courses' => $courses
		]);
	}

	public function devIndex()
	{
		// Get all devs.
		$devPages = collect(Storage::disk('devs')->files())->map(function ($p) {
			return pathinfo($p)['filename'];
		});

		return Inertia::render("Devs/DevsIndex.vue", [
			'pages' => $devPages
		]);
	}

	public function dev($page)
	{
		return Inertia::render('Devs/DevsShow.vue', [
			"dev" => $page
		]);
	}
}
