<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    //
	public function store(Request $request)
	{
		$validate = $request->validate([
			'user_id'=>["exists:App\Models\User,id"],
			'challenge_id'=>["exists:App\Models\Challenge,id"],
			'score'=>['int'],
			'stars'=>['int', 'nullable']
		]);

		// Get the current score
		$currentScore = Score::where([
			'user_id'=>$validate['user_id'],
			'challenge_id'=>$validate['challenge_id'],
		])->first()?->score ?? 0;

		Score::updateOrCreate(
			[
				'user_id'=>$validate['user_id'],
				'challenge_id'=>$validate['challenge_id'],
			],
			[
				'score'=>max($validate['score'], $currentScore),
				'stars'=>$validate['stars']??null,
			]
		);
	}
}
