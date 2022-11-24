<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\TranslationUnit
 *
 * @property int $id
 * @property string $language
 * @property string $unit
 * @property string $title
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Translation[] $translations
 * @property-read int|null $translations_count
 * @method static \Illuminate\Database\Eloquent\Builder|TranslationUnit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TranslationUnit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TranslationUnit query()
 * @method static \Illuminate\Database\Eloquent\Builder|TranslationUnit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TranslationUnit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TranslationUnit whereLanguage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TranslationUnit whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TranslationUnit whereUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TranslationUnit whereUpdatedAt($value)
 * @mixin \Eloquent
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
