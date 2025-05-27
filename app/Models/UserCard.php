<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 
 *
 * @property int $id
 * @property int $user_deck_id
 * @property string $cardable_type
 * @property int $cardable_id
 * @property float|null $current_score
 * @property int $current_appearances
 * @property int $current_time_spent
 * @property int $appearances
 * @property int $success
 * @property float $time_spent
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Model|\Eloquent $cardable
 * @property-read \App\Models\UserDeck $userDeck
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard whereAppearances($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard whereCardableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard whereCardableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard whereCurrentAppearances($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard whereCurrentScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard whereCurrentTimeSpent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard whereSuccess($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard whereTimeSpent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserCard whereUserDeckId($value)
 * @mixin \Eloquent
 */
class UserCard extends Model
{
	protected $with=['cardable'];

	protected $fillable = [
		'user_deck_id',
		'cardable_type',
		'cardable_id',
		'current_score',
		'current_appearances',
		'current_time_spent',
		'appearances',
		'success',
		'time_spent',
	];

    public function userDeck(): BelongsTo
    {
        return $this->belongsTo(UserDeck::class);
    }

	public function cardable()
	{
		return $this->morphTo();
	}

}
