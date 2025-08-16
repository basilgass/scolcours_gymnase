<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class UserResource extends JsonResource
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
		return [
			"id"        => $this->id,
			"name"      => $this->name,
			"firstname" => $this->firstname,
			"fullname"  => $this->firstname . " " . $this->name,
			"email"     => $this->email,
			"teams"     => $this->whenLoaded('teams'),
		];
	}
}
