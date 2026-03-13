<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Generator;
use App\Models\Team;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use function redirect;

class ChallengeApiController extends Controller
{
	public function index()
	{
		$challenges = Challenge::orderBy('title')
		                       ->get();
		return ChallengeResource::collection($challenges);
	}

	public function show(Challenge $challenge)
	{
		if (count($challenge->blocks) === 0) {
			$challenge->blocks()->create();
		}

		return ChallengeResource::make($challenge);
	}

	public function store(Chapter $chapter, Request $request)
	{
		$validated = $request->validate([
			'title' => ['string', 'min:5']
		]);

		$slug = Str::slug($request['title']);
		if (Challenge::where('slug', $slug)->first()) {
			return redirect()->back();
		}

		$challenge = $chapter->challenges()->create([
			'title' => $validated['title'],
			'slug'  => $slug
		]);

		$challenge->blocks()->create();

		return redirect()->route('challenges.quick', [$challenge->slug]);
	}


	public function update(Challenge $challenge, Request $request)
	{
		unset($request['block']);

		// Save the challenge configuration
		$validated = $request->validate([
			'slug'               => ['required', 'min:2'],
			'title'              => ['required', 'min:2'],
			'active'             => ['boolean'],
			'nextLevelAfter'     => ['numeric', 'min:0'],
			'duration'           => ['numeric', 'min:0'],
			'lives'              => ['numeric', 'min:0'],
			'generatorsGrouping' => ['numeric', 'nullable'],
			'bonusScoreTrigger'  => ['numeric', 'min:0', 'nullable'],
			'bonusScoreLife'     => ['numeric', 'min:0'],
			'bonusScoreTime'     => ['numeric', 'min:0'],
			'bonusLevelLife'     => ['numeric', 'min:0'],
			'bonusLevelTime'     => ['numeric', 'min:0'],
		]);

		$challenge->update($validated);

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


	// REFACTOR: move all generator to it's controller
	public function indexGenerator(Challenge $challenge)
	{
		return Generator::where('theme_id', $challenge->chapter->theme->id)
		                ->whereNotIn('id', $challenge->generators->pluck('id'))
		                ->get();
	}

	public function storeGenerator(Request $request, Challenge $challenge)
	{
		// REFACTOR: Must be moved to GeneratorApiController and the corresponding route removed.
		// Get the order
		$order = count($challenge->generators) + 1;

		// Create the generator
		$generator = Generator::create([
			'theme_id' => $challenge->chapter->theme->id,
			'slug'     => $challenge->chapter->slug . '-' . $challenge->slug . '-' . $order,
			'title'    => '',
			'template' => '\\[question = answer\\]',
			'code'     => 'return {question: "", answer: ""}',
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
		$validated = $request->validate([
			'order'         => ['array'],
			'order.*.id'    => ['exists:App\Models\Generator'],
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


	public function teams(Theme $theme, Chapter $chapter, Challenge $challenge, Team $team)
	{
		return redirect()->route('admin.teams.challenges.show', ["team" => $team, "challenge" => $challenge]);
	}
}
