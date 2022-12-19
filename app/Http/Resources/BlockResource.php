<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class BlockResource extends JsonResource
{
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
			// parms
			'order' => $this->order,
			'blur'=>$this->blur??false,
			'switch'=>$this->switch,
			// content
			'type' => $this->type,
			'title' => $this->title,
			'body' => $this->body,
			'illustrations' => $this->illustrations,
			// script and data
			'script' => $this->script,
			'json' => $this->json,

		];
    }
}
