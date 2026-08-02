/**
 * Découpe `value` sur chaque occurrence de `splitCharacter` rencontrée à
 * profondeur de parenthèses nulle (donc hors de toute paire de parenthèses).
 *
 * Lorsque `splitCharacter` est un signe (`+` ou `-`), une occurrence qui est
 * en réalité un signe unaire — en début de chaîne ou juste après un opérateur —
 * n'est pas traitée comme un séparateur (voir {@link isUnarySign}).
 *
 * @param value Expression asciimath sans espace fournie par un clavier.
 * @param splitCharacter Caractère de séparation (`+`, `-`, `/`, ...).
 * @returns Les fragments de `value` ; le tableau contient toujours au moins un
 *   élément (la chaîne entière si aucun séparateur n'est trouvé).
 * @example
 * splitIfOutsideParentheses("(a+b)+c", "+") // ["(a+b)", "c"]
 * splitIfOutsideParentheses("-a+b", "+")    // ["-a", "b"]
 * splitIfOutsideParentheses("N/D", "/")     // ["N", "D"]
 */
export function splitIfOutsideParentheses(
	value: string,
	splitCharacter: string,
): string[] {
	const isSign = splitCharacter === "+" || splitCharacter === "-"
	let depth = 0
	let lastIndex = 0
	const arr: string[] = []

	for (let i = 0; i < value.length; i++) {
		const char = value[i]
		if (char === "(") depth++
		else if (char === ")") depth--

		if (char !== splitCharacter || depth !== 0) continue
		if (isSign && isUnarySign(value, i)) continue // signe, pas séparateur

		arr.push(value.substring(lastIndex, i))
		lastIndex = i + 1
	}

	// Add the last item.
	arr.push(value.substring(lastIndex))
	return arr
}

/**
 * Un + ou - est unaire (un signe) s'il ouvre la chaîne ou suit un autre
 * opérateur - donc pas un séparateur entre deux termes.
 * @param value Expression analysée.
 * @param index Position du `+` ou `-` à qualifier.
 * @returns `true` si le caractère est un signe unaire, `false` si c'est un
 *   séparateur entre deux termes.
 * @example
 * isUnarySign("-a+b", 0)  // true  (début de chaîne)
 * isUnarySign("2+-3", 2)  // true  (suit l'opérateur "+")
 * isUnarySign("a-b", 1)   // false (sépare deux termes)
 */
function isUnarySign(value: string, index: number): boolean {
	let j = index - 1
	while (j >= 0 && value[j] === " ") j--
	return j < 0 || "(+-*/^".includes(value[j])
}


/**
 * Retire la paire de parenthèses externe de `str` uniquement si elle enveloppe
 * la chaîne entière. Si les parenthèses de tête et de queue appartiennent à
 * deux groupes distincts (ex. `(a)(b)`), la chaîne est renvoyée telle quelle.
 *
 * @param str Expression asciimath sans espace.
 * @returns `str` privé de ses parenthèses enveloppantes, sinon `str` inchangé.
 * @example
 * stripParenthesis("(a+b)")  // "a+b"
 * stripParenthesis("(a)(b)") // "(a)(b)" (deux groupes, pas d'enveloppe)
 * stripParenthesis("x+1")    // "x+1"    (non parenthésé)
 */
export function stripParenthesis(str: string): string {
	if (!str.startsWith('(') || !str.endsWith(')')) return str

	let depth = 0
	for (let i = 0; i < str.length - 1; i++) {
		if (str[i] === '(') depth++
		else if (str[i] === ')') depth--
		if (depth === 0) return str
	}

	return str.slice(1, -1)
}

/**
 * Découpe une somme algébrique en ses termes, en préservant le signe de chacun.
 * Découpe d'abord sur `-` puis sur `+` à profondeur nulle, réattache le signe
 * `-` au terme qui le suit, puis nettoie (trim + suppression des termes vides).
 *
 * @param value Expression asciimath sans espace fournie par un clavier.
 * @returns La liste des termes signés, sans espaces ni fragments vides.
 * @example
 * splitAtSigns("(string1)+(string2)-(string3)") // ["(string1)", "(string2)", "-(string3)"]
 * splitAtSigns("-3+x")                           // ["-3", "x"]
 */
export function splitAtSigns(value: string): string[] {
	return splitIfOutsideParentheses(value, "-")
		.map((element, index) => (index > 0 ? "-" + element : element))
		.map((element) => splitIfOutsideParentheses(element, "+"))
		.flat()
		.map((x) => x.trim())
		.filter((x) => x !== "")
}

/**
 * Extrait les composantes d'un couple ou triplet de coordonnées de la forme
 * `(x;y)` ou `(x;y;z)`. Les parenthèses encadrantes sont supposées présentes
 * (garanties par le clavier) : le premier et le dernier caractère sont retirés
 * sans vérification. Passer une valeur non parenthésée corrompt le résultat.
 *
 * @param value Coordonnées asciimath encadrées de parenthèses, ex. `(1;2)`.
 * @returns Les composantes, découpées sur `;`.
 * @example
 * parseCoordinates("(1;2)")   // ["1", "2"]
 * parseCoordinates("(1;2;3)") // ["1", "2", "3"]
 */
export function parseCoordinates(value: string): string[] {
	// les valeurs commencent et se termine par des parenthèses (obligatoire).
	return value.substring(1, value.length - 1).split(';')
}

/**
 * Vérifie que `value` commence par `(` et se termine par `)`. Ne contrôle pas
 * l'équilibre interne des parenthèses ni la longueur de la chaîne.
 *
 * @param value Expression à tester.
 * @returns `true` si le premier caractère est `(` et le dernier `)`.
 * @example
 * checkParentheses("(1;2)") // true
 * checkParentheses("1;2")   // false
 * checkParentheses("")      // false
 */
export function checkParentheses(value: string): boolean {
	return !(value[0] !== "(" || value[value.length - 1] !== ")")
}
