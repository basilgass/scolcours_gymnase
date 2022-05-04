<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Ismaelw\LaraTeX\LaraTeX;

class ChaptersController extends Controller
{
	public function generic(Chapter $chapter)
	{
		return redirect()->route('theme.chapter', [$chapter->theme->slug, $chapter->slug]);
	}
	public function home()
	{
		$themes = Theme::all();
		$newChapters = Chapter::orderBy('created_at', 'desc')
			->limit(5)
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

		return Inertia::render('Welcome', [
			'canLogin' => Route::has('login'),
			'canRegister' => Route::has('register'),
			'themes' => $themes,
			'newChapters' => $newChapters
		]);
	}

	public function index(Theme $theme)
	{
		$data = [
			"theme" => $theme->only('color', 'icon', 'slug', 'title', 'id'),
			"chapters" => $theme->chapters()->get(['slug', 'title', 'body'])
		];

		return Inertia::render("Chapters/index", $data);
	}

	public function create()
	{
		//
	}

	public function store(Request $request)
	{
		//
	}

	public function show(Theme $theme, Chapter $chapter)
	{
		return Inertia::render('Chapters/Chapter', [
			"theme" => $theme->only('color', 'icon', 'slug', 'title', 'id'),
			"chapter" => $chapter,
			"hasChapterComponent" => file_exists(resource_path("js/Chapters/{$theme->slug}/{$chapter->slug}.vue")),
		]);
	}

	public function edit(Chapter $chapter)
	{
		//
	}

	public function update(Request $request, Chapter $chapter)
	{
		//
	}

	public function destroy(Chapter $chapter)
	{
		//
	}

	public function download(string $filename)
	{
		return Storage::disk('public')->download('/pdf/' . $filename);
	}

	public function latex(Request $data)
	{
		$requestData = json_decode($data->getContent());

		// TODO: modifier le nom du fichier.
		$filename = $requestData->slug . '.pdf';
		(new LaraTeX('latex.WhatToKnow'))->with([
			'title' => $requestData->title,
			'questions' => $requestData->questions
		])
			->savePdf(storage_path('app/public/pdf/' . $filename));

		return $filename;
	}
}
