<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

abstract class GeneratorRequest extends FormRequest
{
	protected function commonRules(): array
	{
		return [
			'theme_id'                        => ['required', 'exists:themes,id'],
			'title'                           => ['required', 'string'],
			'slug'                            => ['required', 'string', 'min:3'],
			'code'                            => ['required', 'string'],
			'template'                        => ['required', 'string'],
			'keyboard'                        => ['required', 'string'],
			'body'                            => ['nullable', 'string'],
			'parameters_schema'               => ['nullable', 'array'],
			'parameters_schema.*'             => ['array:format,default,description,choices'],
			'parameters_schema.*.format'      => ['required', 'string', 'in:number,string,set,choices'],
			'parameters_schema.*.default'     => ['required', 'string'],
			'parameters_schema.*.description' => ['nullable', 'string'],
			'parameters_schema.*.choices'     => ['nullable', 'string'],
		];
	}

	public function authorize(): bool
	{
		return true;
	}
}
