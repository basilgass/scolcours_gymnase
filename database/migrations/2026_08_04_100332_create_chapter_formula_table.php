<?php

use App\Models\Chapter;
use App\Models\Formula;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Passage de Formula belongsTo Chapter à un belongsToMany : la formule devient
	 * l'entité canonique (source de vérité), rattachée à plusieurs chapitres via ce pivot.
	 * L'ordre d'affichage étant propre à chaque chapitre, il vit sur le pivot.
	 *
	 * Cette migration mêle volontairement DDL et DML pour préserver de façon atomique
	 * les rattachements existants (formulas.chapter_id / formulas.order) avant de
	 * supprimer les colonnes correspondantes.
	 */
	public function up(): void
	{
		Schema::create('chapter_formula', function (Blueprint $table) {
			$table->id();
			$table->foreignIdFor(Chapter::class)->constrained()->cascadeOnDelete();
			$table->foreignIdFor(Formula::class)->constrained()->cascadeOnDelete();
			$table->integer('order')->nullable();
			$table->timestamps();
			$table->unique(['chapter_id', 'formula_id']);
		});

		foreach (DB::table('formulas')->get() as $formula) {
			DB::table('chapter_formula')->insert([
				'chapter_id' => $formula->chapter_id,
				'formula_id' => $formula->id,
				'order'      => $formula->order,
				'created_at' => now(),
				'updated_at' => now(),
			]);
		}

		Schema::table('formulas', function (Blueprint $table) {
			$table->dropConstrainedForeignIdFor(Chapter::class);
			$table->dropColumn('order');
		});
	}

	public function down(): void
	{
		Schema::table('formulas', function (Blueprint $table) {
			$table->foreignIdFor(Chapter::class)->nullable()->constrained();
			$table->integer('order')->nullable();
		});

		foreach (DB::table('chapter_formula')->get() as $pivot) {
			DB::table('formulas')
			  ->where('id', $pivot->formula_id)
			  ->whereNull('chapter_id')
			  ->update([
				  'chapter_id' => $pivot->chapter_id,
				  'order'      => $pivot->order,
			  ]);
		}

		Schema::dropIfExists('chapter_formula');
	}
};
