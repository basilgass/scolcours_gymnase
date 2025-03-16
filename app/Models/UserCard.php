<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCard extends Model
{
    protected $fillable = [
        'user_deck_id',
        'card_id',
        'appearances',
        'success',
        'time_spent',
    ];

	protected $with=['cardable'];

    public function userDeck(): BelongsTo
    {
        return $this->belongsTo(UserDeck::class);
    }

	public function cardable()
	{
		return $this->morphTo();
	}

}
