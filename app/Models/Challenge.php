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
 * @property string $generator
 * @property int $isMathOnly
 * @property string $output
 * @property int $maxLevel
 * @property int $nextLevelAfter
 * @property string|null $keyboard
 * @property string|null $parameters
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
 * @property-read mixed $running
 * @property-read Collection<int, \App\Models\Score> $scores
 * @property-read int|null $scores_count
 * @property-read Collection<int, ChallengeSession> $sessions
 * @property-read int|null $sessions_count
 * @method static Builder|Challenge newModelQuery()
 * @method static Builder|Challenge newQuery()
 * @method static Builder|Challenge query()
 * @method static Builder|Challenge whereActive($value)
 * @method static Builder|Challenge whereBonusLevelLife($value)
 * @method static Builder|Challenge whereBonusLevelTime($value)
 * @method static Builder|Challenge whereBonusScoreLife($value)
 * @method static Builder|Challenge whereBonusScoreTime($value)
 * @method static Builder|Challenge whereBonusScoreTrigger($value)
 * @method static Builder|Challenge whereChapterId($value)
 * @method static Builder|Challenge whereCreatedAt($value)
 * @method static Builder|Challenge whereDuration($value)
 * @method static Builder|Challenge whereGenerator($value)
 * @method static Builder|Challenge whereId($value)
 * @method static Builder|Challenge whereIsMathOnly($value)
 * @method static Builder|Challenge whereKeyboard($value)
 * @method static Builder|Challenge whereLives($value)
 * @method static Builder|Challenge whereMaxLevel($value)
 * @method static Builder|Challenge whereNextLevelAfter($value)
 * @method static Builder|Challenge whereOutput($value)
 * @method static Builder|Challenge whereParameters($value)
 * @method static Builder|Challenge whereSlug($value)
 * @method static Builder|Challenge whereTitle($value)
 * @method static Builder|Challenge whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Challenge extends Model
{
	protected $guarded = [];
	protected $with = ['blocks', 'scores'];

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

	public function scores()
	{
		return $this->morphMany(Score::class, 'scoreable');
//		return $this->hasMany(Score::class);
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
