<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * 
 *
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property string $cover
 * @property int $translation_language_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\TranslationLanguage|null $language
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TranslationUnit> $units
 * @property-read int|null $units_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationBook newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationBook newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationBook query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationBook whereCover($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationBook whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationBook whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationBook whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationBook whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationBook whereTranslationLanguageId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationBook whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class TranslationBook extends Model
{
    protected $fillable = [
        'slug',
        'title',
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
