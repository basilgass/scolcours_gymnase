<?php

namespace Tests\Unit\Seo;

use App\Services\Seo\DescriptionCleaner;
use PHPUnit\Framework\TestCase;

class DescriptionCleanerTest extends TestCase
{
    public function test_null_and_empty_yield_empty_string(): void
    {
        $this->assertSame('', DescriptionCleaner::clean(null));
        $this->assertSame('', DescriptionCleaner::clean('   '));
    }

    public function test_strips_html_and_collapses_whitespace(): void
    {
        $this->assertSame(
            'Un texte simple.',
            DescriptionCleaner::clean("<p>Un   texte\n<strong>simple</strong>.</p>")
        );
    }

    public function test_strips_inline_latex_and_commands(): void
    {
        $result = DescriptionCleaner::clean('La dérivée $f(x)=x^2$ et \\frac{a}{b} ici.');

        $this->assertStringNotContainsString('$', $result);
        $this->assertStringNotContainsString('\\frac', $result);
        $this->assertStringContainsString('La dérivée', $result);
        $this->assertStringContainsString('ici.', $result);
    }

    public function test_truncates_on_a_word_boundary_with_ellipsis(): void
    {
        $long = str_repeat('mot ', 100); // 400 chars

        $result = DescriptionCleaner::clean($long);

        $this->assertLessThanOrEqual(156, mb_strlen($result));
        $this->assertStringEndsWith('…', $result);
        $this->assertStringNotContainsString('mo…', $result); // pas de coupe en plein mot
    }

    public function test_strips_display_math_environment_entirely(): void
    {
        // \[ ... \] : délimiteurs ET contenu retirés, texte adjacent conservé.
        $result = DescriptionCleaner::clean('Extension de la notion \\[ \\sqrt[5]{32^2} = 4 \\]');

        $this->assertSame('Extension de la notion', $result);
    }

    public function test_strips_inline_parenthesis_math_without_leaving_soup(): void
    {
        // \( ... \) : aucun résidu d'opérateurs ou d'exposants (ex-bouillie "^2( )+ ^2( )=1").
        $result = DescriptionCleaner::clean('Identité \\(\\sin^2(\\alpha)+\\cos^2(\\alpha)=1\\) fondamentale.');

        $this->assertSame('Identité fondamentale.', $result);
    }

    public function test_strips_custom_attribute_annotations(): void
    {
        // Annotations Markdown custom "{.@info}" : purement techniques, pas du contenu.
        $result = DescriptionCleaner::clean('Cercle de centre O et de rayon 6 {.@info}');

        $this->assertSame('Cercle de centre O et de rayon 6', $result);
    }
}
