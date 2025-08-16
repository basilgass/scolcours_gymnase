<?php

namespace App\Models;

use App\Traits\HasScoresTrait;
use Illuminate\Database\Eloquent\Model;

// A generator belongs to Challenge, Evaluation, and many more

/**
 * App\Models\Generator
 *
 * @property int $id
 * @property int $theme_id
 * @property string|null $slug
 * @property string $title
 * @property string $body
 * @property string|null $template
 * @property string $keyboard
 * @property string $code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Challenge> $challenges
 * @property-read int|null $challenges_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Evaluation> $evaluations
 * @property-read int|null $evaluations_count
 * @property-read \App\Models\Theme $theme
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator whereKeyboard($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator whereTemplate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator whereThemeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generator whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Generator extends Model
{
	protected $fillable = [
		"theme_id",
		"slug",
		"template",
		"keyboard",
		"code",
	];

	use HasScoresTrait;

	public function theme(): \Illuminate\Database\Eloquent\Relations\BelongsTo
	{
		return $this->belongsTo(Theme::class);
	}

	public function challenges(): \Illuminate\Database\Eloquent\Relations\MorphToMany
	{
		return $this
			->morphedByMany(Challenge::class, 'generatorable')
			->withPivot('order');
	}

	public function evaluations(): \Illuminate\Database\Eloquent\Relations\MorphToMany
	{
		return $this
			->morphedByMany(Evaluation::class, 'generatorable')
			->withPivot('order');
	}
}
