<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserApiController extends Controller
{
	public function index()
	{

	}

	public function store(Request $request)
	{
	}

	public function show(User $user)
	{
		return [
			'user'=>UserResource::make($user),
			'courses'=>CourseResource::collection($user->courses)
		];
	}

	public function update(Request $request, User $user)
	{
	}

	public function destroy(User $user)
	{
	}
}
