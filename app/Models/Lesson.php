<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
	protected $fillable = [];

	public function lessonable()
	{
		return $this->morphTo();
	}

	public function course()
	{
		return $this->belongsTo(Course::class);
	}

	public function blocks()
	{
		return $this->morphMany(Block::class, 'blockable')
			->orderBy('order')
			->orderBy('id');
	}

	protected function casts(): array
	{
		return [
			'opened_at'    => 'datetime',
			'scheduled_at' => 'datetime',
			'parameters'   => 'array',
		];
	}

	protected function remainingDays(): Attribute
	{
		return Attribute::make(
			get: fn() => (int) -$this->scheduled_at->diffInDays()
		);
	}
}
