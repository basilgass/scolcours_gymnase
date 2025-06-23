<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGeneratorRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'title'    => ['required', 'string'],
			'slug'     => ['required', 'min:3'],
			'keyboard' => ['required', 'string'],
			'code'     => ['required', 'string'],
			'theme_id' => ['nullable', 'exists:themes'],
			'body'     => ['nullable', 'string'],
			'template' => ['nullable', 'string'],
		];
	}

	public function authorize(): bool
	{
		return true;
	}
}
