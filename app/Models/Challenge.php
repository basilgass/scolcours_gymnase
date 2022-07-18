<?php

namespace App\Models;

use App\Models\Challenges\ChallengeSession;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\Challenge
 *
 * @property int $id
 * @property int|null $chapter_id
 * @property string $slug
 * @property string $title
 * @property int $active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \App\Models\Chapter|null $chapter
 * @property-read mixed $running
 * @property-read Collection|ChallengeSession[] $sessions
 * @property-read int|null $sessions_count
 * @method static Builder|Challenge newModelQuery()
 * @method static Builder|Challenge newQuery()
 * @method static Builder|Challenge query()
 * @method static Builder|Challenge whereActive($value)
 * @method static Builder|Challenge whereChapterId($value)
 * @method static Builder|Challenge whereCreatedAt($value)
 * @method static Builder|Challenge whereId($value)
 * @method static Builder|Challenge whereSlug($value)
 * @method static Builder|Challenge whereTitle($value)
 * @method static Builder|Challenge whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Challenge extends Model
{
	protected $guarded = [];
	protected $with = ['blocks'];

	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function sessions()
	{
		return $this->hasMany(ChallengeSession::class);
	}

	public function blocks()
	{
		return $this->morphMany(Block::class, 'blockable');
	}

	public function getRunningAttribute()
	{
		return $this->sessions->where('open', 'is', true);
	}

	protected function url(): Attribute
	{
		return Attribute::make(
			get: fn() => "Chapters/{$this->chapter->theme->slug}/{$this->chapter->slug}/challenges/{$this->slug}"
		);
	}
}
