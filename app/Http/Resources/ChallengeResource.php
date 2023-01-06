<?php

namespace App\Http\Resources;

use Auth;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class ChallengeResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @param Request $request
	 * @return array|Arrayable|JsonSerializable
	 */
	public function toArray($request)
	{
//        return parent::toArray($request);
		if (count($this->blocks) === 0) {
			$this->blocks()->create();
			$this->blocks;
		}

		$bestScore = $this->scores?->pluck('score')->max()??0;
		$userScore = 0;
		if(Auth::user()){
			$userScore = $this->scores?->where('user_id', Auth::user()->id)->first()->score??0;
		}
		//	dd($ch->scores()->where('user_id', Auth::user()->id)->first()->score);
		//	dd($ch->scores->pluck('score')->max());
		return [
			...parent::toArray($request),
			'block' => $this->blocks[0],
			'chapter' => ChapterMinResource::make($this->chapter),
			'score' => [
				'best' => $bestScore,
				'user' => $userScore
			]
		];
	}
}
