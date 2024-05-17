<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChapterResource;
use App\Http\Resources\ToolResource;
use App\Http\Resources\UserResource;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Illustration;
use App\Models\Scolcours;
use App\Models\Team;
use App\Models\Theme;
use App\Models\Tool;
use App\Models\User;
use App\Models\Widget;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminController extends Controller
{
	public function show()
	{
		return Inertia::render('Admin/AdminDashboard');
	}

	public function config()
	{
		$scolcours = Cache::get('scolcours');

		return Inertia::render('Admin/AdminConfigPage',
			[
				"title"     => $scolcours->title,
				"allThemes" => Theme::orderBy('order')->get()
			]
		);
	}

	public function configUpdate(Request $request)
	{
		// Validation
		$validation = $request->validate([
			'title'            => ['string', 'min:2'],
			'themes'           => ['array'],
			'themes.*.slug'    => ['string', 'exists:App\Models\Theme,slug'],
			'themes.*.enabled' => ['boolean'],
		]);

		$scolcours = Scolcours::find(1);
		$scolcours->title = $validation[ 'title' ];
		$scolcours->save();

		Cache::delete('scolcours');

		foreach ($validation[ 'themes' ] as $theme) {
			$model = Theme::where('slug', $theme[ "slug" ])->first();
			$model->enabled = $theme[ 'enabled' ];
			$model->save();
		}

		return true;
	}

	public function configUpdateOrder(Request $request)
	{
		$validation = $request->validate([
			'order'         => ['array'],
			'order.*.id'    => ['exists:App\Models\Theme'],
			'order.*.order' => ['int', 'min:1'],
		]);

		foreach ($validation[ 'order' ] as $value) {
			Theme::find($value[ 'id' ])->update([
				'order' => $value[ 'order' ]
			]);
		}

		// Reset the cache.
		Cache::delete('scolcours');
		Cache::delete('themes');

		return true;
	}

	public function chapters()
	{
		return Inertia::render(
			'Admin/AdminChaptersPage',
			[
				'chapters'   => ChapterResource::collection(Chapter::all())
			]
		);
	}

	public function tools()
	{
		$this->loadTools();

		return Inertia::render(
			'Admin/AdminToolsPage',
			[
				'tools'      => ToolResource::collection(Tool::all())
			]
		);
	}

	public function challenges()
	{
		return Inertia::render(
			'Admin/AdminChallengesPage',
			[
				'challenges' => Challenge::all()->map(function ($tool, $key) {
					return [
						'slug'       => $tool->slug,
						'title'      => $tool->title,
						'updated_at' => $tool->updated_at->format('d.m.Y H:m')
					];
				})
			]
		);
	}

	public function loadTools()
	{
		foreach (Storage::disk('tools')->files() as $file) {
			$slug = substr($file, 0, -4);
			$existingTools = Tool::where('slug', $slug)->first();

			if($existingTools?->exists()){continue;}

			$lastModified = Storage::disk('tools')->lastModified($file);

			// Les informations dans la base de données sont plus récente - pas de modification à faire.
			if ($existingTools?->updated_at->greaterThanOrEqualTo(Carbon::createFromTimestamp($lastModified))) {
				continue;
			}

			// Les informations dans le fichier sont plus récent... on récupère les données.
			$content = Storage::disk('tools')->get($file);

			// Le titre
			if (preg_match("/\*\stitle:\s?(.+)/", $content, $title)) {
				$title = $title[ 1 ];
			} else {
				$title = '';
			}

			// La description
			if (preg_match("/\*\sbody:\s?(.+)/", $content, $body)) {
				$body = $body[ 1 ];
			} else {
				$body = '';
			}

			// Les paramètrs
			if (preg_match("/\*\sparameters:\s?(.+)/", $content, $parameters)) {
				$parameters = collect(explode(",", $parameters[ 1 ]))->map(fn($x) => trim($x));
			} else {
				$parameters = collect([]);
			}

			// Les tags
			if (preg_match("/\*\stags:\s?(.+)/", $content, $tags)) {
				$tags = collect(explode(",", $tags[ 1 ]))->map(fn($x) => trim($x));
			} else {
				$tags = collect([]);
			}

			// Création dans la base de donnée.
			Tool::updateOrCreate(
				[
					"slug" => $slug
				],
				[
					"title"      => $title,
					"body"       => $body,
					"parameters" => $parameters
				]
			);
		}
	}

	public function widgets()
	{
		return Inertia::render(
			'Admin/AdminWidgetsPage', [
			"widgets" => Widget::all()
		]);
	}

	public function users()
	{
		return Inertia::render(
			'Admin/AdminUsersPage', [
			"users" => UserResource::collection(User::all()),
			"teams" => Team::all()
		]);
	}

	public function createUsers(Request $request)
	{
		$validation = $request->validate([
			"users"    => ['required'],
			"users.*"  => ['email'],
			'password' => ['required', 'string', 'min:6']
		]);

		foreach ($validation[ 'users' ] as $email) {
			$username = explode("@", $email)[ 0 ];
			$firstname_name = explode(".", $username);
			if (count($firstname_name) == 1) {
				$firstname = null;
				$name = $firstname_name[ 0 ];
			} else {
				$firstname = $firstname_name[ 0 ];
				$name = $firstname_name[ 1 ];
			}

			User::create([
				'name'      => ucwords($name),
				'firstname' => ucwords($firstname ?? ""),
				'email'     => $email,
				'password'  => Hash::make($validation[ 'password' ]),
			]);
		}

		return redirect(route('admin.users'));
	}

	public function updateUser(User $user, Request $request)
	{
		$request->validate([
			'name'      => 'required',
			'firstname' => 'required'
		]);

		$user->name = $request->name;
		$user->firstname = $request->firstname;
		$user->save();
		$user->refresh();

		return UserResource::make($user);
	}

	public function destroyUser(User $user)
	{
		$user->delete();
		return true;
	}

	public function loadChapters()
	{
		// Detect all chapters and create "empty one", disabled by default.
		foreach (Theme::all() as $theme) {
			foreach (Storage::disk('chapters')->directories($theme->slug) as $chapter) {
				$slug = explode('/', $chapter)[ 1 ];

				// Check if the chapter exists.
				$chapter = Chapter::where('slug', $slug)->first();

				if (!$chapter) {
					$chapter = Chapter::create([
						'theme_id' => $theme->id,
						'title'    => $slug,
						'slug'     => $slug,
						//						'body' => 'Aucun extrait...'
					]);
					$chapter->blocks()->create();
				}
			}
		}
	}

	// TODO Remove loadChallenges from AdminController

	public function loadChallenges()
	{
		foreach (Theme::all() as $theme) {
			foreach (Storage::disk('chapters')->directories($theme->slug) as $chapter) {
				$chapter_slug = explode('/', $chapter)[ 1 ];
				$chapter_id = Chapter::where('slug', $chapter_slug)->first()->id;

				if ($chapter) {
					foreach (Storage::disk('chapters')->files($chapter . '/challenges') as $file) {
						$slug = pathinfo($file)[ 'filename' ];

						$lastModified = Storage::disk('chapters')->lastModified($file);
						$existingTools = Tool::where('slug', $slug)->first();

						// Les informations dans la base de données sont plus récente - pas de modification à faire.
						if ($existingTools?->updated_at->greaterThanOrEqualTo(Carbon::createFromTimestamp($lastModified))) {
							continue;
						}

						// Read the content to get the title.
						$content = Storage::disk('chapters')->get($file);

						// Get the title
						if (preg_match("/const title = [\"]\s?(.+)[\"]/", $content, $title)) {
							$title = preg_replace("[\"]", "", $title[ 1 ]);
						} else {
							$title = $slug;
						}

						// Create or update the challenge
						$challenge = Challenge::where('slug', $slug)->first();

						if (!$challenge) {
							$challenge = Challenge::create(
								[
									"chapter_id" => $chapter_id,
									"title"      => $title,
									"slug"       => $slug,
									"active"     => false
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
			'slug'   => ['required', 'exists:App\Models\Chapter,slug'],
			'active' => ['required', 'boolean']
		]);

		// Update the chapter
		$chapter->active = $request->active;
		$chapter->save();

		return redirect()->route('admin.pages');
	}


	public function illustrations()
	{
		return Inertia::render(
			'Admin/AdminIllustrationsPage',
			[
				'illustrations' => Illustration::where('type', "=", "draw")->get()
			]
		);
	}

	public function updateAValue(Request $request)
	{
		$request->validate([
			'model'  => ["string"],
			'id'     => ["int"],
			'column' => ["string"],
			'value'  => ["string", "nullable"]
		]);

		// Get the model
		$model = app('App\\Models\\' . $request->model);
		$model = $model::find($request->id);

		$model[ $request->column ] = $request->value;
		$model->save();

		return $model;
	}

	public function dev()
	{
		return Inertia::render('Admin/AdminDev');
	}
}
