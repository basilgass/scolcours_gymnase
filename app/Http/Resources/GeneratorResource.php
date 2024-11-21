<?php

namespace App\Http\Resources;

use App\Models\Generator;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Generator */
class GeneratorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $theme = Theme::getTheme($this->theme_id);

        return [
            'id'       => $this->id,
            'slug'     => $this->slug,
            'title'    => $this->title,
            'theme'    => $theme,
            'body'     => $this->body,
            'template' => $this->template,
            'keyboard' => $this->keyboard,
            'code'     => $this->code,
            'order'    => $this->pivot?->order,
        ];
    }
}
