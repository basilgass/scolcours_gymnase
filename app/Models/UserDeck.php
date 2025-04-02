<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UserCard> $cards
 * @property-read int|null $cards_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDeck newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDeck newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDeck query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDeck whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDeck whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDeck whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDeck whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDeck whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDeck whereUserId($value)
 * @mixin \Eloquent
 */
class UserDeck extends Model
{
	protected $fillable = [
		'user_id',
		'title',
		'description',
	];

	protected $with = ['cards'];

	public function user(): BelongsTo|User
	{
		return $this->belongsTo(User::class);
	}

	public function cards(): HasMany|UserCard
	{
		return $this->hasMany(UserCard::class);
	}
}
