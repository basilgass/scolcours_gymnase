<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Widget
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string $component
 * @property int|null $theme_id
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $control
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Illustration> $illustration
 * @property-read int|null $illustration_count
 * @property-read \App\Models\Theme|null $theme
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Widget newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Widget newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Widget query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Widget whereComponent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Widget whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Widget whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Widget whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Widget whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Widget whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Widget whereThemeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Widget whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Widget extends Model
{
	protected $guarded = [];

	protected $appends = ["control"];

	public function theme(): \Illuminate\Database\Eloquent\Relations\BelongsTo
	{
		return $this->belongsTo(Theme::class);
	}

	public function illustration(): Widget|\Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Relations\HasMany
	{
		return $this->hasMany(Illustration::class);
	}

	public function control(): Attribute
	{
		return Attribute::make(
			get: fn() => \Storage::disk('widgets')->exists($this->component)
		);
	}
}
