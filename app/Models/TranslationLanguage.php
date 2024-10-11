<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class TranslationLanguage extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'determinants',
    ];

    protected $with = ['books'];

    public function units(): HasManyThrough
    {
        return $this->hasManyThrough(TranslationUnit::class, TranslationBook::class);
    }

    public function books(): HasMany
    {
        return $this->hasMany(TranslationBook::class);
    }

}
