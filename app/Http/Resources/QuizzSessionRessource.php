<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizzSessionRessource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		return [
			'shortcode' => $this->shortcode,
			'quizz' => [
				'id' => $this->quizz->id,
				'title' => $this->quizz->title,
				'body' => $this->quizz->body,
				'outro' => $this->quizz->outro,
			],
			'enable' => $this->enable,
			'current' => $this->index,
			'status' =>$this->status,
			'total' =>$this->total,
			'questions' => QuestionResource::collection($this->quizz->questions),
			"users" => UserResource::collection($this->users)
		];
//        return parent::toArray($request);
	}
}
