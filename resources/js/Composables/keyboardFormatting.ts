/**
 * Formatage générique de la saisie clavier (input brut → input mis en forme).
 *
 * Pipeline extensible : chaque règle est une fonction pure appliquée en chaîne.
 * Pour ajouter un formatage, écrire une {@link KeyboardFormatter} et l'ajouter à
 * {@link KEYBOARD_FORMATTERS} (l'ordre compte).
 */
export type KeyboardFormatter = (input: string) => string

/**
 * Raccourci fraction `//` : coupe la PREMIÈRE (et unique) occurrence de `//`
 * en `(numérateur)/dénominateur`. Dénominateur vide → `...`.
 * Ignoré s'il y a zéro ou plusieurs `//` (comportement historique préservé).
 */
export const formatFractionShortcut: KeyboardFormatter = (input) => {
	const [before, after, ...extras] = input.split("//")
	if (after !== undefined && extras.length === 0) {
		return `(${before})/${after === "" ? "..." : after}`
	}
	return input
}

/**
 * Applique, dans l'ordre, les règles de formatage fournies. La liste dépend du
 * clavier courant (chaque `KeyboardObjectType` déclare ses `formatters`) : un
 * clavier sans règle (défaut `[]`) laisse la saisie brute intacte.
 */
export function formatKeyboardInput(input: string, formatters: KeyboardFormatter[] = []): string {
	return formatters.reduce((result, format) => format(result), input)
}

/** Nombre d'occurrences du raccourci fraction "//" dans une saisie brute. */
export function countFractionShortcuts(input: string): number {
	return input.split("//").length - 1
}

/**
 * true si la saisie contient plus d'un "//" : une seule fraction-raccourci est
 * autorisée. Sert à bloquer, à la frappe, la formation d'un second "//".
 */
export function hasTooManyFractionShortcuts(input: string): boolean {
	return countFractionShortcuts(input) >= 2
}
