<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
 * @method static \Illuminate\Database\Eloquent\Builder|Widget newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Widget newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Widget query()
 * @method static \Illuminate\Database\Eloquent\Builder|Widget whereComponent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Widget whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Widget whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Widget whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Widget whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Widget whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Widget whereThemeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Widget whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Widget extends Model
{
	use HasFactory;

	protected $guarded = [];

	protected $appends = ["control"];

	public function theme()
	{
		return $this->belongsTo(Theme::class);
	}

	public function illustration()
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
