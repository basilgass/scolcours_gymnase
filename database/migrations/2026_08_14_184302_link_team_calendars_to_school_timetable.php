<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Remplace la colonne `time` (heure brute, fragile) par une clé étrangère
     * `school_timetable_id` vers le créneau horaire, plus stable.
     */
    public function up(): void
    {
        // 1. Colonne FK temporairement nullable, le temps du backfill.
        Schema::table('team_calendars', function (Blueprint $table) {
            $table->unsignedBigInteger('school_timetable_id')->nullable()->after('day');
        });

        // 2. Backfill : associer chaque créneau à la période dont l'heure de début correspond.
        DB::table('team_calendars')->update([
            'school_timetable_id' => DB::raw(
                '(SELECT id FROM school_timetable WHERE school_timetable.start = team_calendars.time LIMIT 1)'
            ),
        ]);

        // 3. Supprimer les créneaux orphelins (aucune période correspondante) : déjà cassés.
        DB::table('team_calendars')->whereNull('school_timetable_id')->delete();

        // 4. Verrouiller la FK : non-nullable + suppression en cascade.
        Schema::table('team_calendars', function (Blueprint $table) {
            $table->unsignedBigInteger('school_timetable_id')->nullable(false)->change();
            $table->foreign('school_timetable_id')
                  ->references('id')
                  ->on('school_timetable')
                  ->cascadeOnDelete();
        });

        // 5. La colonne `time` n'a plus de raison d'être.
        Schema::table('team_calendars', function (Blueprint $table) {
            $table->dropColumn('time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('team_calendars', function (Blueprint $table) {
            $table->time('time')->nullable()->after('day');
        });

        DB::table('team_calendars')->update([
            'time' => DB::raw(
                '(SELECT start FROM school_timetable WHERE school_timetable.id = team_calendars.school_timetable_id LIMIT 1)'
            ),
        ]);

        Schema::table('team_calendars', function (Blueprint $table) {
            $table->time('time')->nullable(false)->change();
            $table->dropForeign(['school_timetable_id']);
            $table->dropColumn('school_timetable_id');
        });
    }
};
