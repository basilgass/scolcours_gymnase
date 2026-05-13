<?php

namespace App\Http\Requests;

class StoreGeneratorRequest extends GeneratorRequest
{
	public function rules(): array
	{
		return $this->commonRules();
	}

	public function prepareForValidation(): void
	{
		$this->merge([
			'template' => $this->input('template', '\[question = answer\]'),
			'keyboard' => $this->input('keyboard', 'algebra'),
			'code'     => $this->input('code', "let question = ''\nlet answer = ''\n\nreturn {question, answer}"),
			'body'     => $this->input('body', 'description du générateur.'),
		]);
	}
}