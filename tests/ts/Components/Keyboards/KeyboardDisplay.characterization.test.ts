import {describe, expect, test} from "vitest"
import {mount, VueWrapper} from "@vue/test-utils"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {KeyboardObjectType} from "@/Composables/keyboardConfig.ts"

/**
 * Filet de caractérisation du RENDU/SORTIE de KeyboardDisplay.
 *
 * Ce test PHOTOGRAPHIE le comportement actuel : une suite de clics (touches,
 * commandes, options) → la séquence ordonnée des événements émis
 * `change {input, tex, raw}` / `clear` / `next`.
 *
 * Il est écrit AVANT le refactor K2 (normalisation du layout, extraction du
 * formatage `//`, déduplication de `keyStrokes`) et doit rester vert (snapshot
 * identique) APRÈS. Toute divergence de snapshot = régression à investiguer.
 *
 * Quirks connus, volontairement figés par ce filet :
 *  - « effacer » (back) émet DEUX `change` (backKeyStrokes rappelle changeEvent
 *    après ButtonKeyClick("@back") qui l'a déjà appelé) + un `clear`.
 *  - La règle `//` → `(...)/...` est CONDITIONNELLE au clavier : seuls les claviers
 *    déclarant `formatters: [formatFractionShortcut]` (algebra, equation, cartesian,
 *    function, polynom, primitive, rational) l'appliquent et bloquent un 2e `//`.
 *    Les autres (ex. `fraction`) laissent `//` littéral et n'imposent aucun blocage.
 *
 * Montage : la directive globale `v-katex` n'est pas enregistrée en test ; on la
 * neutralise en no-op. Les fonctions `tex()` réelles (pimath / asciiToTex) tournent.
 */

interface Emission {
	event: "change" | "clear" | "next",
	payload?: unknown
}

function mountKeyboard(
	props: { keyboard: string | KeyboardObjectType } & Record<string, unknown>
): {
	wrapper: VueWrapper,
	emissions: Emission[]
} {
	const emissions: Emission[] = []
	const wrapper = mount(KeyboardDisplay, {
		props: {
			...props,
			onChange: (payload: unknown) => {
				emissions.push({event: "change", payload})
			},
			onClear: (payload: unknown) => {
				emissions.push({event: "clear", payload})
			},
			onNext: () => {
				emissions.push({event: "next"})
			}
		},
		global: {directives: {katex: {}}}
	})
	return {wrapper, emissions}
}

/** Boutons de touches, dans l'ordre exact du `layout`. */
function keyButtons(wrapper: VueWrapper) {
	return wrapper.find("div.keyboard.grid").findAll("button")
}

/** Presse des touches identifiées par leur index dans le layout. */
async function pressKeys(wrapper: VueWrapper, indices: number[]): Promise<void> {
	const buttons = keyButtons(wrapper)
	for (const index of indices) {
		await buttons[index].trigger("click")
	}
}

/** Presse une commande identifiée par la classe d'icône (bi-backspace / bi-trash / bi-arrow-bar-right). */
async function pressCommand(wrapper: VueWrapper, iconClass: string): Promise<void> {
	const button = wrapper.findAll("button").find(b => b.find(`i.${iconClass}`).exists())
	await button!.trigger("click")
}

/** Presse des boutons d'options (extraLetters), par index. */
async function pressOptions(wrapper: VueWrapper, indices: number[]): Promise<void> {
	const buttons = wrapper.find("div.keyboard.flex-wrap").findAll("button")
	for (const index of indices) {
		await buttons[index].trigger("click")
	}
}

// ─── Index des layouts utilisés (source : keyboardConfig.ts) ─────────────────
//
// algebra (grid-cols-7) :
//   0:"1" 1:"2" 2:"3" 3:"+" 4:"x" 5:"y" 6:"e"
//   7:"4" 8:"5" 9:"6" 10:"-" 11:"^2" 12:"^" 13:"ln"
//   14:"7" 15:"8" 16:"9" 17:"*" 18:"|" 19:"sqrt" 20:"root("
//   21:"." 22:"0" 23:"=" 24:"/" 25:"(" 26:")" 27:";"
//
// fraction (grid-cols-3) :
//   0:"1" 1:"2" 2:"3"
//   3:"4" 4:"5" 5:"6"
//   6:"7" 7:"8" 8:"9"
//   9:"-" 10:"0" 11:"/"

