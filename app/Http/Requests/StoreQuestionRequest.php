<?php

namespace App\Http\Requests;

class StoreQuestionRequest extends UpdateQuestionRequest
{
	public function rules(): array
	{
		return array_merge(parent::rules(), [
			'target_id'   => ['required', 'integer'],
			'target_type' => ['required', 'string'],
		]);
	}

	public function authorize(): bool
	{
		return true;
	}
}
