<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Translation
 *
 * @property int $id
 * @property int $translation_unit_id
 * @property string $foreign
 * @property string $fr
 * @property string|null $definition
 * @property string|null $examples
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\TranslationUnit|null $unit
 * @method static \Illuminate\Database\Eloquent\Builder|Translation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Translation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Translation query()
 * @method static \Illuminate\Database\Eloquent\Builder|Translation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Translation whereDefinition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Translation whereExamples($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Translation whereForeign($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Translation whereFr($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Translation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Translation whereTranslationUnitId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Translation whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Translation extends Model
{
    use HasFactory;

	protected $guarded=[];

	public function unit()
	{
		return $this->belongsTo(TranslationUnit::class);
	}
}
