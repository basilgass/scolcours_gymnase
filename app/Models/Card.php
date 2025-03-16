<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Card
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read \App\Models\Deck|null $deck
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card query()
 * @mixin \Eloquent
 */
class Card extends Model
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
		// TODO : modify users to usercards
		$this->belongsToMany(UserCard::class)
			->withTimestamps();
//			->withPivot('success');
	}
}
