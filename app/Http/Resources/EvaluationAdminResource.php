<?php

namespace App\Http\Resources;

use App\Models\Evaluation;
use Illuminate\Http\Request;

/**
 * @mixin Evaluation
 */
class EvaluationAdminResource extends EvaluationResource
{
	public function toArray(Request $request): array
	{
		//		        return parent::toArray($request);

		return [
			...parent::toArray($request),
			"teams" => TeamResource::collection($this->teams),
		];
	}
}
