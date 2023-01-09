<?php

use App\Models\User;
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
        Schema::create('scores', function (Blueprint $table) {
            $table->id();

			$table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
			$table->morphs('scoreable');
			$table->integer('score');
			$table->integer('stars')->nullable();
            $table->timestamps();

			$table->unique(['user_id', 'scoreable_id', 'scoreable_type']);
        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('scores');
    }
};
