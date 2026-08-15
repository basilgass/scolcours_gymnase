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
}
