<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('chapter_user', function (Blueprint $table) {
            $table->dropColumn('open');
        });
    }

    public function down(): void
    {
        Schema::table('chapter_user', function (Blueprint $table) {
            $table->boolean('open')->after('user_id')->nullable();
        });
    }
};
