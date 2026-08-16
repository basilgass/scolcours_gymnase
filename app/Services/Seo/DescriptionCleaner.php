<?php

namespace App\Services\Seo;

class DescriptionCleaner
{
    public const MAX_LENGTH = 155;

    public static function clean(?string $raw): string
    {
        if ($raw === null) {
            return '';
        }

        $text = strip_tags($raw);
        // Environnements mathématiques complets : délimiteurs ET contenu.
        $text = preg_replace('/\\\\\[.*?\\\\\]/s', ' ', $text); // \[ ... \]
        $text = preg_replace('/\\\\\(.*?\\\\\)/s', ' ', $text); // \( ... \)
        // LaTeX inline $...$
        $text = preg_replace('/\$[^$]*\$/', ' ', $text);
        // Commandes résiduelles \cmd ou \cmd{...}
        $text = preg_replace('/\\\\[a-zA-Z]+\s*(\{[^}]*\})?/', ' ', $text);
        // Annotations Markdown custom du type {.@info}, {.@warning}, etc.
        $text = preg_replace('/\{\.@[^}]*\}/', ' ', $text);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5);
        $text = trim(preg_replace('/\s+/', ' ', $text));

        if (mb_strlen($text) <= self::MAX_LENGTH) {
            return $text;
        }

        $cut = mb_substr($text, 0, self::MAX_LENGTH);
        $lastSpace = mb_strrpos($cut, ' ');

        if ($lastSpace !== false) {
            $cut = mb_substr($cut, 0, $lastSpace);
        }

        return rtrim($cut, " ,.;:") . '…';
    }
}
