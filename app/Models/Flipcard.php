<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Flipcard
 *
 * @property int $id
 * @property int $deck_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read \App\Models\Deck $deck
 * @method static \Illuminate\Database\Eloquent\Builder|Flipcard newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Flipcard newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Flipcard query()
 * @method static \Illuminate\Database\Eloquent\Builder|Flipcard whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Flipcard whereDeckId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Flipcard whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Flipcard whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Flipcard extends Model
{
	use HasFactory;

	protected $with = ['blocks'];

	protected $fillable = ['order'];

	public function deck()
	{
		return $this->belongsTo(Deck::class);
	}

	public function blocks()
	{
		return $this->morphMany(Block::class, 'blockable')->orderBy('order')->orderBy('id');
	}

	public function users()
	{
		$this->belongsToMany(User::class)
			->withTimestamps()
			->withPivot('success');
	}
}
