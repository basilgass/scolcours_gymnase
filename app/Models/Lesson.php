<?php

namespace App\Models;

use App\Traits\HasScoresTrait;
use App\Traits\HasUrlTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Lesson extends Model
{
	use HasUrlTrait;
	use HasScoresTrait;

	protected $fillable = [
		"requires",
		"order",
		"scoreRules",
		"lessonable_type",
		"lessonable_id"
	];
	protected $appends = ['url'];

	protected $with = ['calendars'];

	protected function casts(): array
	{
		return [
			'scoreRules'   => 'array',
			'scheduled_at' => 'datetime'
		];
	}

	public function lessonable(): MorphTo
	{
		return $this->morphTo();
	}

	public function course(): BelongsTo
	{
		return $this->belongsTo(Course::class);
	}

	public function calendars(): HasMany
	{
		return $this->hasMany(LessonCalendar::class);
	}

	public function blocks(): MorphMany
	{
		return $this
			->morphMany(Block::class, 'blockable')
			->orderBy('order')
			->orderBy('id');
	}

}
