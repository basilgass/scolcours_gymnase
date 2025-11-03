<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class LessonCalendar extends Model
{
	protected $fillable = [
		'team_id',
		'lesson_id',
		'scheduled_at',
		'homework'
	];

	protected function casts(): array
	{
		return [
			'scheduled_at' => 'datetime',
			'homework'     => 'boolean'
		];
	}

	public function blocks(): MorphMany
	{
		return $this
			->morphMany(Block::class, 'blockable')
			->orderBy('order')
			->orderBy('id');

	}

	public function team(): BelongsTo
	{
		return $this->belongsTo(Team::class);
	}

	public function lesson(): BelongsTo
	{
		return $this->belongsTo(Lesson::class);
	}
}
