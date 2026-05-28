<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuestionRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'keyboard'   => ['required', 'string'],
			'answer'     => ['required', 'string'],
			'order'      => ['nullable', 'integer'],
			'display_if' => ['nullable', 'string'],
			'css'        => ['nullable', 'string'],
			'validation' => ['nullable', 'string']
		];
	}

	protected function prepareForValidation(): void
	{
		$normalized = [];

		foreach (['keyboard', 'answer', 'css', 'validation'] as $field) {
			if ($this->has($field)) {
				$normalized[$field] = $this->blankToNull($this->input($field));
			}
		}

		$this->merge($normalized);
	}

	private function blankToNull(?string $value): ?string
	{
		if ($value === null) {
			return null;
		}

		$trimmed = trim($value);

		return $trimmed === '' ? null : $trimmed;
	}

	public function authorize(): bool
	{
		return true;
	}
}