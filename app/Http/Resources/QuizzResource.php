<?php

namespace App\Http\Resources;

use App\Models\Quizz;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Quizz */
class QuizzResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id'              => $this->id,
			'title'           => $this->title,
			'intro'           => $this->blocks[0],
			'outro'           => $this->blocks[1],
			'questions_count' => $this->questions->count(),
			'chapter'         => new ChapterResource($this->whenLoaded('chapter')),
			'sessions'        => $this->whenLoaded('sessions', fn() => QuizzSessionResource::collection($this->sessions)),
		];
	}
}
