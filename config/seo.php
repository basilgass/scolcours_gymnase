<?php

use App\Models\Challenge;
use App\Models\Deck;
use App\Models\Generator;
use App\Models\Theme;
use App\Models\Tool;

return [
    // Suffixe commun à tous les titres.
    'suffix' => 'Scolcours',

    // Libellé de contexte inséré dans le titre, par type de modèle.
    // (Chapter est un cas à part : contexte = nom du thème.)
    'labels' => [
        Theme::class     => 'Thème',
        Tool::class      => 'Outil',
        Deck::class      => 'Cartes',
        Challenge::class => 'Défi',
        Generator::class => 'Exercices',
    ],

    // Pages sans modèle (accueil + index) : clé = 'home' ou nom de route.
    'static' => [
        'home' => [
            'title'       => 'Scolcours — mathématiques au gymnase',
            'description' => 'Cours, exercices interactifs et outils de mathématiques pour le gymnase.',
        ],
        'chapters.index' => [
            'title'       => 'Chapitres | Scolcours',
            'description' => 'Tous les chapitres de mathématiques du gymnase.',
        ],
        'posts.index' => [
            'title'       => 'Articles | Scolcours',
            'description' => 'Les articles de cours de mathématiques.',
        ],
        'tools.index' => [
            'title'       => 'Outils | Scolcours',
            'description' => 'Outils interactifs de mathématiques : graphes, calculs, illustrations.',
        ],
        'decks.index' => [
            'title'       => 'Cartes | Scolcours',
            'description' => 'Jeux de cartes de révision de mathématiques.',
        ],
        'challenges.index' => [
            'title'       => 'Défis | Scolcours',
            'description' => 'Défis de mathématiques à résoudre.',
        ],
        'generators.index' => [
            'title'       => 'Exercices | Scolcours',
            'description' => 'Générateurs d\'exercices de mathématiques avec correction.',
        ],
        'formulas.index' => [
            'title'       => 'Formulaire | Scolcours',
            'description' => 'Formulaire de mathématiques du gymnase.',
        ],
    ],
];
