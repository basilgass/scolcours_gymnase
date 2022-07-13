<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChapterResource;
use App\Http\Resources\QuestionCollection;
use App\Models\Chapter;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ChaptersController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth')->except(['index', 'show']);
	}

	public function index(Theme $theme)
	{
		if (Auth::User()?->admin) {
			$chapters = ChapterResource::collection($theme->chapters()
				->with('challenges')
				->get());
		} else {
			$chapters = ChapterResource::collection($theme->chapters()
				->with('challenges')
				->where('active', true)
				->get());
		}

		// Filter output.
		// TODO: filter values passed for chapters using resources
		$data = [
			"theme" => $theme->only('color', 'icon', 'slug', 'title', 'id'),
			"chapters" => $chapters
		];

		return Inertia::render("Chapters/ChapterIndex", $data);
	}

	public function create(Theme $theme)
	{
		// TODO: route is disabled - does not exist anymore !
//		return Inertia::render("Chapters/ChapterCreate",[
//			"theme" => $theme->only('color', 'icon', 'slug', 'title', 'id')
//		]);
	}

	public function store(Theme $theme, Request $request)
	{
		$request->merge([
			'slug' => Str::slug($request->title)
		]);

		$validation = $request->validate([
			'title' => ['string', 'required', 'min:2'],
			'slug' => ['string', 'unique:chapters,slug']
		]);


		$chapter = $theme->chapters()->create([
			'title' => $validation['title'],
			'slug' => $validation['slug'],
		]);

		// Create a specific block
		$chapter->blocks()->create([
			'body'=>'Aucune extrait...'
		]);

		return redirect()->route('theme.chapter', [$theme->slug, $chapter->slug]);
	}

	public function show(Theme $theme, Chapter $chapter)
	{
		if ($chapter->active or Auth::User()?->admin) {

			// Get the user data
			return Inertia::render('Chapters/ChapterShow', [
				// Used for the page layout
				"theme" => $theme->only('color', 'icon', 'slug', 'title', 'id'),
				// Get the chapter
				"chapter" => fn() => ChapterResource::make($chapter),
				// Find a component if it exists.
				"component" => $chapter->component,
			]);
		} else {
			return Inertia::render('ErrorPage.vue', [
				"body" => "La page n'est pas active - contacter l'administrateur."
			]);
		}
	}

	public function edit(Chapter $chapter)
	{
//		return Inertia::render('Chapters/ChapterEdit', [
//			'chapter' => $chapter
//		]);
	}

	public function update(Request $request, Chapter $chapter)
	{
		$validation = $request->validate([
			'title' => ['required', 'min:2', 'max:255'],
			'slug' => ['required', 'min:1', 'max:255'],
		]);

		$chapter->title = $validation['title'];
		$chapter->slug = $validation['slug'];
		$chapter->save();

		return $chapter;
	}

	public function destroy(Chapter $chapter)
	{
		//
	}

	public function fetchComponents(Chapter $chapter)
	{
		$components = [];
		foreach (Storage::disk('chapters')->files($chapter->theme->slug . '/' . $chapter->slug) as $file) {
			$components[] = $file;
		}

		return $components;
	}


	// TO BE REMOVED
	public function download(string $filename)
	{
		return Storage::disk('public')->download('/pdf/' . $filename);
	}

	// TODO: Delete this section as it has been moved to LatexController ?
//	public function latex(Request $data)
//	{
//		$requestData = json_decode($data->getContent());
//
//		// TODO: modifier le nom du fichier - déplacer dans LatexController.php
//		$filename = $requestData->slug . '.pdf';
//		(new LaraTeX('latex.WhatToKnow'))->with([
//			'title' => $requestData->title,
//			'questions' => $requestData->questions
//		])
//			->savePdf(storage_path('app/public/pdf/' . $filename));
//
//		return $filename;
//	}
}
