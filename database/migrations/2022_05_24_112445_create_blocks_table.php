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
        Schema::create('blocks', function (Blueprint $table) {
            $table->id();
			// Optional order
			$table->integer('order')->nullable();
			// Optional title
			$table->string('title')->nullable();
			// The main body
			$table->text('body')->nullable();
			// The type determine the color of the block (definition, theorem, ...)
			$table->string('type')->default('');
			// A script code to be executed in the block scope
			$table->text('script')->nullable();
			// A script code to be executed in the block scope
			$table->boolean('switch')->nullable();
			// json data parameters.
			$table->json('json')->nullable();
			// Polymorphic one to one
			$table->morphs('blockable');
			// blur item
			$table->boolean('blur')->default(false);
			// Timestamp of the block
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
        Schema::dropIfExists('blocks');
    }
};
