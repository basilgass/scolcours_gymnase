<?php

namespace Database\Factories;

use App\Models\LatexPdf;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LatexPdfFactory extends Factory
{
    protected $model = LatexPdf::class;

    public function definition(): array
    {
        $slug = Str::random(4);

        return [
            'slug' => $slug,
            'name' => $slug . '.pdf',
            'url'  => 'pdf/divers/' . $slug . '/' . $slug . '.pdf',
        ];
    }
}
