<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IllustrationRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			'code'       => ['string', 'nullable'],
			'title'      => ['string', 'nullable'],
			'footer'     => ['string', 'nullable'],
			'widget_id'  => ['exists:widgets,id', 'nullable'],
			'parameters' => ['string', 'nullable'],
			'order'      => ['integer', 'nullable'],
			'css'        => ['string', 'nullable'],
		];
	}

	public function authorize(): bool
	{
		return true;
	}

	protected function prepareForValidation(): void
	{
		if (!$this->has('code')) {
			$this->merge([
				"code" => ""
			]);
		}

		if (!$this->has('widget_id')) {
			$this->merge([
				'widget_id' => \App\Models\Widget::where('slug', 'draw-parser-widget')->value('id'),
			]);
		}
	}
}
