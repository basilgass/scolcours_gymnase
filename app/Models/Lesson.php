<?php

namespace App\Models;

use App\Traits\HasUrlTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
	use HasUrlTrait;

	protected $fillable = [];
	protected $appends = ['url'];

	protected function casts(): array
	{
		return [
			'parameters' => 'array',
		];
	}

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
		return $this
			->morphMany(Block::class, 'blockable')
			->orderBy('order')
			->orderBy('id');
	}

//	protected function remainingDays(): Attribute
//	{
//		return Attribute::make(
//			get: fn() => (int)-$this->scheduled_at->diffInDays()
//		);
//	}
}
