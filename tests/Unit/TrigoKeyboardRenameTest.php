<?php

namespace Tests\Unit;

use App\Support\TrigoKeyboardRename;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class TrigoKeyboardRenameTest extends TestCase
{
	/**
	 * @return array<string, array{string, string}>
	 */
	public static function keyboardProvider(): array
	{
		return [
			// [entrée, attendu]
			'layout seul'                 => ['trigo', 'angle'],
			'layout avec paramètre'       => ['trigo,p-', 'angle,p-'],
			'layout avec checker:frac intact' => ['trigo,p,deg,checker:frac,r', 'angle,p,deg,checker:frac,r'],
			'layout avec @checker'        => ['trigo,p,d,@checker:nb,2', 'angle,p,d,@checker:nb,2'],
			'override checker:trigo'      => ['sol,checker:trigo,p', 'sol,checker:angle,p'],
			'trigo sur une autre ligne'   => ["frac,r\n\ntrigo", "frac,r\n\nangle"],
			'texte libre QCM épargné'     => [
				"Qcm\n@full\n4|j'ai utilisé le mauvais rapport trigonométrique",
				"Qcm\n@full\n4|j'ai utilisé le mauvais rapport trigonométrique",
			],
			'chaîne vide'                 => ['', ''],
			'sans trigo'                  => ['frac,r', 'frac,r'],
		];
	}

	#[DataProvider('keyboardProvider')]
	public function test_converts_trigo_tokens_to_angle(string $input, string $expected): void
	{
		$this->assertSame($expected, TrigoKeyboardRename::toAngle($input));
	}
}
