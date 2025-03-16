<?php

namespace App\Models;

use Auth;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
    protected $guarded = [];
    protected $with = [];

    public function questionable(): MorphTo
    {
        return $this->morphTo();
    }

    public function blocks(): MorphMany
    {
        return $this->morphMany(Block::class, 'blockable')->orderBy('order')->orderBy('id');
    }

    public function answersFrom(mixed $ids)
    {
        return $this->users()
            ->whereIn('question_user.user_id', $ids)
            ->get();
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withTimestamps()
            ->withPivot('result', 'answer', 'attempts');
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

    public function userAnswers()
    {
        if (Auth::user()) {
            return $this->answersFromUser(Auth::user());
        }

        return collect([]);
    }

    public static function getCacheKey(Question $question, User $user): string
    {
        return "question_{$question->id}_user_{$user->id}_answers";
    }

    public function answersFromUser(User $user)
    {
        $cacheKey = Question::getCacheKey($this, $user);

        $cacheTime = 15 * 60; // 15 minutes

        return Cache::remember($cacheKey, $cacheTime, function () use ($user) {
            $answer = $this->users()
                ->where('question_user.user_id', '=', $user->id)
                ->first();

            if ($answer) {
                return [
                    'answer'     => $answer->pivot->answer,
                    'result'     => $answer->pivot->result,
                    'attempts'   => $answer->pivot->attempts,
                    'updated_at' => Carbon::parse($answer->pivot->updated_at)->diffForHumans(),
                ];
            }

            return [
                'answer'     => "",
                'result'     => false,
                'attempts'   => 0,
                'updated_at' => null,
            ];
        });

    }
}
