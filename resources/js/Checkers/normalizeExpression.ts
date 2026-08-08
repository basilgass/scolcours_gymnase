/**
 * Normalise une expression saisie en asciimath pour la rendre lisible par `NumExp`.
 *
 * Cette fonction est partagée par plusieurs checkers (AlgebraChecker, ExactChecker, ...)
 * afin de garantir une normalisation canonique unique.
 *
 * Pipeline (l'ordre est significatif) :
 *   1. Supprime les multiplications explicites (2*x -> 2x), sauf entre deux chiffres.
 *   2. Transforme root(n)(radicande) en nthrt(radicande,n) (ordre attendu par NumExp).
 *   3. Ajoute les parenthèses d'argument à une racine carrée (sqrt5 -> sqrt(5)).
 *   4. Canonicalisation interne : déparenthèse un exposant entier (^(3) -> ^3) afin
 *      que wrapTrigoPowers puisse le détecter à l'étape suivante.
 *   5. Enveloppe les puissances trigonométriques : sin^n(...) -> (sin(...))^n.
 *   6. Encadre systématiquement tout exposant nu entre parenthèses (^2 -> ^(2)),
 *      qu'il soit entier, négatif ou décimal. Un exposant déjà parenthésé
 *      (fraction ^(1/2), négatif ^(-3), ...) n'est pas touché.
 */
export function normalizeExpression(value: string): string {
	let normalized = value

	// 1. Supprime les multiplications explicites (2*x -> 2x), sauf entre deux chiffres
	normalized = normalized.replace(/(?<!\d)\*|\*(?!\d)/g, '')

	// 2. Transforme root(n)(radicande) en nthrt(radicande,n).
	//    Gère aussi le radicande à un seul élément sans parenthèses :
	//    root(n)45 -> nthrt(45,n) et root(n)x^m -> nthrt(x,n)^m.
	normalized = rewriteNthRoots(normalized)

	// 3. Ajoute les parenthèses d'argument à une racine carrée (sqrt5 -> sqrt(5))
	normalized = normalized.replace(/sqrt([0-9]+)/g, 'sqrt($1)')

	// 4. Canonicalisation interne : ^(n) -> ^n pour un exposant entier.
	//    Permet à wrapTrigoPowers de reconnaître sin^(3)( comme sin^3(.
	//    L'étape 6 rétablira ensuite l'encadrement de façon uniforme.
	normalized = normalized.replaceAll(/\^\(([0-9]+)\)/g, '^$1')

	// 5. Transforme sin^n(...) / cos^n(...) / tan^n(...) en (sin(...))^n
	normalized = wrapTrigoPowers(normalized)

	// 6. Encadre tout exposant nu entre parenthèses (entier, négatif, décimal).
	//    Les exposants déjà parenthésés (fractions incluses) ne sont pas touchés.
	normalized = wrapBareExponents(normalized)

	return normalized
}

/**
 * Cherche la parenthèse fermante correspondant à la parenthèse ouvrante située
 * à `openIndex`, en comptant la profondeur d'imbrication.
 *
 * Une expression régulière ne sait pas apparier des parenthèses imbriquées ; ce
 * comptage manuel est donc le seul moyen fiable de délimiter un groupe.
 *
 * @returns l'index de la parenthèse fermante, ou -1 si elle n'est jamais fermée
 *          (expression malformée).
 */
function findMatchingParen(value: string, openIndex: number): number {
	let depth = 0
	for (let i = openIndex; i < value.length; i++) {
		if (value[i] === '(') {
			depth++
		} else if (value[i] === ')' && --depth === 0) {
			return i
		}
	}

	return -1
}

/**
 * Détermine le radicande d'une racine à partir du texte qui suit `root(n)`,
 * `afterIndex` pointant sur le premier caractère après `root(n)`.
 *
 * Trois formes sont reconnues :
 *   - Parenthésé — `root(n)(...)`. Le radicande, potentiellement imbriqué, est
 *     délimité par findMatchingParen.
 *   - Nombre entier — `root(n)45`. La racine ne couvre que la suite de chiffres.
 *   - Lettre unique — `root(n)x`. La racine ne couvre que cette lettre ; tout ce
 *     qui suit (`^5`, une fonction, ...) reste hors radicande (à l'utilisateur
 *     d'ajouter des parenthèses pour les cas plus larges).
 *
 * @returns le radicande et `finIndex`, l'index (exclu) de fin de la portion
 *          consommée, ou `null` si aucun radicande exploitable n'est trouvé.
 */
