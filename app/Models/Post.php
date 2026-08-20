<?php

namespace App\Models;

use App\Traits\HasLessonTrait;
use App\Traits\HasQuestionsTrait;
use App\Traits\HasScoresTrait;
use App\Traits\HasUrlTrait;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
 * @property int|null $calculator
 * @property string $script
 * @property string|null $switch
 * @property int $revise
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read \App\Models\Chapter $chapter
 * @property-read Collection<int, \App\Models\Lesson> $lessons
 * @property-read int|null $lessons_count
 * @property-read Collection<int, \App\Models\Question> $questions
 * @property-read int|null $questions_count
 * @property-read mixed $url
 * @property-read \App\Models\Theme|null $theme
 * @method static \Database\Factories\PostFactory factory($count = null, $state = [])
 * @method static Builder<static>|Post newModelQuery()
 * @method static Builder<static>|Post newQuery()
 * @method static Builder<static>|Post query()
 * @method static Builder<static>|Post whereActive($value)
 * @method static Builder<static>|Post whereCalculator($value)
 * @method static Builder<static>|Post whereChapterId($value)
 * @method static Builder<static>|Post whereCreatedAt($value)
 * @method static Builder<static>|Post whereId($value)
 * @method static Builder<static>|Post whereOrder($value)
 * @method static Builder<static>|Post whereQuestionsGrid($value)
 * @method static Builder<static>|Post whereRevise($value)
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
	use HasFactory;
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
		return $this->morphMany(Block::class, 'blockable')
		            ->orderBy('order')
		            ->orderBy('id');
	}

	/**
	 * Duplique le post dans le même chapitre : copie profonde de la donnée
	 * (blocks + illustrations) et des questions (avec leurs propres blocks).
	 * La copie est un brouillon (active = false) placé en fin de chapitre.
	 * Les scores des élèves ne sont pas copiés.
	 */
	public function duplicate(): Post
	{
		$clonedPost = $this->replicate();
		$clonedPost->title = $this->title . ' (copie)';
		$clonedPost->active = false;
		$clonedPost->order = $this->chapter->posts()->count() + 1;
		$clonedPost->push();

		// Copie des blocks de la donnée (Block::duplicate() copie aussi les illustrations).
		foreach ($this->blocks as $block) {
			$clonedPost->blocks()->save($block->duplicate());
		}

		// Copie des questions, chacune avec ses propres blocks.
		foreach ($this->questions as $question) {
			$clonedQuestion = $question->replicate();
			$clonedPost->questions()->save($clonedQuestion);

			foreach ($question->blocks as $block) {
				$clonedQuestion->blocks()->save($block->duplicate());
			}
		}

		return $clonedPost->refresh();
	}

}
