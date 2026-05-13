<?php

namespace App\Http\Requests;

class UpdateGeneratorRequest extends GeneratorRequest
{
	public function rules(): array
	{
		return $this->commonRules();
	}
}