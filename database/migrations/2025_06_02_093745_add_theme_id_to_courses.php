<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
			$table->foreignId('theme_id')->after('slug')->nullable()->constrained();
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
			$table->dropForeign(['theme_id']);
			$table->dropColumn('theme_id');
        });
    }
};
