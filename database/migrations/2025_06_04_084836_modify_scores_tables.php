<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('scores', function (Blueprint $table) {
			$table->json('data')->after('level')->nullable();
			$table->integer('attempts')->after('level')->nullable();
			$table->boolean('is_resolved')->after('level')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('scores', function (Blueprint $table) {
            $table->removeColumn('is_resolved');
            $table->removeColumn('attempts');
            $table->removeColumn('data');
        });
    }
};
