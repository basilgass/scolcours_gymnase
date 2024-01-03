<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Flipcard
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read \App\Models\Deck|null $deck
 * @method static \Illuminate\Database\Eloquent\Builder|Flipcard newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Flipcard newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Flipcard query()
 * @mixin \Eloquent
 */
class Flipcard extends Model
{
    use HasFactory;

	protected $with=['blocks'];

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
