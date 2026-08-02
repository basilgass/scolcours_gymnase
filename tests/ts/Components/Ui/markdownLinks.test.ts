import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"
import {replaceInternalLinks} from "@/Components/Ui/MarkdownIt.vue"

// `replaceInternalLinks` est exportée depuis le bloc <script> (non-setup) de
// MarkdownIt.vue : importer le SFC n'exécute que ce bloc, pas le <script setup>
// (donc ni markdown-it ni usePage ne sont instanciés ici).

beforeEach(() => {
	// Stub du global Ziggy `route` : URL-sentinelle déterministe encodant le nom
	// de route et les paramètres, pour asserter précisément la résolution.
	vi.stubGlobal(
		"route",
		(name: string, params: Record<string, unknown>) => `/r/${name}?${JSON.stringify(params)}`,
	)
})

afterEach(() => {
	vi.unstubAllGlobals()
})

describe("replaceInternalLinks — ancres (#)", () => {
	test("régression : une ancre ne doit PAS être ré-emballée dans des parenthèses", () => {
		// Ancien bug : produisait `((#block-1567))` → destination relative cassée.
		expect(replaceInternalLinks("[label](#block-1567)", false))
			.toBe("[label](#block-1567){.@text}")
	})

	test("ancre seule (sans label markdown autour)", () => {
		expect(replaceInternalLinks("(#foo)", false)).toBe("(#foo){.@text}")
	})

	test("le contexte cours n'a aucun effet sur une ancre", () => {
		expect(replaceInternalLinks("[x](#anchor)", true)).toBe("[x](#anchor){.@text}")
	})
})

describe("replaceInternalLinks — routes (@)", () => {
	test("posts.show hors contexte cours : context = null", () => {
		expect(replaceInternalLinks("[x](@posts.show,42)", false))
			.toBe("[x](/r/posts.show?{\"post\":\"42\",\"context\":null}){.@text}")
	})

	test("blocks.show en contexte cours : context = 'course'", () => {
		expect(replaceInternalLinks("[x](@blocks.show,7)", true))
			.toBe("[x](/r/blocks.show?{\"block\":\"7\",\"context\":\"course\"}){.@text}")
	})

	test("tools.show : jamais de contexte, seul le paramètre tool est transmis", () => {
		expect(replaceInternalLinks("[x](@tools.show,3)", true))
			.toBe("[x](/r/tools.show?{\"tool\":\"3\"}){.@text}")
	})

	test("route inconnue : destination laissée inchangée (avec le suffixe de thème)", () => {
		expect(replaceInternalLinks("[x](@foo.bar,1)", false))
			.toBe("[x](@foo.bar,1){.@text}")
	})
})

describe("replaceInternalLinks — non-cibles et cas combinés", () => {
	test("lien relatif normal : non touché", () => {
		expect(replaceInternalLinks("[x](/chemin/vers/page)", false))
			.toBe("[x](/chemin/vers/page)")
	})

	test("lien externe avec fragment : non touché (ne commence pas par @ ou #)", () => {
		expect(replaceInternalLinks("[x](https://exemple.test/a#b)", false))
			.toBe("[x](https://exemple.test/a#b)")
	})

	test("texte sans lien interne : identité", () => {
		expect(replaceInternalLinks("Juste du texte, rien à résoudre.", false))
			.toBe("Juste du texte, rien à résoudre.")
	})

	test("plusieurs liens internes dans le même texte", () => {
		expect(replaceInternalLinks("[a](#un) et [b](#deux)", false))
			.toBe("[a](#un){.@text} et [b](#deux){.@text}")
	})

	test("mélange ancre + route dans le même texte", () => {
		expect(replaceInternalLinks("voir [ici](#top) ou [là](@tools.show,9)", false))
			.toBe("voir [ici](#top){.@text} ou [là](/r/tools.show?{\"tool\":\"9\"}){.@text}")
	})
})
