<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Deck
 *
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Flipcard> $flipcards
 * @property-read int|null $flipcards_count
 * @method static \Illuminate\Database\Eloquent\Builder|Deck newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Deck newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Deck query()
 * @method static \Illuminate\Database\Eloquent\Builder|Deck whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deck whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deck whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deck whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deck whereUpdatedAt($value)
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
