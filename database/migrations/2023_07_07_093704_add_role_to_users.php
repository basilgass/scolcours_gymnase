<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
			$table->string('role', 20)->nullable()->after('email');
        });

		// update user Basil and Alyssia to admin
		$users = \App\Models\User::whereIn('email', ["basil@scolcours.ch", "alyssia@famillegass.ch"])->get();
		foreach ($users as $user){
			$user->role = 'admin';
			$user->update();
		}
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
