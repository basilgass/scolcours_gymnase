<?php

namespace App\Http\Resources;

use App\Models\UserCard;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin UserCard
 */
class UserCardResource extends JsonResource
{
	// No wrap around the data.
	public static $wrap = null;

	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		return [
			"id"      => $this->id,
			"user_id" => $this->user_id,
			"blocks"    => $this->cardable->blocks,

			"current_status"      => $this->current_status,
			"current_appereances" => $this->current_appearances,
			"current_time_spent"  => $this->current_time_spent,

			"appearances" => $this->appearances,
			"success"     => $this->success,
			"time_spent"  => $this->time_spent,

			"created_at" => $this->created_at,
			"updated_at" => $this->updated_at,
		];
	}
}
