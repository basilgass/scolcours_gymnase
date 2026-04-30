<?php

namespace App\Services;

use App\Models\User;

class PseudoGenerator
{
    private static array $creatures = [
        'Dragon', 'Licorne', 'Griffon', 'Chimere', 'Phenix',
        'Centaure', 'Hydre', 'Minotaure', 'Sirene', 'Satyre',
        'Kraken', 'Manticore', 'Basilic', 'Golem', 'Nymphe',
        'Gnome', 'Ogre', 'Faune', 'Sphinx', 'Cyclope',
    ];

    private static array $colors = [
        'Rouge', 'Bleu', 'Vert', 'Noir', 'Blanc',
        'Dore', 'Argente', 'Pourpre', 'Azur', 'Ecarlate',
        'Violet', 'Ambre', 'Jade', 'Obsidien', 'Ivoire',
        'Cobalt', 'Rubis', 'Emeraude', 'Topaze', 'Saphir',
    ];

    public static function generate(): string
    {
        $creature = self::$creatures[array_rand(self::$creatures)];
        $number   = str_pad((string) random_int(10, 99), 2, '0', STR_PAD_LEFT);
        $color    = self::$colors[array_rand(self::$colors)];

        return $creature . $number . $color;
    }

    public static function generateUnique(): string
    {
        do {
            $pseudo = self::generate();
        } while (User::where('pseudo', $pseudo)->exists());

        return $pseudo;
    }
}