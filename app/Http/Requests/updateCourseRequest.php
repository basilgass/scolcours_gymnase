<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class updateCourseRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'theme_id' => ['required', 'exists:themes,id'],
			'slug'     => ['required'],
			'title'    => ['required'],
		];
	}

	public function authorize(): bool
	{
		return true;
	}
}
