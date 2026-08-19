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

    public function test_sanitize_strips_math_without_truncating(): void
    {
        // sanitize() assainit mais ne tronque jamais : un texte long reste intégral.
        $long = str_repeat('mot ', 100); // 400 chars

        $this->assertSame(trim($long), DescriptionCleaner::sanitize($long));
        $this->assertSame(
            'Identité fondamentale.',
            DescriptionCleaner::sanitize('Identité \\(\\sin^2(\\alpha)=1\\) fondamentale.')
        );
    }

    public function test_clean_title_strips_math_and_truncates_at_sixty(): void
    {
        // Titre : LaTeX retiré, puis coupe sur frontière de mot au seuil titre (60).
        $this->assertSame('fonctions', DescriptionCleaner::cleanTitle('fonctions \\(\\ln(x)\\)'));

        $long = str_repeat('mot ', 100);
        $result = DescriptionCleaner::cleanTitle($long);

        $this->assertLessThanOrEqual(DescriptionCleaner::TITLE_MAX_LENGTH + 1, mb_strlen($result));
        $this->assertStringEndsWith('…', $result);
    }

    public function test_contains_math_detects_latex_delimiters_and_commands(): void
    {
        $this->assertTrue(DescriptionCleaner::containsMath('matrices \\(a_{ij}\\)'));
        $this->assertTrue(DescriptionCleaner::containsMath('bloc \\[ x^2 \\] final'));
        $this->assertTrue(DescriptionCleaner::containsMath('la dérivée $f(x)$'));
        $this->assertTrue(DescriptionCleaner::containsMath('somme \\sum des termes'));

        $this->assertFalse(DescriptionCleaner::containsMath('Un titre parfaitement normal.'));
        $this->assertFalse(DescriptionCleaner::containsMath(null));
    }
}
