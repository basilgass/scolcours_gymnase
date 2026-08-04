<?php

namespace App\Models;

use App\Traits\HasUrlTrait;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;

/**
 * App\Models\Formula
 *
 * @property int $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read Collection<int, \App\Models\Chapter> $chapters
 * @property-read int|null $chapters_count
 * @method static Builder<static>|Formula newModelQuery()
 * @method static Builder<static>|Formula newQuery()
 * @method static Builder<static>|Formula query()
 * @method static Builder<static>|Formula whereCreatedAt($value)
 * @method static Builder<static>|Formula whereId($value)
 * @method static Builder<static>|Formula whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Formula extends Model
{
	use HasFactory;
	use HasUrlTrait;

	protected $fillable = [];

	protected $with = ['blocks'];
	protected $appends = ['url'];

	public function chapters(): BelongsToMany
	{
		return $this->belongsToMany(Chapter::class)
		            ->withPivot('order')
		            ->withTimestamps();
	}

	public function blocks(): MorphMany
	{
		return $this->morphMany(Block::class, 'blockable');
	}

}
