<?php

namespace App\Models;

use App\Traits\HasScoresTrait;
use App\Traits\HasUrlTrait;
use Auth;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

/**
 * App\Models\Question
 *
 * @property int $id
 * @property int $order
 * @property string|null $displayif
 * @property string|null $css
 * @property string|null $answer
 * @property string|null $checker
 * @property string|null $keyboard
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $questionable_type
 * @property int $questionable_id
 * @property-read Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read Model|\Eloquent $questionable
 * @property-read Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static Builder<static>|Question newModelQuery()
 * @method static Builder<static>|Question newQuery()
 * @method static Builder<static>|Question query()
 * @method static Builder<static>|Question whereAnswer($value)
 * @method static Builder<static>|Question whereChecker($value)
 * @method static Builder<static>|Question whereCreatedAt($value)
 * @method static Builder<static>|Question whereCss($value)
 * @method static Builder<static>|Question whereDisplayif($value)
 * @method static Builder<static>|Question whereId($value)
 * @method static Builder<static>|Question whereKeyboard($value)
 * @method static Builder<static>|Question whereOrder($value)
 * @method static Builder<static>|Question whereQuestionableId($value)
 * @method static Builder<static>|Question whereQuestionableType($value)
 * @method static Builder<static>|Question whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Question extends Model
{
	use HasUrlTrait;
	use HasScoresTrait;

	protected $fillable = [
		'order',
		'displayif',
		'css',
		'answer',
		'keyboard',
	];
	protected $appends = ['url'];

	/**
	 * permet de récupérer le modèle qui contient cette question.
	 * @return MorphTo
	 */
	public function questionable(): MorphTo
	{
		return $this->morphTo();
	}

	/**
	 * Liste des Block de la question
	 * @return MorphMany
	 */
	public function blocks(): MorphMany
	{
		return $this->morphMany(Block::class, 'blockable')->orderBy('order')->orderBy('id');
	}

	public function resetAnswer(): void
	{
		$user = Auth::user();

		if ($user) {
			// Remove the cache
			// BUG: Remove the cache might not work anymore ?
			Cache::forget(Question::getCacheKey($user));

			// Delete the score record
			$this->scoreFor($user)?->delete();
		}
	}
}
