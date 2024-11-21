<?php

namespace App\Http\Resources;

use App\Models\Challenge;
use Auth;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

/**
 * @mixin Challenge
 */
class ChallengeResource extends JsonResource
{

	// No wrap around the data.
	public static $wrap = null;
	/**
	 * Transform the resource into an array.
	 *
	 * @param Request $request
	 * @return array|Arrayable|JsonSerializable
	 */
	public function toArray($request)
	{
        // TODO: Challenge resource must be reworked.
		if (count($this->blocks) === 0) {
			$this->blocks()->create();
		}

		$bestScore = $this->scores?->pluck('score')->max()??0;
		$bestLevel = $this->scores?->pluck('level')->max()??0;
		$userScore = 0;
		$userLevel = 0;

		if(Auth::user()){
			$userScore = $this->scores?->where('user_id', Auth::user()->id)->first()->score??0;
			$userLevel = $this->scores?->where('user_id', Auth::user()->id)->first()->level??0;
		}

        return [
			...parent::toArray($request),
			'block' => $this->blocks[0],
			'chapter' => ChapterResource::make($this->chapter),
			'best' => [
				'score' => $bestScore,
				'level' => $bestLevel
			],
			'user' => [
				'score' => $userScore,
				'level' => $userLevel
			],
			"generators" => GeneratorResource::collection($this->generators)
		];
	}
}
