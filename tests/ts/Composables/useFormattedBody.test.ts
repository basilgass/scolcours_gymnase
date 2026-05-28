import {describe, expect, test, vi} from "vitest"
import {ref} from "vue"
import {BodyTrigger, defaultBodyTriggers, useFormattedBody} from "@/Composables/useHelpers.ts"

describe('useFormattedBody — cas de base', () => {
	test('retourne null si body est null', () => {
		expect(useFormattedBody(null, ref({}))).toBeNull()
	})

	test('retourne le body inchangé si values est null', () => {
		expect(useFormattedBody('hello', ref(null))).toBe('hello')
	})

	test('remplace une clé simple sans contexte', () => {
		expect(useFormattedBody('valeur = $a', ref({a: '42'}))).toBe('valeur = 42')
	})

	test('remplace plusieurs clés', () => {
		expect(useFormattedBody('$a et $b', ref({a: 'X', b: 'Y'}))).toBe('X et Y')
	})

	test('plusieurs occurrences de la même clé', () => {
		expect(useFormattedBody('$a + $a', ref({a: '7'}))).toBe('7 + 7')
	})

	test('clé absente du dictionnaire reste telle quelle', () => {
		expect(useFormattedBody('$a et $z', ref({a: '1'}))).toBe('1 et $z')
	})

	test('accepte un Ref<string> en body', () => {
		expect(useFormattedBody(ref('val = $a'), ref({a: '3'}))).toBe('val = 3')
	})
})

describe('useFormattedBody — collapse de signes (sans espace)', () => {
	test('-$b avec valeur négative : -- => +', () => {
		expect(useFormattedBody('-$b', ref({b: '-3'}))).toBe('+3')
	})

	test('-$b avec valeur positive (explicite) : -+ => -', () => {
		expect(useFormattedBody('-$b', ref({b: '+3'}))).toBe('-3')
	})

	test('-$b avec valeur sans signe : reste tel quel', () => {
		expect(useFormattedBody('-$b', ref({b: '3'}))).toBe('-3')
	})

	test('+$b avec valeur négative : +- => -', () => {
		expect(useFormattedBody('+$b', ref({b: '-3'}))).toBe('-3')
	})

	test('+$b avec valeur positive (explicite) : ++ => +', () => {
		expect(useFormattedBody('+$b', ref({b: '+3'}))).toBe('+3')
	})

	test('+$b avec valeur sans signe : reste tel quel', () => {
		expect(useFormattedBody('+$b', ref({b: '3'}))).toBe('+3')
	})

	test('expression complète : $a -$b avec deux négatifs', () => {
		expect(useFormattedBody('$a -$b', ref({a: '-2', b: '-3'}))).toBe('-2 +3')
	})

	test('expression dans contexte LaTeX', () => {
		expect(useFormattedBody('\\( -$b \\)', ref({b: '-3'}))).toBe('\\( +3 \\)')
	})
})

describe('useFormattedBody — parenthésage conditionnel (- avec espace, sortie LaTeX par défaut)', () => {
	test('- $b avec valeur négative : parenthèses LaTeX ajoutées', () => {
		expect(useFormattedBody('- $b', ref({b: '-3'}))).toBe('- \\left(-3\\right)')
	})

	test('- $b avec valeur positive : pas de parenthèses', () => {
		expect(useFormattedBody('- $b', ref({b: '3'}))).toBe('- 3')
	})

	test('- $b avec valeur positive explicite (+) : pas de parenthèses', () => {
		expect(useFormattedBody('- $b', ref({b: '+3'}))).toBe('- +3')
	})

	test('contexte LaTeX avec valeur négative', () => {
		expect(useFormattedBody('\\( - $b \\)', ref({b: '-3'}))).toBe('\\( - \\left(-3\\right) \\)')
	})

	test('contexte LaTeX avec valeur positive', () => {
		expect(useFormattedBody('\\( - $b \\)', ref({b: '3'}))).toBe('\\( - 3 \\)')
	})

	test('parenthèses auto-dimensionnées sur une fraction', () => {
		expect(useFormattedBody('- $b', ref({b: '-\\frac{2}{3}'})))
			.toBe('- \\left(-\\frac{2}{3}\\right)')
	})
})

