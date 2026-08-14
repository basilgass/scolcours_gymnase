<?php

namespace App\Models;

use App\Traits\HasQuestionsTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * App\Models\Evaluation
 *
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property string $body
 * @property bool $randomOrder
 * @property bool $auto_control
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Generator> $generators
 * @property-read int|null $generators_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property-read int|null $questions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Team> $teams
 * @property-read int|null $teams_count
 * @method static \Database\Factories\EvaluationFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereAutoControl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereRandomOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Evaluation extends Model
{
	use HasFactory;
	use HasQuestionsTrait;

	protected $with = ['generators', 'questions'];

	protected $fillable = [
		"slug",
		"title",
		"body",
		"randomOrder",
		"auto_control"
	];

	protected $casts = [
		"randomOrder"  => "boolean",
		"auto_control" => "boolean"
	];

	public function generators(): MorphToMany
	{
		return $this
			->morphToMany(Generator::class, 'generatorable')
			->withPivot('order')
			->orderByPivot('order');
	}

	public function teams(): BelongsToMany
	{
		return $this->belongsToMany(Team::class);
	}
}
