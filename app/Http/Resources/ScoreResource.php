<?php

namespace App\Http\Resources;

use App\Models\Score;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/** @mixin Score */
class ScoreResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id'             => $this->id,
			'user_id'        => $this->user_id,
			'score'          => $this->score,
			'is_resolved'    => $this->is_resolved,
			'attempts'       => $this->attempts,
			'data'           => $this->data,
			'updated_at'     => Carbon::parse($this->updated_at)->diffForHumans()
		];
	}
}
