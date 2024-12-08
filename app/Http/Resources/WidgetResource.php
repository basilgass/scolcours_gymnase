<?php

namespace App\Http\Resources;

use App\Models\Theme;
use App\Models\Widget;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Widget */
class WidgetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
		$theme = isset($this->theme_id) ? Theme::getTheme($this->theme_id) : null;

        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'component'   => $this->component,
            'description' => $this->description,
            'theme'       => $theme,
            'control'     => $this->control,
        ];
    }
}
