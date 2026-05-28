import {usePage} from "@inertiajs/vue3"
import {Ref, unref} from "vue"

interface KeyValue {
	key: string
	value: string
}

function isKeyValue(obj: unknown): obj is KeyValue {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'key' in obj &&
		'value' in obj &&
		typeof (obj as any).key === 'string' &&
		typeof (obj as any).value === 'string'
	)
}

export function useScrollTo(target?: string | HTMLElement | KeyValue, offset?: number) {
	let el: HTMLElement | null = null

	// to the top
	if (!target) target = 'body'

	if (typeof target === "string") {
		el = document.querySelector(target)
	} else if (target instanceof HTMLElement) {
		el = target
	} else if (isKeyValue(target)) {
		el = document.querySelector(`[data-${target.key}="${target.value}"]`)
	}

	if (!el) return

	setTimeout(() => {
		const top = el.getBoundingClientRect().top +
			window.scrollY -
			(offset === undefined ? 0 : offset)

		window.scrollTo({
			top,
			behavior: 'smooth'
		})
	}, 500)
}

/**
 * Applies a wrong answer animation to the given button element.
 *
 * @param {HTMLElement} btn - The button element to animate.
 *
 * @return {void}
 */
export function useWrongAnswerAnimation(btn: HTMLElement) {
	if (btn) {
		btn.style.setProperty("animation-name", "v-shake-horizontal")
		btn.style.setProperty("animation-duration", "500ms")

		setTimeout(() => {
			if (btn) {
				// the button may have already disappeared !
				btn.style.setProperty("animation-name", "")
			}
		}, 500)
	}
}

export type BodyTrigger =
	| { type: 'collapse', prefix: string }
	| { type: 'parenthesize-if-negative', prefix: string }

export type Parentheses = [open: string, close: string]

// Order matters: longest prefix first so the longest match wins.
export const defaultBodyTriggers: BodyTrigger[] = [
	{type: 'parenthesize-if-negative', prefix: '\\cdot '},
	{type: 'parenthesize-if-negative', prefix: '- '},
	{type: 'collapse', prefix: '-'},
	{type: 'collapse', prefix: '+'},
]

/**
 * Processes and formats the body text with given values, applying contextual
 * triggers (sign collapse, conditional parenthesizing) around each placeholder.
 *
 * @param body - The body text to be formatted.
 * @param mabyeRefValues - Map of placeholder keys to their replacement values.
 * @param latexOutput - If true (default), parenthesizing uses `\left(`/`\right)`
 *                     auto-sized delimiters (suited for KaTeX/MathJax rendering).
 *                     Pass false for plain text or numeric-only contexts.
 * @param triggers - Contextual rules applied based on the text preceding each placeholder.
 * @returns The formatted body text, or null if body is null.
 */
export function useFormattedBody(
	body: string | Ref<string>,
	mabyeRefValues: Ref<Record<string, string | number>>,
	latexOutput = true,
	triggers: BodyTrigger[] = defaultBodyTriggers
): string {
	if (body === null) return null


	const values = unref(mabyeRefValues)

	if (!unref(values)) return unref(body)

	const normalized: Record<string, string> = {}
	for (const key in values) {
		const raw = values[key]
		if (typeof raw === 'string') {
			normalized[key] = raw
		} else if (typeof raw === 'number') {
			normalized[key] = String(raw)
		} else {
			console.warn(
				`La valeur \`${key}\` n'a pas une valeur compatible (string ou number), mais elle est de type ${typeof raw}`,
				raw
			)
			normalized[key] = ' ??? '
		}
	}

	const parentheses: Parentheses = latexOutput
		? ['\\left(', '\\right)']
		: ['(', ')']

	let output = `${unref(body)}`

	for (const key in normalized) {
		output = applyKeyWithTriggers(output, key, normalized[key], triggers, parentheses)
	}

	return output
}

/**
 * Remplace toutes les occurrences de `$key` dans `source` par `value`,
 * en appliquant un déclencheur contextuel si le texte qui précède le
 * placeholder correspond à l'un des préfixes de `triggers`.
 *
 * L'algorithme scanne `source` en avant et accumule le résultat dans `out`.
 * À chaque occurrence du placeholder, il consulte la fin de `out` (et non
 * de `source`) pour décider du contexte — ce qui permet aux remplacements
 * précédents (autres clés ou occurrences antérieures) d'influencer la suite.
 */
