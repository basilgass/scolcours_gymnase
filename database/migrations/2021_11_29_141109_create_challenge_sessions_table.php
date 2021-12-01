<?php
	
	use Illuminate\Database\Migrations\Migration;
	use Illuminate\Database\Schema\Blueprint;
	use Illuminate\Support\Facades\Schema;
	
	class CreateChallengeSessionsTable extends Migration
	{
		public function up()
		{
			Schema::create('challenge_sessions', function (Blueprint $table) {
				$table->bigIncrements('id');
				$table->foreignId('challenge_id')->constrained()->cascadeOnDelete();
				$table->foreignId('user_id')->constrained()->cascadeOnDelete();
				$table->string('token')->unique();
				$table->boolean('open');
				$table->integer('duration');
				$table->timestamps();
			});
		}
		
		public function down()
		{
			Schema::dropIfExists('challenge_sessions');
		}
	}