describe('useFormattedBody — parenthésage conditionnel (\\cdot avec espace, sortie LaTeX)', () => {
	test('\\cdot $b avec valeur négative : parenthèses LaTeX ajoutées', () => {
		expect(useFormattedBody('\\cdot $b', ref({b: '-3'}))).toBe('\\cdot \\left(-3\\right)')
	})

	test('\\cdot $b avec valeur positive : pas de parenthèses', () => {
		expect(useFormattedBody('\\cdot $b', ref({b: '3'}))).toBe('\\cdot 3')
	})

	test('contexte LaTeX complet', () => {
		expect(useFormattedBody('\\( $a \\cdot $b \\)', ref({a: '2', b: '-3'})))
			.toBe('\\( 2 \\cdot \\left(-3\\right) \\)')
	})
})

describe('useFormattedBody — sortie non-LaTeX (latexOutput = false)', () => {
	test('- $b avec valeur négative : parenthèses simples', () => {
		expect(useFormattedBody('- $b', ref({b: '-3'}), false)).toBe('- (-3)')
	})

	test('\\cdot $b avec valeur négative : parenthèses simples', () => {
		expect(useFormattedBody('\\cdot $b', ref({b: '-3'}), false)).toBe('\\cdot (-3)')
	})

	test('valeur positive : aucune parenthèse même en mode non-LaTeX', () => {
		expect(useFormattedBody('- $b', ref({b: '3'}), false)).toBe('- 3')
	})

	test('collapse fonctionne identiquement en mode non-LaTeX', () => {
		expect(useFormattedBody('-$b', ref({b: '-3'}), false)).toBe('+3')
	})

	test('cas illustration : code numérique sans LaTeX', () => {
		// Cas réaliste : un widget reçoit du code à exécuter, pas du markup math.
		expect(useFormattedBody('plot($a, $b)', ref({a: '-2', b: '-3'}), false))
			.toBe('plot(-2, -3)')
	})
})

describe('useFormattedBody — priorité du préfixe le plus long', () => {
	test('"- " (espace) doit gagner contre "-" (sans espace)', () => {
		// Si "-" était matché en premier sur la fin de "blah - ",
		// on aurait un comportement collapse erroné. Vérifions.
		expect(useFormattedBody('a - $b', ref({b: '-3'}))).toBe('a - \\left(-3\\right)')
	})

	test('"-$b" (sans espace) ne déclenche PAS la règle parenthésage', () => {
		expect(useFormattedBody('-$b', ref({b: '-3'}))).toBe('+3')
	})
})

describe('useFormattedBody — cas combinés et bords', () => {
	test('placeholder en début de chaîne sans contexte', () => {
		expect(useFormattedBody('$a + 1', ref({a: '-5'}))).toBe('-5 + 1')
	})

	test('le préfixe d\'un déclencheur reste collé après transformation', () => {
		expect(useFormattedBody('y = \\cdot $b + 1', ref({b: '-2'})))
			.toBe('y = \\cdot \\left(-2\\right) + 1')
	})

	test('placeholders accolés : pas de déclencheur entre les deux', () => {
		// $a est résolu d'abord (→ "-3$b"), puis $b est cherché dans "-3$b".
		// Le caractère qui précède $b est "3" (chiffre, pas un signe).
		// Donc aucun trigger ne match : concaténation brute.
		expect(useFormattedBody('$a$b', ref({a: '-3', b: '-2'}))).toBe('-3-2')
	})

	test('cascade réelle : le contexte mis à jour par la 1ère clé déclenche la 2ème', () => {
		// $a → "" (chaîne vide). Ensuite "-$b" devient "-" suivi de $b.
		// Le "-" matche le trigger collapse, valeur "-2" → "+2".
		expect(useFormattedBody('$a-$b', ref({a: '', b: '-2'}))).toBe('+2')
	})

	test('aucun déclencheur ne match : remplacement brut', () => {
		expect(useFormattedBody('x = $a', ref({a: '-3'}))).toBe('x = -3')
	})

	test('expression mathématique réaliste', () => {
		const body = '\\( $a - $b \\cdot $c \\)'
		const values = ref({a: '5', b: '-2', c: '-4'})
		// $a = 5 (pas de trigger devant)
		// "- $b" avec b=-2 → "- \left(-2\right)"
		// "\cdot $c" avec c=-4 → "\cdot \left(-4\right)"
		expect(useFormattedBody(body, values))
			.toBe('\\( 5 - \\left(-2\\right) \\cdot \\left(-4\\right) \\)')
	})
})

