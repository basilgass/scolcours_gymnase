<?php

namespace Tests\Feature\System;

use App\Models\Chapter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ScolcoursPublicTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page(): void
    {
        $this->get(route('scolcours.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page->component('HomePage'));
    }

    public function test_qrcode_page(): void
    {
        $this->get(route('qrcode.show'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page->component('QRCode'));
    }

    public function test_fullscreen_page(): void
    {
        $this->get(route('widgets.fullscreen'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page->component('WidgetFullscreen'));
    }

    public function test_search_finds_chapters_by_title(): void
    {
        Chapter::factory()->create(['title' => 'Trigonometrie de base']);

        $this->getJson(route('scolcours.search', ['type' => 'chapters', 'terms' => 'Trigo']))
            ->assertStatus(200)
            ->assertJsonFragment(['title' => 'Trigonometrie de base']);
    }

    public function test_search_ignores_terms_shorter_than_two_characters(): void
    {
        Chapter::factory()->create(['title' => 'Algebre']);

        $this->getJson(route('scolcours.search', ['type' => 'all', 'terms' => 'a']))
            ->assertStatus(200)
            ->assertExactJson([]);
    }

    public function test_grapheur_download_streams_the_svg(): void
    {
        $this->post(route('grapheur.download'), ['svg' => '<svg></svg>'])
            ->assertStatus(200)
            ->assertDownload('grapheur.svg');
    }

    public function test_grapheur_download_validates_the_svg(): void
    {
        $this->postJson(route('grapheur.download'), ['svg' => 'a'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['svg']);
    }

    public function test_word_exists_in_dictionary(): void
    {
        DB::table('dictionary')->insert(['language' => 'fr', 'word' => 'MAISON', 'common' => 1]);

        // Le contrôleur retourne un bool brut → corps "1" (vrai) / "" (faux).
        $this->assertSame('1', $this->get(route('dico.exists', ['language' => 'fr', 'word' => 'MAISON']))
            ->assertStatus(200)->getContent());

        $this->assertSame('', $this->get(route('dico.exists', ['language' => 'fr', 'word' => 'INCONNU']))
            ->assertStatus(200)->getContent());
    }

    public function test_dico_returns_words_with_the_default_size(): void
    {
        // Chemin par défaut size='infinity' : ne doit plus lever de TypeError.
        DB::table('dictionary')->insert([
            ['language' => 'fr', 'word' => 'MAISON', 'common' => 1],
            ['language' => 'fr', 'word' => 'PORTE', 'common' => 1],
        ]);

        $this->getJson(route('dico.index', ['language' => 'fr']))
            ->assertStatus(200)
            ->assertJsonCount(1); // number défaut = 1
    }

    public function test_dico_filters_words_by_length(): void
    {
        DB::table('dictionary')->insert([
            ['language' => 'fr', 'word' => 'MAISON', 'common' => 1], // 6 lettres
            ['language' => 'fr', 'word' => 'PORTE', 'common' => 1],  // 5 lettres
        ]);

        $words = $this->getJson(route('dico.index', ['language' => 'fr', 'number' => 10, 'size' => 6]))
            ->assertStatus(200)
            ->json();

        $this->assertSame(['MAISON'], $words);
    }
}
