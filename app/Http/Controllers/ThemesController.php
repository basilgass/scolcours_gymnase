<?php

	namespace App\Http\Controllers;

	use App\Models\Chapter;
	use App\Models\Theme;
	use App\Models\Tools;
	use Illuminate\Http\Request;
	use Inertia\Inertia;
	
	class ThemesController extends Controller
	{
		public function index()
		{
			//
		}

		public function create()
		{
			//
		}

		public function store(Request $request)
		{
			//
		}

		public function show(Theme $theme)
		{
			$component = $theme->slug === 'tools' ? "Tools" : "Chapters/index";
			$data = [
				"theme" => $theme,
				"chapters" => $theme->chapters()->get(['slug', 'title', 'body'])
			];

			if($theme->slug==='tools'){
				$data['tools'] = Tools::all();
				return Inertia::render("Tools", $data);
			}else{
				return Inertia::render("Chapters/index", $data);
			}
		}

		public function chapter(Theme $theme, Chapter $chapter)
		{
			// fetch all exercises from this chapter.
			$exercises = $chapter->exercises;

			return Inertia::render('Chapters/Chapter', [
				"theme" => $theme,
				"chapter" => $chapter,
				"hasChapterComponent" => file_exists(resource_path("js/Chapters/{$theme->slug}/{$chapter->slug}.vue")),
			]);
		}

		public function edit(Theme $theme)
		{
			//
		}

		public function update(Request $request, Theme $theme)
		{
			//
		}

		public function destroy(Theme $theme)
		{
			//
		}
	}
