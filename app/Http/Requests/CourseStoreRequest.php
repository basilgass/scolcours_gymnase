<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseStoreRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'title'    => ['required'],
			'slug'     => ['required'],
			'theme_id' => ['nullable', 'integer'],
		];
	}

	public function authorize(): bool
	{
		return true;
	}
}
