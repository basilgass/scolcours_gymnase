<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChallengeUsersTable extends Migration
	{
		public function up()
		{
			Schema::create('challenge_users', function (Blueprint $table) {
				$table->bigIncrements('id');
				$table->foreignId('challenge_session_id')->constrained('challenge_sessions')->cascadeOnDelete();
				$table->string('token');
				$table->integer('score');
				//
				$table->timestamps();

				$table->unique(['challenge_session_id', 'token']);
			});
		}

		public function down()
		{
			Schema::dropIfExists('challenge_users');
		}
	}
