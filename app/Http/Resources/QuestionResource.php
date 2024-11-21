<?php

namespace App\Http\Resources;

use App\Models\Question;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

/**
 * @mixin Question
 */
class QuestionResource extends JsonResource
{
	// No wrap around the data.
	public static $wrap = null;
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
		// Il n'y a pas de block pour cette question
		if(count($this->blocks)===0){
			$this->blocks()->create(['body'=>'Sans contenu']);
		}

		// On récupère les réponses de l'utilisateur.
		$userAnswers = $this->userAnswers();

		return [
			"id" => $this->id,
			"order"=>$this->order,
			"displayIf"=>$this->displayif,
			"css"=>$this->css,
			"block" => [
				'id'=>$this->blocks[0]->id,
				'title'=>$this->blocks[0]->title,
				'body'=>$this->blocks[0]->body,
				'illustration'=>$this->blocks[0]->illustrations[0]??null
			],
			"answer" => $this->answer,
			"keyboard" => $this->keyboard,
			"user" => $userAnswers
		];
//        return parent::toArray($request);
	}
}
