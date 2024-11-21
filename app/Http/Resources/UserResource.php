<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;
use JsonSerializable;

class UserResource extends JsonResource
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
        $teams = Cache::remember("user_{$this->id}_teams", 60*60, function(){
            return $this->teams->only(["id", "name"]);
        });

		return [
			"id"=>$this->id,
			"name"=>$this->name,
			"firstname"=>$this->firstname,
			"fullname" => $this->firstname . " " . $this->name,
			"email"=>$this->email,
			"teams"=>$teams,
		];
    }
}
