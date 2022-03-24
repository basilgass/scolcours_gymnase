<?php

use App\Models\Post;
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
		Schema::create('post_walkthroughs', function (Blueprint $table) {
			$table->id();
			$table->foreignIdFor(Post::class)->constrained()->cascadeOnDelete();
			$table->integer('order');
			$table->text('step');
			$table->text('resolution')->nullable();
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
		Schema::dropIfExists('walkthroughs');
	}
};
