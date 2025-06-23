<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBlockRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'title'             => ['nullable', 'string', 'max:255'],
			'body'              => ['nullable', 'string'],
			'template'          => ['nullable', 'string'],
			'type'              => ['nullable', 'string'],
			'script'            => ['nullable', 'string'],
			'json'              => ['nullable', 'string'],
			'switch'            => ['nullable', 'boolean'],
			'order'             => ['nullable', 'integer'],
			'illustrationsGrid' => ['nullable', 'string'],
		];
	}

	public function authorize(): bool
	{
		return true;
	}
}
