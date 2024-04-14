<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

/**
 * App\Models\Post
 *
 * @property int $id
 * @property int $chapter_id
 * @property string $title
 * @property string|null $type
 * @property int $order
 * @property int $numberOfVisibleBlocks
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
 * @method static Builder|Post newModelQuery()
 * @method static Builder|Post newQuery()
 * @method static Builder|Post query()
 * @method static Builder|Post whereActive($value)
 * @method static Builder|Post whereChapterId($value)
 * @method static Builder|Post whereCreatedAt($value)
 * @method static Builder|Post whereId($value)
 * @method static Builder|Post whereNumberOfVisibleBlocks($value)
 * @method static Builder|Post whereOrder($value)
 * @method static Builder|Post whereQuestionsGrid($value)
 * @method static Builder|Post whereScript($value)
 * @method static Builder|Post whereSwitch($value)
 * @method static Builder|Post whereTitle($value)
 * @method static Builder|Post whereType($value)
 * @method static Builder|Post whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Post extends Model
{
	use HasFactory;

	protected $guarded = [];
	protected $with = ['blocks', 'questions'];

	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function blocks()
	{
		return $this->morphMany(Block::class, 'blockable')->orderBy('order')->orderBy('id');
	}

	public function questions()
	{
		return $this->morphMany(Question::class, 'questionable')->orderBy('order')->orderBy('id');
	}

	public function scores()
	{
		return $this->morphMany(Score::class, 'scoreable');
	}

	protected function url(): Attribute
	{
		return Attribute::make(
			get: fn() => URL::route('themes.chapters.slide', [$this->chapter->theme->slug, $this->chapter->slug, $this->order], false)
//			get: fn() => [$this->chapter->theme->slug, $this->chapter->slug, $this->order]
		);
	}

	/**
	 * Consolidate the blocks order
	 * Take the actual order and modify the "order" to match the index.
	 * @return Collection
	 */
	public function consolidateBlocksOrder(): Collection
	{
		// Get the blocks
		$blocks = $this->blocks;

		// Update the order to match the index.
		foreach ($blocks as $index => $block) {
			$block->order = $index;
			$block->save();
		}

		return $blocks;
	}
}
