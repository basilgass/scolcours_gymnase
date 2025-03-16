<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\ChapterUser
 *
 * @property-read \App\Models\Chapter|null $chapter
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChapterUser query()
 * @mixin \Eloquent
 */
class ChapterUser extends Model
{
    use HasFactory;

	protected $guarded = [];

	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
