<?php

	namespace App\Http\Controllers;

	use App\Http\Resources\ChallengeResource;
	use App\Models\Challenge;
	use App\Models\Chapter;
	use App\Models\Theme;
	use Illuminate\Support\Facades\Auth;
	use Illuminate\Support\Str;
	use Inertia\Inertia;

	class ChallengesController extends Controller
	{
		public function show(Theme $theme, Chapter $chapter, Challenge $challenge)
		{
			if(count($challenge->blocks)===0){$challenge->blocks()->create();}

			return Inertia::render('Challenges/ChallengesShow', [
				"theme" => $theme->only('color', 'icon', 'slug', 'title', 'id'),
				"challenge" => ChallengeResource::make($challenge),
			]);
		}

		public function quick(Challenge $challenge){
			// Get the theme
			$theme = Theme::where('slug', '=', $challenge->chapter->theme->slug)->first();

			if(!$theme->exists()) {
				return redirect()->back();
			}
			
			return redirect()->route('chapters.challenge', [$theme, $challenge->chapter, $challenge]);
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
			return Inertia::render('ChallengesIndex.vue', [
				'challenges' => $challenges
			]);
		}
	}
