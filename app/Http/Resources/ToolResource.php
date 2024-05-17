<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Tool */
class ToolResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'slug'       => $this->slug,
            'title'      => $this->title,
            'body'       => $this->body,
            'parameters' => $this->parameters,
            'updated_at' => $this->updated_at->format('Y-m-d H:i'),
        ];
    }
}
