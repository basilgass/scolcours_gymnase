<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class updateCardRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'blocks' => ['required', 'array'],
			'blocks.recto' => ['required', 'array'],
			'blocks.recto.id' => ['required', 'integer', 'exists:blocks,id'],
			'blocks.recto.body' => ['required', 'string'],
			'blocks.verso' => ['required', 'array'],
			'blocks.verso.id' => ['required', 'integer', 'exists:blocks,id'],
			'blocks.verso.body' => ['required', 'string'],
		];	}

	public function authorize(): bool
	{
		return true;
	}
}
