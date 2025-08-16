<?php

namespace App\Http\Resources;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/** @mixin Team */
class UserTeamResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			"id"       => $this->id,
			"name"     => $this->name,
			"calendar" => $this->calendars
				->makeHidden(["updated_at", "created_at"])
				->map(function ($cal) {
					$cal->time = Carbon::createFromFormat('H:i:s', $cal->time)->format('H:i');
					return $cal;
				})
		];
	}
}
