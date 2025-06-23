<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TargetClassRequest extends FormRequest
{
	public function rules(): array
	{
		return [
			"target_id"   => ["required", "integer"],
			"target_type" => ["required", "string"],
		];
	}

	public function authorize(): bool
	{
		return true;
	}
}
