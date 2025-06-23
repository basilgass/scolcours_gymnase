<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeckRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'slug'       => ['required', 'string', 'min:3'],
			'title'      => ['required', 'string', 'min:3'],
			'chapter_id' => ['nullable', 'exists:chapters'],
		];
	}

	public function authorize(): bool
	{
		return true;
	}
}
