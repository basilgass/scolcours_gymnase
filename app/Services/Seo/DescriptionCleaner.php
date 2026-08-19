<?php

namespace App\Services\Seo;

class DescriptionCleaner
{
    public const MAX_LENGTH = 155;

    /** Seuil de coupe d'un titre SEO (Google tronque l'affichage vers ~60 caractères). */
    public const TITLE_MAX_LENGTH = 60;

    /**
     * Description prête pour la balise `<meta>` : assainie puis tronquée au seuil
     * description (155). Comportement historique conservé.
     */
    public static function clean(?string $raw): string
    {
        return self::truncate(self::sanitize($raw), self::MAX_LENGTH);
    }

    /**
     * Titre prêt pour la balise `<title>` : assaini puis tronqué au seuil titre (60).
     * Utilisé sur la base variable du titre (override ou titre du modèle), jamais
     * sur le suffixe de marque.
     */
    public static function cleanTitle(?string $raw): string
    {
        return self::truncate(self::sanitize($raw), self::TITLE_MAX_LENGTH);
    }

    /**
     * Retire HTML, environnements LaTeX (délimiteurs ET contenu), commandes
     * résiduelles et annotations Markdown custom, puis normalise les espaces.
     * Ne tronque pas : la troncature est spécifique au contexte (titre vs description).
     */
    public static function sanitize(?string $raw): string
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

        return trim(preg_replace('/\s+/', ' ', $text));
    }

    /**
     * Détecte la présence de contenu mathématique dans une source brute (délimiteurs
     * LaTeX `\[ \] \( \)`, `$...$`, ou commande `\cmd`). Sert au signal d'audit
     * « ce titre/cette description a subi un strip math » : à évaluer sur le BRUT,
     * jamais sur le texte déjà assaini (où le math a déjà disparu).
     */
    public static function containsMath(?string $raw): bool
    {
        if ($raw === null) {
            return false;
        }

        return preg_match('/\\\\\[.*?\\\\\]/s', $raw) === 1
            || preg_match('/\\\\\(.*?\\\\\)/s', $raw) === 1
            || preg_match('/\$[^$]*\$/', $raw) === 1
            || preg_match('/\\\\[a-zA-Z]+/', $raw) === 1;
    }

    /**
     * Tronque sur une frontière de mot et ajoute une ellipse si la longueur dépasse
     * le seuil. Renvoie le texte inchangé sinon.
     */
    private static function truncate(string $text, int $max): string
    {
        if (mb_strlen($text) <= $max) {
            return $text;
        }

        $cut = mb_substr($text, 0, $max);
        $lastSpace = mb_strrpos($cut, ' ');

        if ($lastSpace !== false) {
            $cut = mb_substr($cut, 0, $lastSpace);
        }

        return rtrim($cut, ' ,.;:') . '…';
    }
}
