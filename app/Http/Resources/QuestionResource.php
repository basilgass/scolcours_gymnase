<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

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
	 * @param Request $request
	 * @return array|Arrayable|JsonSerializable
	 */
	public function toArray($request)
	{
//		$userAnswers = $this->users->filter(function ($value, $key) {
//			return $value->id === Auth::user()?->id;
//		})->values()->map(function ($user) {
//			return [
//				'answer' => $user->pivot->answer,
//				'result' => $user->pivot->result,
//				'when' => Carbon::parse($user->pivot->created_at)->diffForHumans()
//			];
//		});

		if(count($this->blocks)===0){
			$this->blocks()->create(['body'=>'Sans contenu']);
			$this->blocks;
		}

		$userAnswers = $this->userAnswers();
		$isCorrect = false;
		foreach ($userAnswers as $answer){
			if($answer['result']){
				$isCorrect = true;
				break;
			}
		}


		return [
			"id" => $this->id,
			"order"=>$this->order,
			"css"=>$this->css,
			"body" => $this->body,
			"block" => [
				'id'=>$this->blocks[0]->id,
				'body'=>$this->blocks[0]->body,
				'illustration'=>$this->blocks[0]->illustrations[0]??null
			],
			"answer" => $this->answer,
			"checker" => $this->checker,
			"keyboard" => $this->keyboard,
			"parameters" => $this->parameters??'',
			"user" => [
				"answers" => $userAnswers,
				"correct" => $isCorrect
			]
//			"updated_at" => $this->updated_at,
//			"userAnswers" => $userAnswers,
//			"userHasCorrectAnswer" => count($userAnswers)>0 && $userAnswers[count($userAnswers)-1]['result']
		];
//        return parent::toArray($request);
	}
}
