<?php

namespace App\Http\Resources;

use Auth;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class QuestionResource extends JsonResource
{
	/**
	 * Indicates if the resource's collection keys should be preserved.
	 *
	 * @var bool
	 */
	public $preserveKeys = true;

	/**
	 * Transform the resource into an array.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
	 */
	public function toArray($request)
	{
		$userAnswers = $this->users->filter(function ($value, $key) {
			return $value->id === Auth::user()?->id;
		})->values()->map(function ($user) {
			return [
				'answer' => $user->pivot->answer,
				'result' => $user->pivot->result,
				'when' => Carbon::parse($user->pivot->created_at)->diffForHumans()
			];
		});

		if(count($this->blocks)===0){
			$this->blocks()->create(['body'=>'Sans contenu']);
		}

		return [
			"id" => $this->id,
			"body" => $this->body,
			"block" => $this->blocks[0],
			"answer" => $this->answer,
			"checker" => $this->checker,
			"keyboard" => $this->keyboard??'algebra',
			"parameters" => $this->parameters??'',
			"updated_at" => $this->updated_at,
			"userAnswers" => $userAnswers,
			"userHasCorrectAnswer" => count($userAnswers)>0 && $userAnswers[count($userAnswers)-1]['result']
		];
//        return parent::toArray($request);
	}
}
