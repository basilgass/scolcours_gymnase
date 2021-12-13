<?php
	
	namespace App\Http\Controllers;
	
	use App\Models\Challenge;
	use App\Models\Theme;
	use Illuminate\Support\Facades\Auth;
	use Illuminate\Support\Str;
	use Inertia\Inertia;
	
	class ChallengesController extends Controller
	{
		public function show(string $slug)
		{
			return Inertia::render('Challenges/show', [
				"theme"     => Theme::where("slug", "=", "algebre")->first(),
				"challenge" => $slug,
			]);
		}
		
		public function start(Challenge $challenge)
		{
			// Create new session with the user and redirect back.
			if (Auth::User()?->admin) {
				$challenge->sessions()->create(
					[
						"token"    => Str::random(4),
						"open"     => true,
						"user_id"  => Auth::User()->id,
						"duration" => 5000
					]
				);
				
			}
			$this->index();
		}
		
		public function index()
		{
			// TODO: get all challenges with the "opened" sessions only...
			$challenges = Challenge::with('sessions')->orderBy('title')->get();
			return Inertia::render('Challenges/index', [
				'challenges' => $challenges
			]);
		}
	}