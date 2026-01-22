<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class updateCardRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'blocks'            => ['nullable', 'array'],
			'blocks.recto'      => ['required_without:splitter', 'array'],
			'blocks.recto.id'   => ['required_without:splitter', 'integer', 'exists:blocks,id'],
			'blocks.recto.body' => ['required_without:splitter', 'string'],
			'blocks.verso'      => ['required_without:splitter', 'array'],
			'blocks.verso.id'   => ['required_without:splitter', 'integer', 'exists:blocks,id'],
			'blocks.verso.body' => ['required_without:splitter', 'string'],
			'splitter'          => ['nullable', 'string'],
		];
	}

	public function authorize(): bool
	{
		return true;
	}
}
