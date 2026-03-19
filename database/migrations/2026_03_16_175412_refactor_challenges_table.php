<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('challenges', function (Blueprint $table) {
            $table->string('type')->default('classic')->after('active');
            $table->renameColumn('duration', 'time_limit');
            $table->dropColumn([
                'maxLevel',
                'nextLevelAfter',
                'durationByQuestion',
                'generatorsGrouping',
                'bonusScoreTrigger',
                'bonusScoreLife',
                'bonusScoreTime',
                'bonusLevelLife',
                'bonusLevelTime',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('challenges', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->renameColumn('time_limit', 'duration');
            $table->integer('maxLevel')->default(3);
            $table->integer('nextLevelAfter')->default(5);
            $table->integer('durationByQuestion')->nullable();
            $table->tinyInteger('generatorsGrouping')->nullable();
            $table->integer('bonusScoreTrigger')->nullable();
            $table->integer('bonusScoreLife')->default(0);
            $table->integer('bonusScoreTime')->default(0);
            $table->integer('bonusLevelLife')->default(0);
            $table->integer('bonusLevelTime')->default(0);
        });
    }
};
