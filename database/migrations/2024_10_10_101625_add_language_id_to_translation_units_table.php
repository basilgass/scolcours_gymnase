<?php

use App\Models\TranslationBook;
use App\Models\TranslationUnit;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('translation_units', function (Blueprint $table) {
            $table->foreignIdFor(TranslationBook::class)->after('id')->nullable()->constrained()->cascadeOnDelete();
        });

        TranslationUnit::where('unit', 'LIKE', 'unita%')->update([
            "translation_book_id" => 1
        ]);

        TranslationUnit::where('unit', 'LIKE', 'libro%')->update([
            "translation_book_id" => 3
        ]);

        TranslationUnit::where('unit', 'LIKE', 'Life%')->update([
            "translation_book_id" => 4
        ]);

        TranslationUnit::where('unit', 'LIKE', '%nathan%')->update([
            "translation_book_id" => 5
        ]);

        TranslationUnit::where('unit', 'LIKE', 'extra%')->update([
            "translation_book_id" => 6
        ]);


        TranslationUnit::where('unit', 'LIKE', 'genial%')->update([
            "translation_book_id" => 7
        ]);

    }

    public function down(): void
    {
        Schema::table('translation_units', function (Blueprint $table) {
            $table->dropForeign(['translation_book_id']);
            $table->dropColumn('translation_book_id');
        });
    }
};
