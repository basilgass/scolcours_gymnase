<?php

namespace App\Traits;

trait CanMoveToTarget
{
	public function moveToTarget(
		$model,
		$relationMethod,
		$target,
		$parentRelation,
		$urlAttr = 'url',
		$labelAttr = 'title'
	)
	{
		$maxOrder = $target->$relationMethod()->max('order') ?? 0;

		$model->$parentRelation()->associate($target);
		$model->order = $maxOrder + 1;
		$model->save();

		return [
			'url'   => $target->$urlAttr,
			'label' => $target->$labelAttr,
		];
	}
}
