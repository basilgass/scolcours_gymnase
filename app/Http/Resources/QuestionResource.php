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

		// Il n'y a pas de block pour cette question
		if(count($this->blocks)===0){
			$this->blocks()->create(['body'=>'Sans contenu']);
			$this->blocks;
		}

		// On récupère les réponses de l'utilisateur.
		$userAnswers = $this->userAnswers();

		return [
			"id" => $this->id,
			"order"=>$this->order,
			"css"=>$this->css,
			"body" => $this->body,
			"block" => [
				'id'=>$this->blocks[0]->id,
				'title'=>$this->blocks[0]->title,
				'body'=>$this->blocks[0]->body,
				'illustration'=>$this->blocks[0]->illustrations[0]??null
			],
			"answer" => $this->answer,
			"checker" => $this->checker,
			"keyboard" => $this->keyboard,
//			"parameters" => $this->parameters??'',
			"user" => $userAnswers
		];
//        return parent::toArray($request);
	}
}
