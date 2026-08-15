<?php

namespace App\Services\Seo;

readonly class MetaData
{
    public function __construct(
        public string $title,
        public string $description,
        public MetaSource $source,
    ) {}
}
