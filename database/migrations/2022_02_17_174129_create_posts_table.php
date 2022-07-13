<?php

use App\Models\Chapter;
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
				// Theme associated with
				$table->foreignIdFor(Chapter::class)->constrained()->cascadeOnDelete();
				// Title of the post - required
				$table->string('title');
				// Default position of the post. If not provided, ordered by id.
				$table->integer('position')->default(0);
				// Determine the number of "blocks" visible by default. Zero means all.
				$table->integer('numberOfVisibleBlocks')->default(0);
				// Determine if the post is active / visible for not admin users
				$table->boolean('active')->default(true);
				// Make a script to output random data.
				$table->text('script')->default("");
				// Make a switch to toggle some informations.
				$table->string('switch')->nullable();
				// Timestamps
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
			Schema::disableForeignKeyConstraints();
			Schema::dropIfExists('posts');
			Schema::enableForeignKeyConstraints();
		}
	};
