<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChallengeResource;
use App\Http\Resources\ThemeResource;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Generator;
use App\Models\Team;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use function redirect;

class ChallengeController extends Controller
{
	public function show(Theme $theme, Chapter $chapter, Challenge $challenge)
	{
		if (count($challenge->blocks) === 0) {
			$challenge->blocks()->create();
		}

		return Inertia::render('Challenges/ChallengeShow', [
			"theme" => ThemeResource::make($theme),
			"challenge" => ChallengeResource::make($challenge),
			"teams" => Team::all()
		]);
	}

	public function store(Chapter $chapter, Request $request)
	{
		$validation = $request->validate([
			'title' => ['string', 'min:5']
		]);

		$slug = Str::slug($request['title']);
		if (Challenge::where('slug', $slug)->first()) {
			return redirect()->back();
		}

		$challenge = $chapter->challenges()->create([
			'title' => $validation['title'],
			'slug' => $slug
		]);

		$challenge->blocks()->create();

		return redirect()->route('challenges.show', [$challenge->slug]);
	}

	public function edit(Challenge $challenge)
	{
		return Inertia::render("Challenges/ChallengeEditPage", [
			'challenge' => ChallengeResource::make($challenge)
		]);
	}

	public function update(Challenge $challenge, Request $request)
	{
		unset($request['block']);

		// Save the challenge configuration
		$validation = $request->validate([
			'slug' => ['required', 'min:2'],
			'title' => ['required', 'min:2'],
			'active' => ['boolean'],
//			'generator' => ['string', 'min:2'],
//			'output' => ['string', 'min:2'],
			'nextLevelAfter' => ['numeric', 'min:0'],
//			'parameters' => ['nullable', 'string'],
//			'keyboard' => ['nullable', 'string'],
			'duration' => ['numeric', 'min:0'],
			'lives' => ['numeric', 'min:0'],
			'bonusScoreTrigger' => ['numeric', 'min:0', 'nullable'],
			'bonusScoreLife' => ['numeric', 'min:0'],
			'bonusScoreTime' => ['numeric', 'min:0'],
			'bonusLevelLife' => ['numeric', 'min:0'],
			'bonusLevelTime' => ['numeric', 'min:0'],
		]);
//
//		if ($validation['parameters'] === null) {
//			$validation['parameters'] = 'exact';
//		}
		$challenge->update($validation);

		// Update the generators
		$validation = $request->validate([
			'generators' => ['array'],
			'generators.*.id' => ['exists:App\Models\Generator,id'],
			'generators.*.title' => ['string', 'nullable'],
			'generators.*.slug' => ['string',],
			'generators.*.body' => ['string', 'nullable'],
			'generators.*.template' => ['string', 'nullable'],
			'generators.*.keyboard' => ['string'],
			'generators.*.code' => ['string'],
		]);

		foreach ($validation['generators'] as $generator) {
			Generator::find($generator['id'])?->update([
				"title" => $generator['title']??'',
				"slug" => $generator['slug']??'',
				"body" => $generator['body']??'',
				"template" => $generator['template']??'',
				"keyboard" => $generator['keyboard']??'',
				"code" => $generator['code']
			]);
		}

		return true;
	}


	public function indexGenerator(Challenge $challenge)
	{
		return Generator::where('theme_id', $challenge->chapter->theme->id)
			->whereNotIn('id', $challenge->generators->pluck('id'))
			->get();
	}

	public function storeGenerator(Request $request, Challenge $challenge)
	{
		// Get the order
		$order = count($challenge->generators) + 1;

		// Create the generator
		$generator = Generator::create([
			'theme_id' => $challenge->chapter->theme->id,
			'slug' => $challenge->chapter->slug . '-' . $challenge->slug .'-' . $order,
			'title' => '',
			'code' => 'return {question: "", answer: ""}',
		]);

		return $this->attachGenerator($challenge, $generator);
	}

	public function attachGenerator(Challenge $challenge, Generator $generator)
	{
		$order = count($challenge->generators) + 1;

		// Attach the generator with the order
		$challenge->generators()->attach(
			$generator,
			['order' => $order]
		);

		// Refresh the challenge
		$challenge->refresh();

		// Return all the generators
		return $challenge->generators;
	}

	public function detachGenerator(Challenge $challenge, Generator $generator, Request $request)
	{
		$challenge->generators()->detach($generator);

		if ($request['destroy']) {
			$generator->delete();
		}
	}

	public function updateGeneratorsOrder(Request $request, Challenge $challenge)
	{
		$validation = $request->validate([
			'order' => ['array'],
			'order.*.id' => ['exists:App\Models\Generator'],
			'order.*.order' => ['int', 'min:1']
		]);

		// Update the order
		foreach ($request['order'] as $value) {
			$challenge->generators()->updateExistingPivot($value['id'], [
				"order" => $value['order']
			]);
		}

		return true;
	}

	public function destroy($id)
	{
		$challenge = Challenge::find($id);
		$theme = $challenge->chapter->theme->slug;
		$chapter = $challenge->chapter->slug;

		Challenge::destroy($id);

		// Redirect to ...
//		return redirect(route('theme.chapter', [$theme, $chapter]));
		return true;
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

	public function index()
	{
		// TODO: get all challenges with the "opened" sessions only...
		$challenges = Challenge::with('sessions')->orderBy('title')->get();
		return Inertia::render('ChallengesIndex', [
			'challenges' => $challenges
		]);
	}

	public function teams(Theme $theme, Chapter $chapter, Challenge $challenge, Team $team)
	{
		return redirect()->route('teams.challenge', [$team, $challenge]);
	}
}
