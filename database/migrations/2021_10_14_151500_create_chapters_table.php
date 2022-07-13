<?php

use App\Models\Theme;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChaptersTable extends Migration
{
    public function up()
    {
        Schema::create('chapters', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignIdFor(Theme::class)->constrained()->cascadeOnDelete();
            $table->string('slug');
            $table->string('title');
			$table->boolean('active')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('chapters');
    }
}
