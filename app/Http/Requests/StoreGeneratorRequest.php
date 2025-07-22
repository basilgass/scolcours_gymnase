<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGeneratorRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'theme_id' => ['required', 'exists:themes,id'],
			'slug'     => ['required'],
		];
	}

	public function prepareForValidation(): void
	{
		$this->merge([
			'template' => $this->input('template', '\[question = answer\]'),
			'keyboard' => $this->input('keyboard', 'algebra'),
			'code'     => $this->input('code', "let question = '';\nlet answer = '';\n\nreturn {question, answer}"),
		]);
	}

	public function authorize(): bool
	{
		return true;
	}
}
