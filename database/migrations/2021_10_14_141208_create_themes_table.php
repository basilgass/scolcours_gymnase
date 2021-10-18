<?php

use App\Models\Theme;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThemesTable extends Migration
{
    public function up()
    {
        Schema::create('themes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('slug');
            $table->string('title');
            $table->string('color')->default('scolcours-main');
            $table->string('icon')->nullable();
            $table->boolean('enabled')->default(true);
            //

            $table->timestamps();
        });

        Theme::create( [
            'slug'  => 'algebre',
            'title'  => 'algèbre',
            'color' => 'bg-blue-500',
            'icon' => 'calculator'
        ] );
        Theme::create( [
            'slug'  => 'analyse',
            'title'  => 'analyse',
            'color' => 'bg-amber-500',
            'icon' => 'graph-up'
        ] );
        Theme::create( [
            'slug'  => 'geometrie',
            'title'  => 'géométrie',
            'color' => 'bg-purple-500',
            'icon' => 'triangle'
        ] );
        Theme::create( [
            'slug'  => 'statistiques',
            'title'  => 'statistiques',
            'color' => 'bg-cyan-500',
            'icon' => 'percent'
        ] );
        Theme::create( [
                'slug'  => 'jeux',
                'title'  => 'jeux',
                'color' => 'bg-orange-500',
                'icon' => 'controller'
            ]
        );
        Theme::create( [
                'slug'  => 'tools',
                'title'  => 'boîte à outils',
                'color' => 'bg-pink-200',
                'icon' => 'wrench'
            ]
        );

        // Save it as cache.
        cache()->forget( 'themes');
    }

    public function down()
    {
        Schema::dropIfExists('themes');
    }
}
