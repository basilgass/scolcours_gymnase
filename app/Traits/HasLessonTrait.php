<?php

namespace App\Traits;

use App\Models\Lesson;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasLessonTrait
{
	protected static function bootHasLessonTrait(): void
	{
		static::deleting(function ($model) {
			$model->lessons()->delete();
		});
	}

	public function lessons(): MorphMany
	{
		return $this->morphMany(Lesson::class, 'lessonable');
	}
}
