<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Http\Resources\UserResource;
use App\Models\User;

class UserApiController extends Controller
{
	public function show(User $user)
	{
		return [
			'user'    => UserResource::make($user),
			'courses' => CourseResource::collection($user->courses)
		];
	}
}
