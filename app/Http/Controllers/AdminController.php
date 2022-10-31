<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Theme;
use App\Models\Tools;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminController extends Controller
{
	public function show()
	{
		return Inertia::render('Admin/AdminDashboard.vue');
	}

	public function pages()
	{
//		$this->loadChapters();
//		$this->loadChallenges();
		$this->loadTools();

		return Inertia::render(
			'Admin/AdminPagesShow.vue',
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

	public function users()
	{
		return Inertia::render(
			'Admin/AdminUsersShow.vue', [
			"users" => User::all()
		]);
	}

	public function createUsers(Request $request)
	{
		$validation = $request->validate([
			"users" => ['required'],
			"users.*" => ['email'],
			'password' => ['required', 'string', 'min:6']
		]);

		foreach ($validation['users'] as $email) {
			User::create([
				'name' => explode("@", $email)[0],
				'email' => $email,
				'password' => Hash::make($validation['password']),
			]);
		}

		return redirect(route('admin.users'));
	}

	public function destroyUser(User $user)
	{
		$user->delete();
		return true;
	}

	// TODO Remove loadChapters from AdminController
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
						'theme_id' => $theme->id,
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

	// TODO Remove loadChallenges from AdminController
	public function loadChallenges()
	{
		foreach (Theme::all() as $theme) {
			foreach (Storage::disk('chapters')->directories($theme->slug) as $chapter) {
				$chapter_slug = explode('/', $chapter)[1];
				$chapter_id = Chapter::where('slug', $chapter_slug)->first()->id;

				if ($chapter) {
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

						if (!$challenge) {
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

	public function usersStats(Chapter $chapter)
	{
		//TODO: usersstats : should be move somewhere else.. in a specific controller.

		// Get all users that has answered a question from this chapter.
		// 1. Filter the users to match a "classroom"
		// 2. For all users, get the "most advanced" exercise, the percentage of resolving, ...
		// 3. display the result

		// Doit récupérer les utilisateurs du "groupe/classe"
		$users = User::all();
		$users_id = $users->map(fn($user) => $user->id);

		$stats = [];
		foreach ($chapter->posts as $post) {
			$stats[$post->id] = [
				'title' => $post->title,
				'type' => $post->type,
				'questions' => $post->questions->map(function ($question) use ($users_id) {
					/** Chaque question doit contenir
					 * id et body (pour l'affichage et l'unicité)
					 * resolved: le nombre d'utilisateurs du groupe ayant répondu correctement
					 * answers: le nombre de réponses moyenne par utilisateur nécessaire pour répondre à la question
					 */

					// Liste des utilisateurs du groupe qui ont répondu à cette question
					$filteredUsers = $question->users->whereIn('id', $users_id);

					$answers = $filteredUsers->countBy(function($user){return $user->id;});

					return [
						'id' => $question->id,
						'body' => $question->body,
						'resolved' => $filteredUsers->where('pivot.result', 1)->count(),
						'answers' => [
							'min' => $answers->min(),
							'max' => $answers->max(),
							'average' => $answers->average()
						]
					];
				}
				)];
		}

		return Inertia::render(
			'Admin/AdminStatsShow.vue',
			[
				"chapter" => $chapter,
				"users" => $users->count(),
				"questions" => $chapter->questions,
				"stats" => $stats
			]
		);
	}
}
