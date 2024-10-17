<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TranslationBook extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'cover'
    ];

    public function language(): BelongsTo
    {
        return $this->belongsTo(TranslationLanguage::class);
    }

    public function units(): HasMany
    {
        return $this->hasMany(TranslationUnit::class);
    }
}
