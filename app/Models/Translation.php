<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * App\Models\Translation
 *
 * @property int $id
 * @property int $translation_unit_id
 * @property string $foreign
 * @property string $fr
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \App\Models\TranslationUnit|null $unit
 * @method static Builder<static>|Translation newModelQuery()
 * @method static Builder<static>|Translation newQuery()
 * @method static Builder<static>|Translation query()
 * @method static Builder<static>|Translation whereCreatedAt($value)
 * @method static Builder<static>|Translation whereForeign($value)
 * @method static Builder<static>|Translation whereFr($value)
 * @method static Builder<static>|Translation whereId($value)
 * @method static Builder<static>|Translation whereTranslationUnitId($value)
 * @method static Builder<static>|Translation whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Translation extends Model
{
	protected $guarded=[];

	public function unit(): BelongsTo
    {
		return $this->belongsTo(TranslationUnit::class);
	}
}
