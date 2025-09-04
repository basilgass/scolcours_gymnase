<?php

namespace App\Models;

use App\Traits\HasLessonTrait;
use App\Traits\HasScoresTrait;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * App\Models\Deck
 *
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property int|null $chapter_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Card> $cards
 * @property-read int|null $cards_count
 * @property-read Chapter|null $chapter
 * @method static Builder<static>|Deck newModelQuery()
 * @method static Builder<static>|Deck newQuery()
 * @method static Builder<static>|Deck query()
 * @method static Builder<static>|Deck whereChapterId($value)
 * @method static Builder<static>|Deck whereCreatedAt($value)
 * @method static Builder<static>|Deck whereId($value)
 * @method static Builder<static>|Deck whereSlug($value)
 * @method static Builder<static>|Deck whereTitle($value)
 * @method static Builder<static>|Deck whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Deck extends Model
{
	use HasScoresTrait;
	use HasLessonTrait;

	protected $guarded = [];
	protected $with = [];

	public function chapter(): BelongsTo
	{
		return $this->belongsTo(Chapter::class);
	}

	public function cards()
	{
		return $this->hasMany(Card::class)->orderBy('order')->orderBy('id');
	}

	public function usedDecks()
	{
		return $this->belongsToMany(Deck::class, 'deck_deck', 'deck_id', 'used_deck_id');
	}

	public function getCards()
	{
		// 1. Récupère les cartes du deck actuel
		$ownCards = $this->cards;

		// 2. Récupère les cartes des decks associés (B et C)
		$usedDecksCards = $this->usedDecks->flatMap(fn($deck) => $deck->cards);

		// Fusionne les deux collections
		return $ownCards->merge($usedDecksCards);
	}
}
