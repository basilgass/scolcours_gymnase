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
 * @property int $post_id
 * @property int $order
 * @property string|null $answer
 * @property string|null $checker
 * @property string|null $keyboard
 * @property string|null $parameters
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|Block[] $blocks
 * @property-read int|null $blocks_count
 * @property-read Post $post
 * @property-read Collection|User[] $users
 * @property-read int|null $users_count
 * @method static Builder|Question newModelQuery()
 * @method static Builder|Question newQuery()
 * @method static Builder|Question query()
 * @method static Builder|Question whereAnswer($value)
 * @method static Builder|Question whereChecker($value)
 * @method static Builder|Question whereCreatedAt($value)
 * @method static Builder|Question whereId($value)
 * @method static Builder|Question whereKeyboard($value)
 * @method static Builder|Question whereOrder($value)
 * @method static Builder|Question whereParameters($value)
 * @method static Builder|Question wherePostId($value)
 * @method static Builder|Question whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Question extends Model
{
	use HasFactory;

	protected $guarded = [];
	protected $with = ['users', 'blocks'];

	public function post()
	{
		return $this->belongsTo(Post::class);
	}

	public function blocks()
	{
		return $this->morphMany(Block::class, 'blockable')->orderBy('order')->orderBy('id');
	}

	public function users()
	{
		return $this->belongsToMany(User::class)
			->withTimestamps()
			->withPivot('result', 'answer', 'attempts');
	}

	public function userAnswers()
	{
		if (Auth::user()) {
			return $this->users()
				->where('question_user.user_id', '=', Auth::user()->id)
				->get()
				->map(function ($item) {
					return [
						'answer' => $item->pivot->answer,
						'result' => $item->pivot->result,
						'attempts' => $item->pivot->attempts,
						'created_at' => Carbon::parse($item->pivot->created_at)->diffForHumans(),
					];
				});
		} else {
			return collect([]);
		}
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
//	public function answersByUser($user)
//	{
//		$values = collect([]);
//
//		if ($user) {
//			$values = collect($this->users()
//				->where('user_id', $user->id)->get()
//				->map(function ($answer) {
//					return [
//						'id' => $answer->pivot->question_id,
//						'answer' => $answer->pivot->answer,
//						'result' => $answer->pivot->result,
//					];
//				}));
//
//		}
//		return Attribute::make(
//			get: fn () => $values
//		);
//	}

//	public function answeredByUser($user)
//	{
//		$values = collect([]);
//
//		if ($user) {
//			$values = $this->users()
//				->where('user_id', $user->id)->get();
//		}
//
//		return Attribute::make(
//			get: fn () => $values
//		);
//	}
//
//
//	public function answers(): Attribute
//	{
//		return $this->answersByUser(Auth::user());
//	}
//	public function answered(): Attribute
//	{
//		return $this->answeredByUser(Auth::user());
//
//	}
}
