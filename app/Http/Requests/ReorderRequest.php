<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderRequest extends FormRequest
{
	protected string $modelTable = 'blocks'; // défaut

	public function setModelTable(string $table): static
	{
		$this->modelTable = $table;
		return $this;
	}

	public function rules(): array
	{
		return [
			"order"         => ["required", "array"],
			"order.*.id"    => ["required", "integer", "exists:{$this->modelTable},id"],
			"order.*.order" => ["required", "integer"]
		];
	}

	public function authorize(): bool
	{
		return true;
	}
}
