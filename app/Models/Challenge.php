<?php

namespace App\Models;

use App\Models\Challenges\ChallengeSession;
use App\Traits\HasLessonTrait;
use App\Traits\HasScoresTrait;
use App\Traits\HasUrlTrait;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
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
 * @property int $maxLevel
 * @property int $nextLevelAfter
 * @property int $duration
 * @property int $lives
 * @property int|null $bonusScoreTrigger
 * @property int $bonusScoreLife
 * @property int $bonusScoreTime
 * @property int $bonusLevelLife
 * @property int $bonusLevelTime
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read \App\Models\Chapter|null $chapter
 * @property-read Collection<int, \App\Models\Generator> $generators
 * @property-read int|null $generators_count
 * @property-read mixed $running
 * @property-read Collection<int, \App\Models\Score> $scores
 * @property-read int|null $scores_count
 * @property-read Collection<int, ChallengeSession> $sessions
 * @property-read int|null $sessions_count
 * @property-read mixed $url
 * @method static Builder<static>|Challenge newModelQuery()
 * @method static Builder<static>|Challenge newQuery()
 * @method static Builder<static>|Challenge query()
 * @method static Builder<static>|Challenge whereActive($value)
 * @method static Builder<static>|Challenge whereBonusLevelLife($value)
 * @method static Builder<static>|Challenge whereBonusLevelTime($value)
 * @method static Builder<static>|Challenge whereBonusScoreLife($value)
 * @method static Builder<static>|Challenge whereBonusScoreTime($value)
 * @method static Builder<static>|Challenge whereBonusScoreTrigger($value)
 * @method static Builder<static>|Challenge whereChapterId($value)
 * @method static Builder<static>|Challenge whereCreatedAt($value)
 * @method static Builder<static>|Challenge whereDuration($value)
 * @method static Builder<static>|Challenge whereId($value)
 * @method static Builder<static>|Challenge whereLives($value)
 * @method static Builder<static>|Challenge whereMaxLevel($value)
 * @method static Builder<static>|Challenge whereNextLevelAfter($value)
 * @method static Builder<static>|Challenge whereSlug($value)
 * @method static Builder<static>|Challenge whereTitle($value)
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
	protected $with = ['blocks'];
	protected $appends = ['url'];


	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function theme()
	{
		return $this->belongsToThrough(Theme::class, Chapter::class);
	}

	public function sessions()
	{
		return $this->hasMany(ChallengeSession::class);
	}

	public function blocks()
	{
		return $this->morphMany(Block::class, 'blockable');
	}

	public function generators()
	{
		return $this
			->morphToMany(Generator::class, 'generatorable')
			->withPivot('order')
			->orderByPivot('order');
	}

	public function getRunningAttribute()
	{
		return $this->sessions->where('open', 'is', true);
	}
}
