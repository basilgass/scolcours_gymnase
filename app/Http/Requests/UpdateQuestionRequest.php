<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuestionRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'keyboard'   => ['nullable', 'string'],
			'answer'     => ['nullable', 'string'],
			'order'      => ['nullable', 'integer'],
			'display_if' => ['nullable', 'string'],
			'css'        => ['nullable', 'string'],
			'validation' => ['nullable', 'string']
		];
	}

	public function authorize(): bool
	{
		return true;
	}
}
