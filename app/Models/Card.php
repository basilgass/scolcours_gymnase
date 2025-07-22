<?php

namespace App\Models;

use App\Traits\HasScoresTrait;
use App\Traits\HasUrlTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * App\Models\Card
 *
 * @property int $id
 * @property int $deck_id
 * @property int $order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read \App\Models\Deck $deck
 * @method static Builder<static>|Card newModelQuery()
 * @method static Builder<static>|Card newQuery()
 * @method static Builder<static>|Card query()
 * @method static Builder<static>|Card whereCreatedAt($value)
 * @method static Builder<static>|Card whereDeckId($value)
 * @method static Builder<static>|Card whereId($value)
 * @method static Builder<static>|Card whereOrder($value)
 * @method static Builder<static>|Card whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Card extends Model
{
	use HasScoresTrait;
	use HasUrlTrait;

	protected $with = ['blocks'];

	protected $fillable = ['order', 'reference_block_id', 'reference_block_splitter'];
	protected $appends = ['url'];

	public function deck(): BelongsTo
	{
		return $this->belongsTo(Deck::class);
	}

	public function blocks(): MorphMany
	{
		return $this->morphMany(Block::class, 'blockable')->orderBy('order')->orderBy('id');
	}

	public function reference_block(): HasOne
	{
		return $this->hasOne(Block::class, 'id', 'reference_block_id');
	}

	public function hasBlocks(): bool
	{
		return $this->blocks && count($this->blocks) === 2;
	}

	public function hasReference(): bool
	{
		return !is_null($this->reference_block_id);
	}
}
