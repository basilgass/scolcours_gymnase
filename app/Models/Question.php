<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Question
 *
 * @property int $id
 * @property int $post_id
 * @property int $order
 * @property string|null $answer
 * @property string|null $checker
 * @property string|null $keyboard
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Block[] $blocks
 * @property-read int|null $blocks_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\User[] $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder|Question newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Question newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Question query()
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereChecker($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereKeyboard($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question wherePostId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Question extends Model
{
	use HasFactory;

	protected $guarded = [];
	protected $with = ['users', 'blocks'];

	public function post()
	{
		$this->belongsTo(Post::class);
	}

	public function blocks()
	{
		return $this->morphMany(Block::class, 'blockable')->orderBy('order')->orderBy('id');
	}

	public function users()
	{
		return $this->belongsToMany(User::class)
			->withTimestamps()
			->withPivot('result', 'answer');
	}

	public function answersByUser($user)
	{
		$values = collect([]);

		if ($user) {
			$values = collect($this->users()
				->where('user_id', $user->id)->get()
				->map(function ($answer) {
					return [
						'id' => $answer->pivot->question_id,
						'answer' => $answer->pivot->answer,
						'result' => $answer->pivot->result,
					];
				}));

		}
		return Attribute::make(
			get: fn () => $values
		);
	}

	public function answeredByUser($user)
	{
		$values = collect([]);

		if ($user) {
			$values = $this->users()
				->where('user_id', $user->id)->get();
		}

		return Attribute::make(
			get: fn () => $values
		);
	}
	public function answers(): Attribute
	{
		return $this->answersByUser(Auth::user());
	}
	public function answered(): Attribute
	{
		return $this->answeredByUser(Auth::user());

	}
}
