<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * App\Models\TranslationUnit
 *
 * @property int $id
 * @property int|null $translation_book_id
 * @property string $language
 * @property string $title
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \App\Models\TranslationBook|null $book
 * @property-read Collection<int, \App\Models\Translation> $translations
 * @property-read int|null $translations_count
 * @method static Builder<static>|TranslationUnit newModelQuery()
 * @method static Builder<static>|TranslationUnit newQuery()
 * @method static Builder<static>|TranslationUnit query()
 * @method static Builder<static>|TranslationUnit whereCreatedAt($value)
 * @method static Builder<static>|TranslationUnit whereId($value)
 * @method static Builder<static>|TranslationUnit whereLanguage($value)
 * @method static Builder<static>|TranslationUnit whereTitle($value)
 * @method static Builder<static>|TranslationUnit whereTranslationBookId($value)
 * @method static Builder<static>|TranslationUnit whereUpdatedAt($value)
 * @mixin Eloquent
 */
class TranslationUnit extends Model
{
	protected $guarded=[];

	public function translations(): HasMany
    {
		return $this->hasMany(Translation::class);
	}

    public function book(): BelongsTo
    {
        return $this->belongsTo(TranslationBook::class);
    }
}
