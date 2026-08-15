<?php

namespace App\Models\Concerns;

use App\Models\Meta;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasMeta
{
    public function meta(): MorphOne
    {
        return $this->morphOne(Meta::class, 'metable');
    }
}
