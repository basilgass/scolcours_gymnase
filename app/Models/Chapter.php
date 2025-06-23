<?php

namespace App\Models;

use App\Traits\HasUrlTrait;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Carbon;
use URL;

/**
 * App\Models\Chapter
 *
 * @property int $id
 * @property int $theme_id
 * @property string $slug
 * @property string $title
 * @property string|null $meta_title
 * @property int $active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read Collection<int, \App\Models\Challenge> $challenges
 * @property-read int|null $challenges_count
 * @property-read mixed $component
 * @property-read Collection<int, \App\Models\Deck> $decks
 * @property-read int|null $decks_count
 * @property-read Collection<int, \App\Models\Formula> $formulas
 * @property-read int|null $formulas_count
 * @property-read Collection<int, \App\Models\Post> $posts
 * @property-read int|null $posts_count
 * @property-read Collection<int, \App\Models\Question> $questions
 * @property-read int|null $questions_count
 * @property-read Collection<int, \App\Models\Quizz> $quizzs
 * @property-read int|null $quizzs_count
 * @property-read Collection<int, Chapter> $relations
 * @property-read int|null $relations_count
 * @property-read \App\Models\Theme $theme
 * @property-read mixed $url
 * @property-read Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Database\Factories\ChapterFactory factory($count = null, $state = [])
 * @method static Builder<static>|Chapter newModelQuery()
 * @method static Builder<static>|Chapter newQuery()
 * @method static Builder<static>|Chapter query()
 * @method static Builder<static>|Chapter whereActive($value)
 * @method static Builder<static>|Chapter whereCreatedAt($value)
 * @method static Builder<static>|Chapter whereId($value)
 * @method static Builder<static>|Chapter whereMetaTitle($value)
 * @method static Builder<static>|Chapter whereSlug($value)
 * @method static Builder<static>|Chapter whereThemeId($value)
 * @method static Builder<static>|Chapter whereTitle($value)
 * @method static Builder<static>|Chapter whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Chapter extends Model
{
	use HasFactory;
	use HasUrlTrait;

	protected $guarded = [];
	protected $with = ['blocks'];
	protected $appends = ['url'];

	public function theme(): BelongsTo
	{
		return $this->belongsTo(Theme::class);
	}

	public function blocks(): MorphMany
	{
		return $this->morphMany(Block::class, 'blockable');
	}

	public function posts(): HasMany
	{
		return $this->hasMany(Post::class)->orderBy('order')->orderBy('id');
	}

	public function formulas(): HasMany
	{
		return $this
			->hasMany(Formula::class)
			->orderBy('order')
			->orderBy('id');
	}

	public function challenges(): HasMany
	{
		return $this->hasMany(Challenge::class);
	}

	public function questions(): MorphToMany
	{
		return $this->morphedByMany(Question::class, Post::class);
	}

	public function users(): BelongsToMany
	{
		return $this->belongsToMany(User::class);
	}

	public function quizzs(): Builder|HasMany|Chapter
	{
		return $this->hasMany(Quizz::class);
	}

	public function relations(): BelongsToMany
	{
		return $this->belongsToMany(Chapter::class, "chapter_relation", "chapter_id", "related_id");
	}

	public function decks(): Builder|HasMany|Chapter
	{
		return $this->hasMany(Deck::class);
	}

	public function reorder(): void
	{
		$this->refresh();
		foreach ($this->posts as $index => $post) {
			$post->update(["order" => $index + 1]);
		}
	}
}
