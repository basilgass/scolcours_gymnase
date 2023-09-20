<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
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
 * @property string $keyboard
 * @property string $code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Challenge> $challenges
 * @property-read int|null $challenges_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Evaluation> $evaluations
 * @property-read int|null $evaluations_count
 * @method static \Illuminate\Database\Eloquent\Builder|Generator newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Generator newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Generator query()
 * @method static \Illuminate\Database\Eloquent\Builder|Generator whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Generator whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Generator whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Generator whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Generator whereKeyboard($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Generator whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Generator whereThemeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Generator whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Generator whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Generator extends Model
{
    use HasFactory;

	protected $guarded = [];

	public function challenges()
	{
		return $this->morphedByMany(Challenge::class, 'generatorable')
			->withPivot('order');
	}

    public function evaluations()
    {
        return $this->morphedByMany(Evaluation::class, 'generatorable')
            ->withPivot('order');
    }
}
