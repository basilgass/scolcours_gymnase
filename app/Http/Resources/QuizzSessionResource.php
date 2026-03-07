<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizzSessionResource extends JsonResource
{
	// No wrap around the data.
	public static $wrap = null;

	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		return [
			'id'        => $this->id,
			'shortcode' => $this->shortcode,
			'quizz'     => [
				'id'    => $this->quizz->id,
				'title' => $this->quizz->title,
			],
			'enable'    => $this->enable,
			'current'   => $this->index,
			'status'    => $this->status,
			'showAnswer' => $this->show_answer,
			'projection' => $this->projection_template,
			'total'     => count($this->quizz->questions),
			'questions' => QuestionResource::collection($this->quizz->questions),
			"users"     => UserResource::collection($this->users)
		];
		//        return parent::toArray($request);
	}
}
