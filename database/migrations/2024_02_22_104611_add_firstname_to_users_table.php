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
            $table->string('firstname')->after('name');
        });

		// Split the name column into first name and last name at "."
		DB::table('users')->update(['firstname' => DB::raw('SUBSTRING_INDEX(name, ".", 1)')]);
		DB::table('users')->update(['name' => DB::raw('SUBSTRING_INDEX(name, ".", -1)')]);

		\App\Models\User::all()->each(function ($user) {
			$user->update([
				'name' => ucwords($user->name),
				'firstname' => ucwords($user->firstname)
			]);
		});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Copy the username to name
			DB::table('users')->update(['name' => DB::raw('CONCAT(firstname, ".", name)')]);

			// Drop the username column
			$table->dropColumn('firstname');

			\App\Models\User::all()->each(function ($user) {
				$user->update(['name' => Str::lower($user->name)]);
			});

        });
    }
};
