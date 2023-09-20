<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Evaluation
 *
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property string $body
 * @property int $user_id
 * @property int $randomOrder
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Generator> $generators
 * @property-read int|null $generators_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property-read int|null $questions_count
 * @method static \Illuminate\Database\Eloquent\Builder|Evaluation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Evaluation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Evaluation query()
 * @method static \Illuminate\Database\Eloquent\Builder|Evaluation whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Evaluation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Evaluation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Evaluation whereRandomOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Evaluation whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Evaluation whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Evaluation whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Evaluation whereUserId($value)
 * @mixin \Eloquent
 */
class Evaluation extends Model
{
    use HasFactory;

    protected $with = ['generators', 'questions'];

    public function generators()
    {
        return $this->morphToMany(Generator::class, 'generatorable')
            ->withPivot('order')
            ->orderByPivot('order');
    }

    public function questions()
    {
        return $this->morphMany(Question::class, 'questionable')
            ->orderBy('order')
            ->orderBy('id');
    }
}
