<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
	protected $with = ['blocks', 'lessons'];

	public function blocks(): \Illuminate\Database\Eloquent\Relations\MorphMany
	{
		return $this->morphMany(Block::class, 'blockable')
			->orderBy('order')
			->orderBy('id');
	}

	public function lessons(): \Illuminate\Database\Eloquent\Relations\HasMany|Course
	{
		return $this->hasMany(Lesson::class)
			->orderBy('scheduled_at');
	}

	protected $fillable = [
		'name',
		'slug',
	];
}
