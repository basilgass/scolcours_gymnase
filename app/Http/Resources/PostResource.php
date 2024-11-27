<?php

namespace App\Http\Resources;

use App\Models\Post;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

/**
 * @mixin Post
 */
class PostResource extends JsonResource
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

//        $answeredQuestions = $this->questions->sum(function($question){
//            return $question->userAnswers()['result'];
//        });

		return [
            'id' => $this->id,
            'chapter_id' => $this->chapter_id,
            'type' => $this->type,
            'title' => $this->title,
            'order' => $this->order,
            'active' => $this->active,
            'updated_at' => $this->updated_at,
            'questionsInfo' => [
                'count' => $this->questions_count,
                'answered' => $this->answered_questions_count??0
            ],
		];
	}
}
