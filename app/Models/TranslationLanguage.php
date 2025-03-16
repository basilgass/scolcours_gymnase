<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * 
 *
 * @property int $id
 * @property string $slug
 * @property string $name
 * @property string $determinants
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TranslationBook> $books
 * @property-read int|null $books_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TranslationUnit> $units
 * @property-read int|null $units_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationLanguage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationLanguage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationLanguage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationLanguage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationLanguage whereDeterminants($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationLanguage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationLanguage whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationLanguage whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TranslationLanguage whereUpdatedAt($value)
 * @mixin \Eloquent
 */
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
