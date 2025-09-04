<?php

namespace App\Models;

use App\Traits\HasLessonTrait;
use App\Traits\HasQuestionsTrait;
use App\Traits\HasScoresTrait;
use App\Traits\HasUrlTrait;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Znck\Eloquent\Traits\BelongsToThrough;

/**
 * App\Models\Post
 *
 * @property int $id
 * @property int $chapter_id
 * @property string $title
 * @property string|null $type
 * @property int $order
 * @property string|null $questionsGrid
 * @property int $active
 * @property string $script
 * @property string|null $switch
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read \App\Models\Chapter $chapter
 * @property-read Collection<int, \App\Models\Question> $questions
 * @property-read int|null $questions_count
 * @property-read Collection<int, \App\Models\Score> $scores
 * @property-read int|null $scores_count
 * @property-read mixed $url
 * @method static Builder<static>|Post newModelQuery()
 * @method static Builder<static>|Post newQuery()
 * @method static Builder<static>|Post query()
 * @method static Builder<static>|Post whereActive($value)
 * @method static Builder<static>|Post whereChapterId($value)
 * @method static Builder<static>|Post whereCreatedAt($value)
 * @method static Builder<static>|Post whereId($value)
 * @method static Builder<static>|Post whereOrder($value)
 * @method static Builder<static>|Post whereQuestionsGrid($value)
 * @method static Builder<static>|Post whereScript($value)
 * @method static Builder<static>|Post whereSwitch($value)
 * @method static Builder<static>|Post whereTitle($value)
 * @method static Builder<static>|Post whereType($value)
 * @method static Builder<static>|Post whereUpdatedAt($value)
 * @method static Builder<static>|Post withCounts()
 * @mixin Eloquent
 */
class Post extends Model
{
	use HasUrlTrait;
	use HasQuestionsTrait;
	use BelongsToThrough;
	use HasLessonTrait;

	protected $guarded = [];
	protected $with = [];
	protected $appends = ['url'];

	public function scopeWithCounts($query): void
	{
		$query
			->withCount('questions')
			->withCount([
				'questions as answered_questions_count' => function ($query) {
					$query->whereHas('users', function ($query) {
						$query->where('scores.user_id', Auth::id())
						->where('scores.is_resolved', 1);
					});
				}
			]);
	}

	public function theme(): \Znck\Eloquent\Relations\BelongsToThrough
	{
		return $this->belongsToThrough(Theme::class, Chapter::class);
	}

	public function chapter(): BelongsTo
	{
		return $this->belongsTo(Chapter::class);
	}

	public function blocks(): MorphMany
	{
		return $this->morphMany(Block::class, 'blockable')->orderBy('order')->orderBy('id');
	}

}
