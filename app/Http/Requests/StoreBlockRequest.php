<?php

namespace App\Http\Requests;

class StoreBlockRequest extends UpdateBlockRequest
{
	public function rules(): array
	{
		return array_merge(parent::rules(), [
				'target_id'   => ['required', 'integer'],
				'target_type' => ['required'],
			]
		);
	}

	public function authorize(): bool
	{
		return true;
	}
}
