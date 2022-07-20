<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Theme;
use App\Models\Tools;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminController extends Controller
{
	public function show()
	{
		$this->loadChapters();
		$this->loadChallenges();
		$this->loadTools();

		return Inertia::render(
			'AdminPage.vue',
			[
				'tools' => Tools::all()->map(function ($tool, $key) {
					return [
						'slug' => $tool->slug,
						'title' => $tool->title,
						'updated_at' => $tool->updated_at->format('d.m.Y H:m')
					];
				}),
				'chapters' => Chapter::all()->map(function ($tool, $key) {
					return [
						'slug' => $tool->slug,
						'title' => $tool->title,
						'theme' => $tool->theme->slug,
						'active' => $tool->active,
						'updated_at' => $tool->updated_at->format('d.m.Y H:m')
					];
				}),
				'challenges' => Challenge::all()->map(function ($tool, $key) {
					return [
						'slug' => $tool->slug,
						'title' => $tool->title,
						'updated_at' => $tool->updated_at->format('d.m.Y H:m')
					];
				})
			]
		);
	}

	public function loadChapters()
	{
		// Detect all chapters and create "empty one", disabled by default.
		foreach (Theme::all() as $theme) {
			foreach (Storage::disk('chapters')->directories($theme->slug) as $chapter) {
				$slug = explode('/', $chapter)[1];

				// Check if the chapter exists.
				$chapter = Chapter::where('slug', $slug)->first();

				if (!$chapter) {
					$chapter = Chapter::create([
						'theme_id'=> $theme->id,
						'title' => $slug,
						'slug' => $slug,
//						'body' => 'Aucun extrait...'
					]);
					$chapter->blocks()->create();
				}
			}
		}
	}

	public function loadTools()
	{
		foreach (Storage::disk('tools')->files() as $file) {
			$slug = substr($file, 0, -4);
			$lastModified = Storage::disk('tools')->lastModified($file);
			$existingTools = Tools::where('slug', $slug)->first();

			// Les informations dans la base de données sont plus récente - pas de modification à faire.
			if ($existingTools?->updated_at->greaterThanOrEqualTo(Carbon::createFromTimestamp($lastModified))) {
				continue;
			}

			// Les informations dans le fichier sont plus récent... on récupère les données.
			$content = Storage::disk('tools')->get($file);

			// Le titre
			if (preg_match("/\*\stitle:\s?(.+)/", $content, $title)) {
				$title = $title[1];
			} else {
				$title = '';
			}

			// La description
			if (preg_match("/\*\sbody:\s?(.+)/", $content, $body)) {
				$body = $body[1];
			} else {
				$body = '';
			}

			// Les paramètrs
			if (preg_match("/\*\sparameters:\s?(.+)/", $content, $parameters)) {
				$parameters = collect(explode(",", $parameters[1]))->map(fn($x) => trim($x));
			} else {
				$parameters = collect([]);
			}

			// Les tags
			if (preg_match("/\*\stags:\s?(.+)/", $content, $tags)) {
				$tags = collect(explode(",", $tags[1]))->map(fn($x) => trim($x));
			} else {
				$tags = collect([]);
			}

			// Création dans la base de donnée.
			Tools::updateOrCreate(
				[
					"slug" => $slug
				],
				[
					"title" => $title,
					"body" => $body,
					"parameters" => $parameters
				]
			);
		}
	}

	public function loadChallenges()
	{
		foreach (Theme::all() as $theme) {
			foreach (Storage::disk('chapters')->directories($theme->slug) as $chapter) {
				$chapter_slug = explode('/', $chapter)[1];
				$chapter_id = Chapter::where('slug', $chapter_slug)->first()->id;

				if($chapter) {
					foreach (Storage::disk('chapters')->files($chapter . '/challenges') as $file) {
						$slug = pathinfo($file)['filename'];

						$lastModified = Storage::disk('chapters')->lastModified($file);
						$existingTools = Tools::where('slug', $slug)->first();

						// Les informations dans la base de données sont plus récente - pas de modification à faire.
						if ($existingTools?->updated_at->greaterThanOrEqualTo(Carbon::createFromTimestamp($lastModified))) {
							continue;
						}

						// Read the content to get the title.
						$content = Storage::disk('chapters')->get($file);

						// Get the title
						if (preg_match("/const title = [\"]\s?(.+)[\"]/", $content, $title)) {
							$title = preg_replace("[\"]", "", $title[1]);
						} else {
							$title = $slug;
						}

						// Create or update the challenge
						$challenge = Challenge::where('slug', $slug)->first();

						if(!$challenge) {
							$challenge = Challenge::create(
								[
									"chapter_id" => $chapter_id,
									"title" => $title,
									"slug" => $slug,
									"active" => false
								]
							);
							$challenge->blocks()->create();
						}


					}
				}
			}
		}
	}

	public function activate(Chapter $chapter, Request $request)
	{
		$request->validate([
			'slug' => ['required', 'exists:App\Models\Chapter,slug'],
			'active' => ['required', 'boolean']
		]);

		// Update the chapter
		$chapter->active = $request->active;
		$chapter->save();

		return redirect()->route('admin');

	}
}
