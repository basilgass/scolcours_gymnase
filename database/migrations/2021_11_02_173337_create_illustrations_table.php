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
			$table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
			$table->string('url');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('illustrations');
    }
}
