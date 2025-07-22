<?php

namespace App\Models;

use App\Traits\HasUrlTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Course extends Model
{
	use HasUrlTrait;

	protected $with = ['blocks', 'lessons'];
	protected $appends = ['url'];

	protected $fillable = [
		"title",
		"slug",
		"theme_id",
	];

	public function blocks(): MorphMany
	{
		return $this
			->morphMany(Block::class, 'blockable')
			->orderBy('order')
			->orderBy('id');
	}

	public function lessons(): HasMany|Course
	{
		return $this->hasMany(Lesson::class);
	}

	public function theme(): BelongsTo
	{
		return $this->belongsTo(Theme::class);
	}

	public function users()
	{
		return $this->belongsToMany(User::class);
	}
}
