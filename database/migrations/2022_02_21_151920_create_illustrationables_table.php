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
        Schema::create('illustrationables', function (Blueprint $table) {
            $table->id();
			$table->foreignId('illustration_id')->constrained()->cascadeOnDelete();
	        $table->integer('illustrationable_id');
	        $table->string('illustrationable_type');
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
        Schema::dropIfExists('illustrationables');
    }
};
