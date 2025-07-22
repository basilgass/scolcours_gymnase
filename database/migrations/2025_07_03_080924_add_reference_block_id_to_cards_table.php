<?php

use App\Models\Block;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::table('cards', function (Blueprint $table) {
			$table->string('reference_block_splitter')
			      ->after('order')
			      ->nullable();

			$table->foreignIdFor(Block::class, 'reference_block_id')
			      ->after('order')
			      ->nullable()->cascadeOnDelete();

		});
	}

	public function down(): void
	{
		Schema::table('cards', function (Blueprint $table) {
			$table->dropColumn('reference_block_id');
			$table->dropColumn('reference_block_splitter');
		});
	}
};
