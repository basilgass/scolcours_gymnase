<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Deck
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Flipcard> $flipcards
 * @property-read int|null $flipcards_count
 * @method static \Illuminate\Database\Eloquent\Builder|Deck newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Deck newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Deck query()
 * @mixin \Eloquent
 */
class Deck extends Model
{
    use HasFactory;

	protected $guarded = [];

	public function flipcards()
	{
		return $this->hasMany(Flipcard::class);
	}
}