describe('useFormattedBody — déclencheurs personnalisés', () => {
	test('liste vide de déclencheurs : remplacement brut uniquement', () => {
		expect(useFormattedBody('-$b', ref({b: '-3'}), true, [])).toBe('--3')
	})

	test('ajouter un déclencheur "+ " parenthésant', () => {
		const triggers: BodyTrigger[] = [
			{type: 'parenthesize-if-negative', prefix: '+ '},
			...defaultBodyTriggers,
		]
		expect(useFormattedBody('+ $b', ref({b: '-3'}), true, triggers))
			.toBe('+ \\left(-3\\right)')
		expect(useFormattedBody('+ $b', ref({b: '3'}), true, triggers)).toBe('+ 3')
	})

	test('exporte defaultBodyTriggers comme tableau non vide', () => {
		expect(Array.isArray(defaultBodyTriggers)).toBe(true)
		expect(defaultBodyTriggers.length).toBeGreaterThan(0)
	})
})

describe('useFormattedBody — valeurs numériques', () => {
	test('remplace une valeur number positive', () => {
		expect(useFormattedBody('x = $a', ref({a: 42}))).toBe('x = 42')
	})

	test('remplace une valeur number négative', () => {
		expect(useFormattedBody('x = $a', ref({a: -5}))).toBe('x = -5')
	})

	test('number négatif déclenche le collapse', () => {
		expect(useFormattedBody('-$b', ref({b: -3}))).toBe('+3')
	})

	test('number négatif déclenche le parenthésage conditionnel', () => {
		expect(useFormattedBody('- $b', ref({b: -3}))).toBe('- \\left(-3\\right)')
	})

	test('mélange string/number dans le même dictionnaire', () => {
		expect(useFormattedBody('$a + $b', ref({a: '2', b: 3}))).toBe('2 + 3')
	})

	test('number zéro', () => {
		expect(useFormattedBody('$a', ref({a: 0}))).toBe('0')
	})
})

describe('useFormattedBody — valeurs invalides : sentinel " ??? "', () => {
	test('valeur null → sentinel', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
		})
		expect(useFormattedBody('x = $a', ref({a: null as any}))).toBe('x =  ??? ')
		expect(warn).toHaveBeenCalled()
		warn.mockRestore()
	})

	test('valeur undefined → sentinel', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
		})
		expect(useFormattedBody('x = $a', ref({a: undefined as any}))).toBe('x =  ??? ')
		warn.mockRestore()
	})

	test('valeur boolean → sentinel', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
		})
		expect(useFormattedBody('$a', ref({a: true as any}))).toBe(' ??? ')
		warn.mockRestore()
	})

	test('valeur objet → sentinel', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
		})
		expect(useFormattedBody('$a', ref({a: {foo: 'bar'} as any}))).toBe(' ??? ')
		warn.mockRestore()
	})

	test('console.warn contient le nom de la clé et le type', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
		})
		useFormattedBody('$a', ref({a: null as any}))
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('`a`'),
			null
		)
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('object'),
			null
		)
		warn.mockRestore()
	})

	test('la fonction ne plante jamais sur valeur invalide', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
		})
		expect(() => useFormattedBody('$a $b', ref({a: null as any, b: undefined as any}))).not.toThrow()
		warn.mockRestore()
	})

	test('mélange valeurs valides et invalides', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
		})
		expect(useFormattedBody('$a + $b', ref({a: 2, b: null as any}))).toBe('2 +  ??? ')
		warn.mockRestore()
	})
})
