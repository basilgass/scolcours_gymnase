<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\Theme
 *
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property int $order
 * @property string $color
 * @property string|null $icon
 * @property int $enabled
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\Chapter> $chapters
 * @property-read int|null $chapters_count
 * @property-read Collection<int, \App\Models\Generator> $generators
 * @property-read int|null $generators_count
 * @property-read Collection<int, \App\Models\Widget> $widgets
 * @property-read int|null $widgets_count
 * @method static Builder|Theme newModelQuery()
 * @method static Builder|Theme newQuery()
 * @method static Builder|Theme query()
 * @method static Builder|Theme whereColor($value)
 * @method static Builder|Theme whereCreatedAt($value)
 * @method static Builder|Theme whereEnabled($value)
 * @method static Builder|Theme whereIcon($value)
 * @method static Builder|Theme whereId($value)
 * @method static Builder|Theme whereOrder($value)
 * @method static Builder|Theme whereSlug($value)
 * @method static Builder|Theme whereTitle($value)
 * @method static Builder|Theme whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Theme extends Model
{
    protected $guarded = [];

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }

	public function widgets()
	{
		return $this->hasMany(Widget::class);
	}

	public function generators()
	{
		return $this->hasMany(Generator::class);
	}

}
