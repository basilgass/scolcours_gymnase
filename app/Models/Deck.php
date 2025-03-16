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
 * @property int|null $chapter_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Card> $cards
 * @property-read int|null $cards_count
 * @property-read \App\Models\Chapter|null $chapter
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Deck newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Deck newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Deck query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Deck whereChapterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Deck whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Deck whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Deck whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Deck whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Deck whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Deck extends Model
{
	use HasFactory;

	protected $guarded = [];

	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function cards()
	{
		return $this->hasMany(Card::class)->orderBy('order')->orderBy('id');
	}
}
