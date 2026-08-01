<?php

namespace App\Support;

/**
 * Convertit les anciens tokens clavier `trigo` en `angle` (renommage TrigoChecker -> AngleChecker).
 *
 * La transformation est *token-aware* : elle ne remplace `trigo` que lorsqu'il forme un token
 * complet (délimité par le début/`,`/`\n`/`:` à gauche et la fin/`,`/`\n` à droite). Cela couvre
 * à la fois le layout `trigo` et l'override `checker:trigo`, tout en épargnant le texte libre
 * (ex. « rapport trigonométrique » dans une réponse QCM).
 */
class TrigoKeyboardRename
{
	/**
	 * Remplace chaque token `trigo` par `angle` dans une chaîne de configuration clavier.
	 */
	public static function toAngle(string $keyboard): string
	{
		return preg_replace('/(?<=^|[,\n:])trigo(?=$|[,\n])/', 'angle', $keyboard) ?? $keyboard;
	}
}
