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
 * @property int $exercise_id
 * @property string $body
 * @property string|null $answer
 * @property string|null $checker
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\User[] $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder|Question newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Question newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Question query()
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereChecker($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereExerciseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Question extends Model
{
	use HasFactory;

	protected $guarded = [];
	protected $with = ['users'];
	public function exercise()
	{
		$this->belongsTo(Exercise::class);
	}

	public function users()
	{
		return $this->belongsToMany(User::class)
			->withTimestamps()
			->withPivot('result', 'answer');
	}

	public function answers(): Attribute
	{
		$user = Auth::user()?->id;

		return Attribute::make(
			get: fn () => collect($this->users()
				->where('user_id', $user)->get()
				->map(function ($answer) {
					return [
						'id' => $answer->pivot->question_id,
						'answer' => $answer->pivot->answer,
						'result' => $answer->pivot->result,
					];
				}))
		);
	}
	public function answered(): Attribute
	{
		$user = Auth::user();
		$values = [];

		if ($user) {
			$values = $this->users()
				->where('user_id', $user->id)->get();
		}

		return Attribute::make(
			get: fn () => $values
		);
	}
}
