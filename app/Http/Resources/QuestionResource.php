<?php

namespace App\Http\Resources;

use App\Models\Question;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

/**
 * @mixin Question
 */
class QuestionResource extends JsonResource
{
	// No wrap around the data.
	public static $wrap = null;
	/**
	 * Indicates if the resource's collection keys should be preserved.
	 *
	 * @var bool
	 */
	public $preserveKeys = true;

	/**
	 * Transform the resource into an array.
	 *
	 * @param Request $request
	 * @return array|Arrayable|JsonSerializable
	 */
	public function toArray($request)
	{
		// Il n'y a pas de block pour cette question
		$blocks = $this->blocks;
		if (count($blocks) === 0) {
			$blocks = $this->blocks()->create([
				"body" => "sans contenu"
			]);
		}

		return [
			"id"              => $this->id,
			"order"           => $this->order,
			"displayIf"       => $this->display_if,
			"css"             => $this->css,
			"block"           => [
				'id'           => $blocks[0]->id,
				'title'        => $blocks[0]->title,
				'body'         => $blocks[0]->body ?? "",
				'illustration' => $blocks[0]->illustrations[0] ?? null
			],
			"answer"          => $this->answer,
			"equationControl" => $this->equationControl,
			"keyboard"        => $this->keyboard,
		];
	}
}
