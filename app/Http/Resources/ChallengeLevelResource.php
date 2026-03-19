<?php

namespace App\Http\Resources;

use App\Models\ChallengeLevel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ChallengeLevel */
class ChallengeLevelResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'challenge_id'   => $this->challenge_id,
            'level_number'   => $this->level_number,
            'points_to_pass' => $this->points_to_pass,
            'bonus'          => $this->bonus,
            'generators'     => GeneratorResource::collection($this->generators),
        ];
    }
}
