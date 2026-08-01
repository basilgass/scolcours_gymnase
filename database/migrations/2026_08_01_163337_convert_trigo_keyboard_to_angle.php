<?php

use App\Support\TrigoKeyboardRename;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
	/**
	 * Convertit les tokens clavier `trigo` en `angle` dans les tables qui stockent
	 * une configuration clavier (renommage TrigoChecker -> AngleChecker).
	 */
	private const TABLES = ['questions', 'generators'];

	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		foreach (self::TABLES as $table) {
			DB::table($table)
				->where('keyboard', 'like', '%trigo%')
				->orderBy('id')
				->chunkById(200, function ($rows) use ($table) {
					foreach ($rows as $row) {
						$converted = TrigoKeyboardRename::toAngle($row->keyboard);

						if ($converted !== $row->keyboard) {
							DB::table($table)
								->where('id', $row->id)
								->update(['keyboard' => $converted]);
						}
					}
				});
		}
	}

	/**
	 * Reverse the migrations.
	 *
	 * Migration forward-only : l'alias `angle` peut préexister à cette conversion,
	 * un reverse `angle` -> `trigo` corromprait donc des données légitimes. On ne
	 * restaure rien volontairement.
	 */
	public function down(): void
	{
		// Aucune action : voir la note ci-dessus.
	}
};
