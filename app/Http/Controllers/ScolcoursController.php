<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Theme;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//use App\Models\Exercise;

class ScolcoursController extends Controller
{
	public function index()
	{
		$themes = Theme::all();
		$newChapters = Chapter::orderBy('updated_at', 'desc')
			->limit(5)
			->where('active', true)
			->get();

		$newChapters->Map(function ($item) {
			$modified = $item->updated_at->diffInDays();
			if ($modified === 0) {
				$modified = $item->updated_at->diffForHumans();
			}else{
				$modified = "Il y a $modified jour".($modified>1?"s":"");
			}
			$item->modified = $modified;

			// Save the href
			$item->href = $item->url;

			return $item;
		});

		// TODO : canLogin and canRegister could be removed ?
		return Inertia::render('HomePage.vue', [
			'canLogin' => Route::has('login'),
			'canRegister' => Route::has('register'),
			'themes' => $themes,
			'newChapters' => $newChapters
		]);
    }

	public function dev($page)
	{
		return Inertia::render('Devs/'.$page);
	}
}
