<?php

use App\Models\Chapter;
use App\Models\PostTemplate;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
		/**
		 * Run the migrations.
		 *
		 * @return void
		 */
		public function up()
		{
			Schema::create('posts', function (Blueprint $table) {
				$table->id();
				$table->foreignIdFor(Chapter::class)->constrained()->cascadeOnDelete();
				$table->foreignIdFor(PostTemplate::class)->constrained();
				$table->string('post_template_params')->nullable();
				$table->string('title')->nullable();
				$table->text('body');
				$table->timestamps();
			});
		}

		/**
		 * Reverse the migrations.
		 *
		 * @return void
		 */
		public function down()
		{
			Schema::dropIfExists('posts');
		}
	};
