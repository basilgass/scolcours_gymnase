<?php

use App\Models\Widget;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('illustrations', function (Blueprint $table) {
            $table->foreignIdFor(Widget::class)->after('value')->nullable()->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('illustrations', function (Blueprint $table) {
            $table->dropConstrainedForeignIdFor(Widget::class);
        });
    }
};
