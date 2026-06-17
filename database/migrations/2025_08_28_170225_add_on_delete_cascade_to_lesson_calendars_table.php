<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		// Modification d'une FK existante : non supportée par SQLite (drop par nom +
		// ajout de FK sur table existante). La FK d'origine suffit pour les tests.
		if (Schema::getConnection()->getDriverName() !== 'mysql') {
			return;
		}

		Schema::table('lesson_calendars', function (Blueprint $table) {
			$table->dropForeign('calendars_lesson_id_foreign');
		});

		Schema::table('lesson_calendars', function (Blueprint $table) {
			$table
				->foreign('lesson_id')
				->references('id')->on('lessons')
				->cascadeOnDelete();
		});

	}

	public function down(): void
	{
		Schema::table('lesson_calendars', function (Blueprint $table) {
			// Nothing to do back.
		});
	}
};
