export const NUMBERSET_TRUNCATE_THRESHOLD = 12

export interface NumberSetResult {
	values: number[]
	errors: string[]
	sorted: boolean
}

export function parseNumberSet(input: string): NumberSetResult {
	const errors: string[] = []

	if (!input || !input.trim()) {
		return {values: [], errors, sorted: true}
	}

	const tokens = input.split(',').map(t => t.trim()).filter(t => t.length > 0)
	const rawValues: number[] = []
	let sorted = true
	let lastValue: number | null = null

	for (const token of tokens) {
		let m = token.match(/^(-?\d+)$/)
		if (m) {
			const n = parseInt(m[1], 10)
			if (lastValue !== null && n <= lastValue) sorted = false
			rawValues.push(n)
			lastValue = n
			continue
		}

		m = token.match(/^(-?\d+)\.\.(-?\d+)$/)
		if (m) {
			const a = parseInt(m[1], 10)
			const b = parseInt(m[2], 10)
			if (a > b) {
				errors.push(`Range inversé: "${token}"`)
				sorted = false
				for (let i = b; i <= a; i++) rawValues.push(i)
				lastValue = a
			} else {
				if (lastValue !== null && a <= lastValue) sorted = false
				for (let i = a; i <= b; i++) rawValues.push(i)
				lastValue = b
			}
			continue
		}

		m = token.match(/^(\d+)-(\d+)$/)
		if (m) {
			const a = parseInt(m[1], 10)
			const b = parseInt(m[2], 10)
			if (a > b) {
				errors.push(`Range inversé: "${token}"`)
				sorted = false
				for (let i = b; i <= a; i++) rawValues.push(i)
				lastValue = a
			} else {
				if (lastValue !== null && a <= lastValue) sorted = false
				for (let i = a; i <= b; i++) rawValues.push(i)
				lastValue = b
			}
			continue
		}

		if (/^-?\d+--?\d+$/.test(token)) {
			errors.push(`Range avec négatifs : utilisez ".." au lieu de "-" dans "${token}"`)
			continue
		}

		errors.push(`Token invalide: "${token}"`)
	}

	if (!sorted) {
		errors.push("Les éléments ne sont pas dans l'ordre croissant")
	}

	const values = Array.from(new Set(rawValues)).sort((a, b) => a - b)

	return {values, errors, sorted}
}

export function formatNumberSetKatex(values: number[]): string {
	if (values.length === 0) return '\\emptyset'
	if (values.length <= NUMBERSET_TRUNCATE_THRESHOLD) {
		return `\\big\\{ ${values.join(';')} \\big\\}`
	}
	const head = values.slice(0, 3).join(';')
	const tail = values.slice(-2).join(';')
	return `\\big\\{ ${head};\\ldots;${tail} \\big\\} \\implies \\# = ${values.length}`
}