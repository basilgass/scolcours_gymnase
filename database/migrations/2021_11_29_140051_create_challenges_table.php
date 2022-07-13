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
				$table->timestamps();
			});
		}

		public function down()
		{
			Schema::dropIfExists('challenges');
		}
	}
