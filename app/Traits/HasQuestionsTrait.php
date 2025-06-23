<?php

namespace App\Traits;

use App\Models\Question;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasQuestionsTrait
{
	public function questions(): MorphMany
	{
		return $this
			->morphMany(Question::class, 'questionable')
			->orderBy('order')
			->orderBy('id');
	}

	public function questions_reorder($order): void
	{
		$questions = $this->questions;

		foreach ($order as $value) {
			$questions
				->find('id')
				->update(['order' => $value['order']]);
		}
	}
}
