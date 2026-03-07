<?php

namespace App\Http\Resources;

use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Evaluation
 */
class EvaluationResource extends JsonResource
{
	// No wrap around the data.
	public static $wrap = null;

	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		//        return parent::toArray($request);

		return [
			"id"           => $this->id,
			"slug"         => $this->slug,
			"title"        => $this->title,
			"body"         => $this->body,
			"randomOrder"  => $this->randomOrder,
			"auto_control" => $this->auto_control,
			"questions"    => QuestionResource::collection($this->questions),
		];
	}
}
