<?php

use App\Models\Chapter;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChallengesTable extends Migration
	{
		public function up()
		{
			Schema::create('challenges', function (Blueprint $table) {
				$table->bigIncrements('id');
				$table->foreignIdFor(Chapter::class)->nullable();
				$table->string('slug')->unique();
				$table->string('title');
				$table->boolean('active')->default(false);
				$table->text('generator')->default('');
				$table->boolean('isMathOnly')->default(true);
				$table->string('output')->default("question = answer");
				$table->integer('nextLevelAfter')->default(5);
				$table->string('checker')->default("");
				$table->text('keyboard')->default('');
				$table->integer('duration')->default(5);
				$table->integer('lives')->default(3);
				$table->integer('bonusScoreLife')->default(0);
				$table->integer('bonusScoreTime')->default(0);
				$table->integer('bonusLevelLife')->default(0);
				$table->integer('bonusLevelTime')->default(0);
				$table->timestamps();
			});
		}

		public function down()
		{
			Schema::dropIfExists('challenges');
		}
	}
