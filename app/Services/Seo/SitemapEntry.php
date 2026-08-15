<?php

namespace App\Services\Seo;

use Illuminate\Database\Eloquent\Model;

final class SitemapEntry
{
    public function __construct(
        public string $url,
        public string $key,
        public ?Model $model = null,
    ) {}
}
