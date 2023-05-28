<?php

namespace App\Models;

use Auth;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\Question
 *
 * @property int $id
 * @property int $order
 * @property string|null $css
 * @property string|null $answer
 * @property string|null $checker
 * @property string|null $keyboard
 * @property string|null $parameters
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $questionable_type
 * @property int $questionable_id
 * @property-read Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read Model|\Eloquent $questionable
 * @property-read Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static Builder|Question newModelQuery()
 * @method static Builder|Question newQuery()
 * @method static Builder|Question query()
 * @method static Builder|Question whereAnswer($value)
 * @method static Builder|Question whereChecker($value)
 * @method static Builder|Question whereCreatedAt($value)
 * @method static Builder|Question whereCss($value)
 * @method static Builder|Question whereId($value)
 * @method static Builder|Question whereKeyboard($value)
 * @method static Builder|Question whereOrder($value)
 * @method static Builder|Question whereParameters($value)
 * @method static Builder|Question whereQuestionableId($value)
 * @method static Builder|Question whereQuestionableType($value)
 * @method static Builder|Question whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Question extends Model
{
	use HasFactory;

	protected $guarded = [];
	// TODO: removed "users" from the $with attribute.
	protected $with = ['blocks'];

	public function questionable(): \Illuminate\Database\Eloquent\Relations\MorphTo
	{
		return $this->morphTo();
	}

//	public function post(): \Illuminate\Database\Eloquent\Relations\BelongsTo
//	{
//		return $this->belongsTo(Post::class);
//	}

	public function blocks(): \Illuminate\Database\Eloquent\Relations\MorphMany
	{
		return $this->morphMany(Block::class, 'blockable')->orderBy('order')->orderBy('id');
	}

	public function users(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
	{
		return $this->belongsToMany(User::class)
			->withTimestamps()
			->withPivot('result', 'answer', 'attempts');
	}

	public function answersFrom(mixed $ids)
	{
		return $this->users()
			->whereIn('question_user.user_id', $ids)
			->get();
	}
	public function answersFromUser(User $user)
	{
		$answer = $this->users()
			->where('question_user.user_id', '=', $user->id)
			->first();

		if($answer){
			return [
				'answer' => $answer->pivot->answer,
				'result' => $answer->pivot->result,
				'attempts' => $answer->pivot->attempts,
				'updated_at' => Carbon::parse($answer->pivot->updated_at)->diffForHumans(),
			];
		}

		return  [
			'answer' => "",
			'result' => false,
			'attempts' => 0,
			'updated_at' => null,
		];

	}
	public function userAnswers()
	{
		if (Auth::user()) {
			return $this->answersFromUser(Auth::user());
		}

		return collect([]);
	}

	public function clean()
	{
		$answers = [];

		if (Auth::user()) {
			$answers = $this->userAnswers();

			// No answer yet ! No need to clean it !
			if (count($answers) === 0) {
				return 0;
			}

			// Remove all previous values.
			foreach ($answers as $id => $answer) {
				$this->users()->detach(Auth::user()->id);
			}
		}

		return count($answers);
	}
}
