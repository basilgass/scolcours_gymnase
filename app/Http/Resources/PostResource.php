<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
		return [
			'id'=>$this->id,
			'chapter_id'=>$this->chapter_id,
			'type'=>$this->type,
			'title'=>$this->title,
			'order'=>$this->order,
			'numberOfVisibleBlocks'=>$this->numberOfVisibleBlocks,
			'active'=>$this->active,
			'script'=>$this->script,
			'switch'=>$this->switch,
			'updated_at'=>$this->updated_at,
			'blocks'=>$this->blocks,
			'questions'=>QuestionResource::collection($this->questions),
			'questionsGrid'=>$this->questionsGrid
		];
    }
}
