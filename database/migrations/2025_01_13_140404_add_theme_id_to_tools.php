<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('tools', function (Blueprint $table) {
            $table->foreignId('theme_id')->after('parameters')->nullable()->constrained();
        });
    }

    public function down(): void
    {
        Schema::table('tools', function (Blueprint $table) {
            $table->dropForeign(['theme_id']);
			$table->dropColumn('theme_id');
        });
    }
};