function readRadicande(value: string, afterIndex: number): {radicande: string; finIndex: number} | null {
	const reste = value.slice(afterIndex)

	if (reste.startsWith('(')) {
		const closeIndex = findMatchingParen(value, afterIndex)
		if (closeIndex === -1) {
			return null
		}

		return {radicande: value.slice(afterIndex + 1, closeIndex), finIndex: closeIndex + 1}
	}

	const nombre = /^[0-9]+/.exec(reste)
	if (nombre !== null) {
		return {radicande: nombre[0], finIndex: afterIndex + nombre[0].length}
	}

	const lettre = /^[a-zA-Z]/.exec(reste)
	if (lettre !== null) {
		return {radicande: lettre[0], finIndex: afterIndex + 1}
	}

	return null
}

/**
 * Transforme root(n)(radicande) en nthrt(radicande,n).
 *
 * NumExp attend `nthrt(radicande, degré)` ; le degré doit donc être déplacé
 * APRÈS le radicande. L'amorce ne capture que `root(n)` ; readRadicande décide
 * ensuite ce que la racine couvre et jusqu'où. Un exposant nu laissé derrière
 * (root(n)x^5 -> nthrt(x,n)^5) sera encadré plus loin par wrapBareExponents.
 *
 * La boucle re-scanne depuis le début à chaque passe, ce qui gère les racines
 * imbriquées : root(2)(root(3)(x)) -> nthrt(nthrt(x,3),2).
 */
function rewriteNthRoots(value: string): string {
	const amorce = /root\(([0-9]+)\)/
	let result = value
	let match: RegExpExecArray | null

	while ((match = amorce.exec(result)) !== null) {
		const [full, degre] = match
		const afterIndex = match.index + full.length // index du caractère juste après root(n)

		const parsed = readRadicande(result, afterIndex)

		// Radicande malformé ou absent : on arrête pour éviter une boucle infinie
		if (parsed === null) break

		const remplacement = `nthrt(${parsed.radicande},${degre})`
		result = result.slice(0, match.index) + remplacement + result.slice(parsed.finIndex)
	}

	return result
}

/**
 * Encadre entre parenthèses tout exposant nu qui suit un `^`.
 *
 * La regex ne matche qu'un exposant nu (`^2`, `^-3`, `^2.5`). Un exposant déjà
 * parenthésé commence par `(` juste après le `^`, elle ne le capture donc jamais :
 * les fractions `^(1/2)` et les négatifs `^(-3)` déjà parenthésés sont préservés
 * sans traitement particulier.
 */
function wrapBareExponents(value: string): string {
	return value.replace(/\^(-?\d+(?:\.\d+)?)/g, '^($1)')
}

/**
 * Transforme sin^n(...), cos^n(...) et tan^n(...) en (sin(...))^n
 * en gérant une profondeur d'imbrication de parenthèses quelconque.
 *
 * La regex ne repère que l'amorce (fonction + exposant + parenthèse ouvrante) ;
 * la parenthèse fermante correspondante est délimitée par findMatchingParen,
 * ce qu'une expression régulière ne peut pas faire seule.
 *
 * Limitation connue : seuls les exposants entiers (`sin^2(...)`) sont enveloppés
 * comme puissances trigonométriques ; un exposant décimal (`sin^2.5(...)`, très
 * rare) n'est pas détecté ici.
 */
function wrapTrigoPowers(value: string): string {
	const amorce = /(sin|cos|tan)\^([0-9]+)\(/
	let result = value
	let match: RegExpExecArray | null

	while ((match = amorce.exec(result)) !== null) {
		const [full, fonction, exposant] = match
		const openIndex = match.index + full.length - 1 // index de la '(' d'ouverture

		const closeIndex = findMatchingParen(result, openIndex)

		// Parenthèse non fermée : expression malformée, on arrête pour éviter une boucle infinie
		if (closeIndex === -1) break

		const argument = result.slice(openIndex + 1, closeIndex)
		const remplacement = `(${fonction}(${argument}))^${exposant}`
		result = result.slice(0, match.index) + remplacement + result.slice(closeIndex + 1)
	}

	return result
}
