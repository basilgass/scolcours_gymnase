<?php

namespace App\Models;

use App\Traits\HasScoresTrait;
use App\Traits\HasUrlTrait;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
	use HasUrlTrait;
	use HasScoresTrait;

	protected $fillable = [
		"requires",
		"scoreRules",
		"lessonable_type",
		"lessonable_id"
	];
	protected $appends = ['url'];

	protected function casts(): array
	{
		return [
			'scoreRules' => 'array',
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
