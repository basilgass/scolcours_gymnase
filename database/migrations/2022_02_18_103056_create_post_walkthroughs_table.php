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
        Schema::create('post_walkthroughs', function (Blueprint $table) {
            $table->id();
	        $table->foreignId('post_id')->constrained()->cascadeOnDelete();
			$table->integer('order');
			$table->text('step');
			$table->text('resolution');
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