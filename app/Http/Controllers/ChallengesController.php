<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChallengeResource;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ChallengesController extends Controller
{
	public function show(Theme $theme, Chapter $chapter, Challenge $challenge)
	{
		if (count($challenge->blocks) === 0) {
			$challenge->blocks()->create();
		}

		return Inertia::render('Challenges/ChallengesShow', [
			"theme" => $theme->only('color', 'icon', 'slug', 'title', 'id'),
			"challenge" => ChallengeResource::make($challenge),
		]);
	}

	public function index()
	{
		// TODO: get all challenges with the "opened" sessions only...
		$challenges = Challenge::with('sessions')->orderBy('title')->get();
		return Inertia::render('ChallengesIndex.vue', [
			'challenges' => $challenges
		]);
	}

	public function store(Chapter $chapter, Request $request)
	{
		$validation = $request->validate([
			'title'=>['string','min:5']
		]);

		$slug = Str::slug($request['title']);
		if(Challenge::where('slug', $slug)->first()){
			return redirect()->back();
		}

		$challenge = $chapter->challenges()->create([
			'title'=>$validation['title'],
			'slug'=>$slug
		]);

		$challenge->blocks()->create();

		return \redirect()->route('challenges.quick', [$challenge->slug]);
	}

	public function update(Request $request, Challenge $challenge)
	{
		unset($request['block']);

		$validation = $request->validate([
			'slug' => ['required', 'min:2'],
			'title' => ['required', 'min:2'],
			'active' => ['boolean'],
			'generator' => ['string', 'min:2'],
			'output' => ['string', 'min:2'],
			'nextLevelAfter' => ['numeric', 'min:0'],
			'checker' => ['nullable', 'string'],
			'keyboard' => ['nullable', 'string'],
			'duration' => ['numeric', 'min:0'],
			'lives' => ['numeric', 'min:0'],
			'bonusScoreLife' => ['numeric', 'min:0'],
			'bonusScoreTime' => ['numeric', 'min:0'],
			'bonusLevelLife' => ['numeric', 'min:0'],
			'bonusLevelTime' => ['numeric', 'min:0'],
		]);

		if($validation['checker']===null){$validation['checker']='string';}
		if($validation['keyboard']===null){$validation['keyboard']='simple';}
		$challenge->update($validation);

		return $validation;
	}

	public function destroy($id)
	{
		Challenge::destroy($id);
		return Redirect::back();
	}


	public function quick(Challenge $challenge)
	{
		// Get the theme
		$theme = Theme::where('slug', '=', $challenge->chapter->theme->slug)->first();

		if (!$theme->exists()) {
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
					"token" => Str::random(4),
					"open" => true,
					"user_id" => Auth::User()->id,
					"duration" => 5000
				]
			);

		}
		$this->index();
	}


}
