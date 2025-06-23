<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class updateScoreRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'score'       => ['required', 'integer'],
			'data'        => ['nullable', 'array'],
			'attempts'    => ['nullable'],
			'is_resolved' => ['nullable', 'boolean'],
		];
	}

	public function authorize(): bool
	{
		return true;
	}
}
