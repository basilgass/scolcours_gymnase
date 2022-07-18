<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
		return [
			'id'=>$this->id,
			'chapter_id'=>$this->chapter_id,
			'type'=>$this->type,
			'title'=>$this->title,
			'position'=>$this->position,
			'numberOfVisibleBlocks'=>$this->numberOfVisibleBlocks,
			'active'=>$this->active,
			'script'=>$this->script,
			'switch'=>$this->switch,
			'updated_at'=>$this->updated_at,
			'blocks'=>$this->blocks,
			'questions'=>QuestionResource::collection($this->questions)
		];
    }
}