describe("KeyboardDisplay — caractérisation du rendu/sortie", () => {
	test("saisie simple : 1 + 2 sur algebra", async () => {
		const {wrapper, emissions} = mountKeyboard({keyboard: "algebra"})

		await pressKeys(wrapper, [0, 3, 1]) // "1", "+", "2"

		expect(emissions).toMatchSnapshot()
	})

	test("cas // (algebra) : 1//2 → (1)/2", async () => {
		const {wrapper, emissions} = mountKeyboard({keyboard: "algebra"})

		await pressKeys(wrapper, [0, 24, 24, 1]) // "1", "/", "/", "2"

		expect(emissions).toMatchSnapshot()
	})

	test("cas // avec dénominateur vide : 1// → (1)/...", async () => {
		const {wrapper, emissions} = mountKeyboard({keyboard: "algebra"})

		await pressKeys(wrapper, [0, 24, 24]) // "1", "/", "/"

		expect(emissions).toMatchSnapshot()
	})

	test("un second // est bloqué à la frappe (clavier à raccourci)", async () => {
		const {wrapper, emissions} = mountKeyboard({keyboard: "algebra"})

		// "1","/","/","2","/","/","3" — la 6e frappe formerait un 2e "//"
		await pressKeys(wrapper, [0, 24, 24, 1, 24, 24, 2])

		// La frappe rejetée n'émet rien : 6 émissions au lieu de 7.
		expect(emissions.map(e => (e.payload as { input: string }).input)).toEqual([
			"1",
			"1/",
			"(1)/...",  // 1// → fraction posée
			"(1)/2",
			"(1)/2/",   // un "/" supplémentaire reste autorisé
			"(1)/2/3"   // la frappe "//" bloquée n'a rien émis ; "3" enchaîne
		])
	})

	test("clavier sans raccourci (fraction) : // ni formaté ni bloqué", async () => {
		const {wrapper, emissions} = mountKeyboard({keyboard: "fraction"})

		// fraction : 0="1", 11="/", 1="2". Aucun formatter déclaré → saisie brute.
		await pressKeys(wrapper, [0, 11, 11, 1, 11, 11, 2])

		// 7 émissions (aucune frappe rejetée), et "//" reste littéral.
		expect(emissions.map(e => (e.payload as { input: string }).input)).toEqual([
			"1",
			"1/",
			"1//",
			"1//2",
			"1//2/",
			"1//2//",
			"1//2//3"
		])
	})

	test("commande back : émet DEUX change + un clear", async () => {
		const {wrapper, emissions} = mountKeyboard({keyboard: "fraction", back: true})

		await pressKeys(wrapper, [0, 1]) // "1", "2"
		await pressCommand(wrapper, "bi-backspace")

		expect(emissions).toMatchSnapshot()
	})

	test("commande reset : change{vide} + clear", async () => {
		const {wrapper, emissions} = mountKeyboard({keyboard: "fraction", reset: true})

		await pressKeys(wrapper, [0, 1]) // "1", "2"
		await pressCommand(wrapper, "bi-trash")

		expect(emissions).toMatchSnapshot()
	})

	test("commande next : émet next seul, aucun change", async () => {
		const {wrapper, emissions} = mountKeyboard({keyboard: "fraction", next: true})

		await pressCommand(wrapper, "bi-arrow-bar-right")

		expect(emissions).toMatchSnapshot()
	})

	test("extraLetters : k puis #pi (préfixe # retiré → pi)", async () => {
		const {wrapper, emissions} = mountKeyboard({
			keyboard: "algebra",
			extraLetters: ["k", "#pi"]
		})

		await pressOptions(wrapper, [0, 1]) // "k", puis "pi"

		expect(emissions).toMatchSnapshot()
	})

	// ─── Formes de layout (chaîne / tuple / objet) ───────────────────────────
	// Couvre les branches de keyboardComputed avant leur normalisation à forme
	// unique. Ces claviers portent des tuples (["=", n]) absents de algebra/fraction.

	test("forme tuple : ['=', 2] rend col-span-2 (equation)", async () => {
		const {wrapper, emissions} = mountKeyboard({keyboard: "equation"})
		const buttons = keyButtons(wrapper)

		// equation : index 22 = ["=", 2]
		expect(buttons[22].classes()).toContain("col-span-2")

		await buttons[22].trigger("click")
		expect(emissions).toEqual([
			{event: "change", payload: {input: "=", raw: "", tex: expect.any(String)}}
		])
	})

	test("forme tuple : ['=', 3] rend col-span-3 (fraction+)", () => {
		const {wrapper} = mountKeyboard({keyboard: "fraction+"})
		const buttons = keyButtons(wrapper)

		// fraction+ : index 12 = ["=", 3]
		expect(buttons[12].classes()).toContain("col-span-3")
	})

	test("formes mixtes : clavier custom (chaîne + tuple + objet inline)", async () => {
		// Annotation KeyboardObjectType : donne au littéral son type contextuel, sans quoi
		// ["+", 2] s'inférerait en (string|number)[] au lieu du tuple [string, number].
		const customKeyboard: KeyboardObjectType = {
			name: "custom",
			grid: "grid-cols-3",
			// index 0 : chaîne ; index 1 : tuple span 2 ; index 2 : objet inline
			layout: ["1", ["+", 2], {key: "foo", display: "FOO", type: "html"}],
			tex: (value: string) => value
		}
		const {wrapper, emissions} = mountKeyboard({keyboard: customKeyboard})
		const buttons = keyButtons(wrapper)

		expect(buttons[0].classes().some(c => c.startsWith("col-span"))).toBe(false)
		expect(buttons[1].classes()).toContain("col-span-2")
		expect(buttons[2].text()).toContain("FOO") // display de l'objet inline (v-html)

		await buttons[2].trigger("click") // fn par défaut : value + key = "foo"
		expect(emissions.at(-1)).toEqual({event: "change", payload: {input: "foo", raw: "", tex: "foo"}})
	})
})
