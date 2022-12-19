<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\Translation
 *
 * @property int $id
 * @property int $translation_unit_id
 * @property string $foreign
 * @property string $fr
 * @property string|null $definition
 * @property string|null $examples
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \App\Models\TranslationUnit|null $unit
 * @method static Builder|Translation newModelQuery()
 * @method static Builder|Translation newQuery()
 * @method static Builder|Translation query()
 * @method static Builder|Translation whereCreatedAt($value)
 * @method static Builder|Translation whereDefinition($value)
 * @method static Builder|Translation whereExamples($value)
 * @method static Builder|Translation whereForeign($value)
 * @method static Builder|Translation whereFr($value)
 * @method static Builder|Translation whereId($value)
 * @method static Builder|Translation whereTranslationUnitId($value)
 * @method static Builder|Translation whereUpdatedAt($value)
 * @mixin Eloquent
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
