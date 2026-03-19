<?php

namespace App\Models;

use App\Traits\HasLessonTrait;
use App\Traits\HasScoresTrait;
use App\Traits\HasUrlTrait;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Znck\Eloquent\Traits\BelongsToThrough;

/**
 * App\Models\Challenge
 *
 * @property int $id
 * @property int|null $chapter_id
 * @property string $slug
 * @property string $title
 * @property int $active
 * @property string $type
 * @property int $lives
 * @property int $time_limit
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read \App\Models\Chapter|null $chapter
 * @property-read Collection<int, \App\Models\ChallengeLevel> $levels
 * @property-read int|null $levels_count
 * @property-read mixed $running
 * @property-read Collection<int, \App\Models\Score> $scores
 * @property-read int|null $scores_count
 * @property-read mixed $url
 * @method static Builder<static>|Challenge newModelQuery()
 * @method static Builder<static>|Challenge newQuery()
 * @method static Builder<static>|Challenge query()
 * @method static Builder<static>|Challenge whereActive($value)
 * @method static Builder<static>|Challenge whereChapterId($value)
 * @method static Builder<static>|Challenge whereCreatedAt($value)
 * @method static Builder<static>|Challenge whereId($value)
 * @method static Builder<static>|Challenge whereLives($value)
 * @method static Builder<static>|Challenge whereSlug($value)
 * @method static Builder<static>|Challenge whereTimeLimit($value)
 * @method static Builder<static>|Challenge whereTitle($value)
 * @method static Builder<static>|Challenge whereType($value)
 * @method static Builder<static>|Challenge whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Challenge extends Model
{
	use HasScoresTrait;
	use HasUrlTrait;
	use BelongsToThrough;
	use HasLessonTrait;

	protected $guarded = [];
	protected $with = ['blocks', 'levels.generators'];
	protected $appends = ['url'];

	protected static function booted()
	{
		static::created(function (Challenge $challenge) {
			$challenge->blocks()->create();
		});

		parent::booted();
	}

	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function theme()
	{
		return $this->belongsToThrough(Theme::class, Chapter::class);
	}

	public function blocks()
	{
		return $this->morphMany(Block::class, 'blockable');
	}

	public function levels(): HasMany
	{
		return $this->hasMany(ChallengeLevel::class)->orderBy('level_number');
	}

}
