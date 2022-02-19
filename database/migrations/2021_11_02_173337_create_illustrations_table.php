<?php
	
	use Illuminate\Database\Migrations\Migration;
	use Illuminate\Database\Schema\Blueprint;
	use Illuminate\Support\Facades\Schema;
	
	class CreateIllustrationsTable extends Migration
	{
		public function up()
		{
			Schema::create('illustrations', function (Blueprint $table) {
				$table->bigIncrements('id');
				$table->string('title');
				$table->string('type');
				$table->string('code');
				$table->timestamps();
			});
		}
		
		public function down()
		{
			Schema::dropIfExists('illustrations');
		}
	}
