<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
