<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class BlockResource extends JsonResource
{

	// No wrap around the data.
	public static $wrap = null;
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
//        return parent::toArray($request);

		return [
			// id
			'id' => $this->id,
			// params
			'order' => $this->order,
			'active' => $this->active,
			'merge' => $this->merge,
			'switch'=>$this->switch,
			// content
			'type' => $this->type,
			'title' => $this->title,
			'body' => $this->body,
			'template' => $this->template,
			'illustrationsGrid' => $this->illustrationsGrid,
			'illustrations' => IllustrationResource::collection($this->illustrations),
			// script and data
			'script' => $this->script,
			'json' => $this->json,

		];
    }
}
