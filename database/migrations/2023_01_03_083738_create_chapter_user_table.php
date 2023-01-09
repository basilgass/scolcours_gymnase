<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chapter_user', function (Blueprint $table) {
            $table->id();

			$table->foreignIdFor(\App\Models\Chapter::class)->constrained()->cascadeOnDelete();
			$table->foreignIdFor(\App\Models\User::class)->constrained()->cascadeOnDelete();

			$table->boolean('open')->nullable();	// determine if the chapter is open for this user
			$table->foreignIdFor(\App\Models\Post::class)->constrained()->cascadeOnDelete();	// current post id

			$table->timestamps();

			$table->unique(['user_id', 'chapter_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chapter_user');
    }
};
