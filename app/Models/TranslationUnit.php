<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\TranslationUnit
 *
 * @property int $id
 * @property string $language
 * @property string $unit
 * @property string $title
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|\App\Models\Translation[] $translations
 * @property-read int|null $translations_count
 * @method static Builder|TranslationUnit newModelQuery()
 * @method static Builder|TranslationUnit newQuery()
 * @method static Builder|TranslationUnit query()
 * @method static Builder|TranslationUnit whereCreatedAt($value)
 * @method static Builder|TranslationUnit whereId($value)
 * @method static Builder|TranslationUnit whereLanguage($value)
 * @method static Builder|TranslationUnit whereTitle($value)
 * @method static Builder|TranslationUnit whereUnit($value)
 * @method static Builder|TranslationUnit whereUpdatedAt($value)
 * @mixin Eloquent
 */
class TranslationUnit extends Model
{
    use HasFactory;

	protected $guarded=[];

	public function translations()
	{
		return $this->hasMany(Translation::class);
	}
}
