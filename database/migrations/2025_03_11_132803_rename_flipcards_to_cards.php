<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use \Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
		Schema::rename('flipcards', 'cards');

		DB::statement("UPDATE blocks SET blockable_type=? WHERE blockable_type=?", [
			"App\\Models\\Card",
			"App\\Models\\Flipcard"
		]);
    }

    public function down(): void
    {
		Schema::rename('cards', 'flipcards');
		DB::statement("UPDATE blocks SET blockable_type=? WHERE blockable_type=?", [
			"App\\Models\\Flipcard",
			"App\\Models\\Card"
		]);
    }
};
