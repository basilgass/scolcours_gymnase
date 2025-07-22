<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeckRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'title'      => ['required', 'string', 'min:3'],
			'slug'       => ['required', 'string', 'min:3'],
			'chapter_id' => ['nullable', 'exists:App\Models\Chapter,id'],
		];
	}

	public function authorize(): bool
	{
		return true;
	}
}
