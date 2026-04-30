<?php

use App\Services\PseudoGenerator;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('pseudo')->nullable()->after('email');
            $table->boolean('show_real_name')->default(false)->after('pseudo');
        });

        DB::table('users')->orderBy('id')->each(function (object $user) {
            $pseudo = PseudoGenerator::generateUnique();
            DB::table('users')->where('id', $user->id)->update(['pseudo' => $pseudo]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->unique('pseudo');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['pseudo']);
            $table->dropColumn(['pseudo', 'show_real_name']);
        });
    }
};