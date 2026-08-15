<?php

namespace Tests\Feature\Seo;

use App\Models\Tool;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HasMetaTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_model_has_no_meta_by_default(): void
    {
        $tool = Tool::factory()->create();

        $this->assertNull($tool->meta);
    }

    public function test_a_model_can_store_and_read_its_meta(): void
    {
        $tool = Tool::factory()->create();

        $tool->meta()->create([
            'meta_title'       => 'Titre SEO',
            'meta_description' => 'Description SEO',
        ]);

        $this->assertSame('Titre SEO', $tool->fresh()->meta->meta_title);
        $this->assertSame('Description SEO', $tool->fresh()->meta->meta_description);
    }
}
