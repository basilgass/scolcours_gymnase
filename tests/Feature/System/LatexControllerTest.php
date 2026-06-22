<?php

namespace Tests\Feature\System;

use App\Models\LatexPdf;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LatexControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_links_lists_all_generated_pdfs(): void
    {
        LatexPdf::factory()->create(['name' => 'premier.pdf']);
        LatexPdf::factory()->create(['name' => 'second.pdf']);

        $this->getJson(route('latex.links'))
            ->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['name' => 'premier.pdf']);
    }

    public function test_download_returns_the_file_for_an_existing_slug(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('pdf/divers/abcd/abcd.pdf', '%PDF-1.4 contenu');

        LatexPdf::factory()->create([
            'slug' => 'abcd',
            'name' => 'mon-document.pdf',
            'url'  => 'pdf/divers/abcd/abcd.pdf',
        ]);

        $this->get(route('latex.download', 'abcd'))
            ->assertStatus(200)
            ->assertDownload('mon-document.pdf');
    }

    public function test_download_returns_an_empty_body_for_an_unknown_slug(): void
    {
        // Le contrôleur retourne false → réponse 200 au corps vide.
        $response = $this->get(route('latex.download', 'zzzz'))
            ->assertStatus(200);

        $this->assertSame('', $response->getContent());
    }

    public function test_latex_validates_required_fields(): void
    {
        $this->postJson(route('latex.pdf'), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['template', 'title', 'slug']);
    }

    public function test_latex_rejects_an_unknown_template(): void
    {
        $this->postJson(route('latex.pdf'), [
            'template' => 'latex.malicious',
            'title'    => 'Titre',
            'slug'     => 'titre',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['template']);
    }
}
