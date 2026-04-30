export function splitIfOutsideParentheses(
	value: string,
	splitCharacter: string,
): string[] {
	let isInside = 0,
		lastIndex = 0
	const arr = []

	for (let i = 0; i < value.length; i++) {
		if (value[i] === "(") isInside++
		if (value[i] === ")") isInside--

		if (value[i] === splitCharacter && isInside === 0) {
			arr.push(value.substring(lastIndex, i))
			lastIndex = i + 1
		}
	}

	// Add the last item.
	arr.push(value.substring(lastIndex))
	return arr
}

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
 * Découpe un texte (string1)+(string2)-(string3) en [string1, string2, string3]
 * @param value
 */
export function splitAtSigns(value: string): string[] {
	return splitIfOutsideParentheses(value, "-")
		.map((element, index) => (index > 0 ? "-" + element : element))
		.map((element) => splitIfOutsideParentheses(element, "+"))
		.flat()
		.map((x) => x.trim())
		.filter((x) => x !== "")
}

export function braceSorter(value: string): string {
	return (
		value.split("{")[0] +
		"{" +
		value.split("{")[1].split("}")[0].split(";").sort().join(";") +
		"}" +
		(value.split("}")[1] ?? "")
	)
}

export function stripFirstCharacter(value: string): string {
	return value.substring(1)
}

export function stripLastCharacter(value: string): string {
	return value.substring(0, value.length - 1)
}


export function parseCoordinates(value: string): string[] {
	// les valeurs commencent et se termine par des parenthèses (obligatoire).
	return value.substring(1, value.length - 1).split(';')
}

export function checkParentheses(value: string): boolean {
	return !(value[0] !== "(" || value[value.length - 1] !== ")")
}
