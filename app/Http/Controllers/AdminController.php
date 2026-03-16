<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChapterResource;
use App\Http\Resources\CourseResource;
use App\Http\Resources\GeneratorResource;
use App\Http\Resources\TeamResource;
use App\Http\Resources\ToolResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserTeamResource;
use App\Http\Resources\WidgetResource;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Generator;
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

// REFACTOR: A retravailler complètement
class AdminController extends Controller
{
	public function show()
	{
		return Inertia::render('Admin/AdminDashboard', [
			"courses" => $this->currentCourses(),
			"teams"   => TeamResource::collection(Team::active()->get()),
		]);
	}

	public function currentCourses()
	{
		$now = Carbon::now()->startOfDay();

		$courses = Course::whereHas('lessons.calendars', function ($query) use ($now) {
			$query->where('scheduled_at', ">=", $now);
		})->with([
			'lessons' => function ($q) use ($now) {
				$q->whereHas('calendars', function ($qc) use ($now) {
					$qc->where('scheduled_at', '>=', $now);
				})->with([
					'calendars' => function ($c) use ($now) {
						$c
							->where('scheduled_at', '>=', $now)
							->orderBy('scheduled_at', 'asc')
							->orderBy('id', 'asc');;
					}
				])->orderBy('order')->orderBy('id');
			},
			'teams'
		])
		                 ->get();

		return $courses;
	}

	public function config()
	{
		$scolcours = Cache::get('scolcours');

		return Inertia::render(
			'Admin/AdminConfig',
			[
				"title"     => $scolcours->title,
				"allThemes" => Theme::orderBy('order')->get()
			]
		);
	}

	public function configUpdate(Request $request)
	{
		// Validation
		$validated = $request->validate([
			'title'            => ['string', 'min:2'],
			'themes'           => ['array'],
			'themes.*.slug'    => ['string', 'exists:App\Models\Theme,slug'],
			'themes.*.enabled' => ['boolean'],
		]);

		$scolcours = Scolcours::find(1);
		$scolcours->title = $validated['title'];
		$scolcours->save();

		Cache::delete('scolcours');

		foreach ($validated['themes'] as $theme) {
			$model = Theme::where('slug', $theme["slug"])->first();
			$model->enabled = $theme['enabled'];
			$model->save();
		}

		return true;
	}

	public function configUpdateOrder(Request $request)
	{
		$validated = $request->validate([
			'order'         => ['array'],
			'order.*.id'    => ['exists:App\Models\Theme'],
			'order.*.order' => ['int', 'min:1'],
		]);

		foreach ($validated['order'] as $value) {
			Theme::find($value['id'])->update([
				'order' => $value['order']
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
			'Chapters/admin/AdminChapter',
			[
				'chapters' => ChapterResource::collection(Chapter::all())
			]
		);
	}

	public function tools()
	{
		$this->loadTools();

		return Inertia::render(
			'Tools/admin/AdminTool',
			[
				'tools' => ToolResource::collection(Tool::all())
			]
		);
	}

	public function loadTools()
	{
		foreach (Storage::disk('tools')->files() as $file) {
			$slug = substr($file, 0, -4);
			$existingTools = Tool::where('slug', $slug)->first();

			if ($existingTools?->exists()) {
				continue;
			}

			$lastModified = Storage::disk('tools')->lastModified($file);

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

	public function challenges()
	{
		return Inertia::render(
			'Challenges/admin/AdminChallenge',
			[
				'challenges' => Challenge::all()->map(function (Challenge $tool, $key) {
					return [
						'slug'       => $tool->slug,
						'title'      => $tool->title,
						'theme_id'   => $tool->chapter->theme_id,
						'updated_at' => $tool->updated_at->format('d.m.Y H:m'),
					];
				})
			]
		);
	}

	public function generators()
	{
		return Inertia::render(
			'Generators/admin/AdminGenerator',
			[
				'generators' => GeneratorResource::collection(Generator::all())
			]
		);
	}


	public function widgets()
	{
		return Inertia::render(
			'Admin/AdminWidget',
			[
				"widgets" => WidgetResource::collection(Widget::all())
			]
		);
	}

	public function users()
	{
		$users = User::with('teams')->get();
		return Inertia::render(
			'Admin/AdminUser',
			[
				"users" => UserResource::collection($users),
				"teams" => Team::active()->get()
			]
		);
	}

	public function createUsers(Request $request)
	{
		$validated = $request->validate([
			"users"    => ['required'],
			"users.*"  => ['email'],
			'password' => ['required', 'string', 'min:6']
		]);

		foreach ($validated['users'] as $email) {
			$username = explode("@", $email)[0];
			$firstname_name = explode(".", $username);
			if (count($firstname_name) == 1) {
				$firstname = null;
				$name = $firstname_name[0];
			} else {
				$firstname = $firstname_name[0];
				$name = $firstname_name[1];
			}

			User::create([
				'name'      => ucwords($name),
				'firstname' => ucwords($firstname ?? ""),
				'email'     => $email,
				'password'  => Hash::make($validated['password']),
			]);
		}

		return redirect(route('admin.users.index'));
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

	public function illustrations()
	{
		return Inertia::render(
			'Illustrations/admin/AdminIllustration',
			[
				'illustrations' => Illustration::all()
			]
		);
	}

	public function courses()
	{
		$courses = Course::with([
			'teams' => fn($q) => $q->active()
		])->orderBy('created_at', 'desc')->get();

		return Inertia::render(
			'Courses/admin/AdminCourse',
			[
				'courses' => CourseResource::collection($courses),
				'teams'   => TeamResource::collection(Team::active()->get())
			]
		);
	}

	public function agenda()
	{
		$courses = Course::with('teams')
		                 ->without('lessons')->get();

		return Inertia::render(
			'Courses/admin/AdminAgenda',
			[
				'courses' => CourseResource::collection($courses),
				'teams'   => TeamResource::collection(Team::active()->get())
			]
		);
	}
}