function applyKeyWithTriggers(
	source: string,
	key: string,
	value: string,
	triggers: BodyTrigger[],
	parentheses: Parentheses
): string {
	const placeholder = '$' + key   // ex: "$a"
	let out = ''                    // chaîne en construction (output)
	let i = 0                       // curseur de lecture dans `source`

	while (true) {
		// 1. Chercher la prochaine occurrence du placeholder à partir du curseur.
		const idx = source.indexOf(placeholder, i)

		// 2. Plus aucune occurrence : on copie le reste de `source` et on sort.
		if (idx === -1) {
			out += source.slice(i)
			break
		}

		// 3. Copier dans `out` tout ce qui précède l'occurrence trouvée.
		out += source.slice(i, idx)

		// 4. Chercher le premier déclencheur dont le préfixe termine `out`.
		//    L'ordre du tableau encode la priorité : le préfixe le plus long
		//    doit être placé en premier pour éviter d'être masqué (ex: "- "
		//    doit gagner contre "-").
		const matched = triggers.find(t => out.endsWith(t.prefix))

		if (matched) {
			// 5a. Un déclencheur matche : on retire son préfixe de `out`,
			//     puis on délègue le rendu (collapse ou parenthésage) qui
			//     se charge de ré-injecter le préfixe (modifié ou non) et la valeur.
			out = out.slice(0, out.length - matched.prefix.length)
			out += renderWithTrigger(matched, value, parentheses)
		} else {
			// 5b. Aucun déclencheur : remplacement brut.
			out += value
		}

		// 6. Avancer le curseur juste après le placeholder consommé.
		//    On ne re-scanne jamais `out`, donc pas de boucle infinie possible
		//    même si `value` contenait par hasard le placeholder.
		i = idx + placeholder.length
	}

	return out
}

/**
 * Rend la combinaison `prefix + value` selon le type de déclencheur :
 *
 * - `collapse` : si `value` commence par un signe (`+`/`-`), on fusionne
 *   ce signe avec celui du préfixe selon la table standard
 *   (`- -` → `+`, `+ -` → `-`, etc.). Sinon le préfixe reste tel quel.
 *
 * - `parenthesize-if-negative` : si `value` commence par `-`, on entoure
 *   la valeur de parenthèses (utile pour `- (-3)`, `\cdot (-3)`).
 *   Sinon le préfixe et la valeur sont juxtaposés sans modification.
 */
function renderWithTrigger(trigger: BodyTrigger, value: string, parentheses: Parentheses): string {
	if (trigger.type === 'collapse') {
		const head = value[0]
		if (head === '+' || head === '-') {
			// Même signe → '+', signes opposés → '-'.
			const newSign = trigger.prefix === head ? '+' : '-'
			return newSign + value.slice(1)
		}
		return trigger.prefix + value
	}

	// parenthesize-if-negative
	if (value.startsWith('-')) {
		const [open, close] = parentheses
		return trigger.prefix + open + value + close
	}
	return trigger.prefix + value
}

export function replaceDoubleSigns(text: string): string {
	return text
		.replaceAll('++', '+')
		.replaceAll('--', '+')
		.replaceAll('+-', '-')
		.replaceAll('-+', '-')
}

export function dynamicText(rawText: string, keys: Record<string, string | number>): string {
	let result = '' + rawText

	Object.keys(keys).forEach(key => {
		result = result.replaceAll(key, `${keys[key]}`)
	})

	return replaceDoubleSigns(result)
}

export const useKatexMacros: Record<string, string> = {
	"\\IR": "\\mathbb{R}",
	"\\IN": "\\mathbb{N}",
	"\\ds": "\\displaystyle",
	"\\vect": "\\overrightarrow",
	"\\dx": "\\hspace{0.5em}\\text{d}x"
}


export function useTheme(id: number) {
	const theme = usePage().props.themes.find(theme => +theme.id === +id)

	return theme ?? {
		id: null,
		slug: null,
		title: null,
		order: null,
		color: null,
		icon: null,
		enabled: null
	}
}
