import {asciiToTex} from "@/Composables/keyboardConfig"
import {useKeyboard} from "@/Composables/useKeyboard.ts"
import {Fraction, ISolution, PolyFactor, TABLE_OF_SIGNS} from "pimath"

const {keyboards} = useKeyboard()

const DIGITS = 2

interface ASYMPTOTE {
	answer: string,
	delta?: {
		tex: string,
		table_of_signs: TABLE_OF_SIGNS,
		roots: {
			x: { value: number, display: string }, y: { value: number, display: string },
			answer: string	// les intersections avec l'asymptote
		}[]
	},
	draw: string,
	tex: string,
}

interface EXTREMA {
	answer: string,
	tex: string,
	type: "min" | "max" | "flat" | "undefined",
	value: number,
	x: { tex: string, value: number }
}

export interface ETUDE_DE_FONCTION_RATIONNELLE {
	YIntercept: {
		tex: string,
		draw: string,
		answer: string
	},
	asymptotes: {
		vertical: ASYMPTOTE[],
		horizontal: ASYMPTOTE[],
		slope: ASYMPTOTE[]
	},
	derivative: {
		fx: string,
		table_of_signs: TABLE_OF_SIGNS
	},
	domain: string
	draw: {
		code: string,
		parameters: string
	}
	environnement: {
		answer: string
	},
	extremes: EXTREMA[],
	fx: string
	fxKeyboard: string
	roots: {
		values: ISolution[],
		answers: string[],
		ed: string
	},
	table_of_signs: TABLE_OF_SIGNS,

}

export function makeStudyFromPolynoms(numerator: string, denominator: string): ETUDE_DE_FONCTION_RATIONNELLE {
	let fx: PolyFactor = new PolyFactor()
	try {
		fx.fromPolynom(numerator, denominator)
	} catch {
		throw new Error("La fonction rationnelle n'est pas formatée correctement !")
	}

	return makeStudyFromPolyFactor(fx)
}

export function makeStudyFromPolyFactor(value: PolyFactor): ETUDE_DE_FONCTION_RATIONNELLE {
	const factorized = value.factorize()
	const reduced = factorized.clone().reduce()

	// const numeratorRoots = factorized.numerator.getZeroes()
	const denominatorsRoots = factorized.denominator.getZeroes()

	// Display function as TeX
	const fx = `f(x) = ${value.asRoot.tex} = ${factorized.asRoot.tex}`
	const fxKeyboard = `p=${value.display}`

	// Domain of the function
	const domain = PolyFactor_getDomain(denominatorsRoots)

	// Table of sign
	const table_of_signs = factorized.tableOfSigns()

	const Yevaluate = value.evaluate(0) as Fraction

	const YIntercept = Yevaluate.isInfinity()
		? null
		: {
			tex: `H=(${0};${Yevaluate.tex})`,
			draw: `H(${0},${Yevaluate.value.toFixed(DIGITS)})`,
			answer: `(0;${Yevaluate.display})`
		}
	// Roots
	const zeroes = factorized.getZeroes()
		.filter((x, index) => table_of_signs.signs[2 * index + 1] === "z")

	const rootsValues = zeroes
		.map((x) => x.exact ? x.tex : x.value.toFixed(DIGITS))
		.filter(x => x !== null)

	const roots = {
		ed: rootsValues.length === 0 ? "\\varnothing" : `S=\\left\\{ ${rootsValues.join(";")} \\right\\}`,
		values: zeroes,
		answers: zeroes.map(z => `(${z.display};0)`)
	}

	// Asymptotes
	const vertical = PolyFactor_getAsymptotes_Vertical(reduced, denominatorsRoots)
	const horizontal = PolyFactor_getAsymptotes_Horizontal_or_Slope(factorized, 0)
	const slope = PolyFactor_getAsymptotes_Horizontal_or_Slope(factorized, 1)

	// Derivative
	const dfx = value.clone().derivative().factorize()

	const derivative_fx = `f'(x) = ${dfx.asRoot.tex}`
	const derivative_table_of_signs = dfx.tableOfSigns()
	const extremes = PolyFactor_getExtremes(value, dfx, derivative_table_of_signs)

	// TODO: Etude de fonction rationnelle : Curves
	const BBox = getBBox(
		...factorized.getZeroes().map(item => {
			return {x: item.value, y: 0}
		}),
		...dfx.getZeroes().map(item => {
			return {x: item.value, y: 0}
		}),
		...extremes.filter(item => item.type !== 'undefined').map(item => {
			return {x: item.x.value, y: item.value}
		})
	)

	const parameters = `grid,axis,x=${BBox.x.min}:${BBox.x.max},y=${BBox.y.min}:${BBox.y.max}`
	let code = `f(x)=${factorized.asRoot.display}->thick,blue`

	// Draw the asymptotes
	const asymptotes = [...vertical, ...horizontal, ...slope]

	asymptotes.forEach(a => {
		code += `\n${a.draw}`
		if (a.delta) {
			a.delta.roots.forEach(
				(root, index) => code += `\nA${index}(${+root.x.value.toFixed(2)},${+root.y.value.toFixed(2)})->tex=@`)
		}
	})

	// Draw particular points.
	if (YIntercept) code += `\n${YIntercept.draw}->tex=@/mr`

	// roots
	rootsValues.forEach((root, index) => code += `\nZ${index}(${root},0)->tex=@`)

	// Extremes
	extremes.filter(x => x.type !== 'undefined').forEach((extreme, index) => {
		code += `\nE${index}(${extreme.x.value},${extreme.value})->tex=\\left(${extreme.x.tex};${extreme.tex}\\right)/${extreme.type === "max" ? "t" : "b"}c`
	})

	// Add asymptote's delta roots.

	// Environnment
	const environnement: string[] = []
	if (horizontal.length + slope.length === 0) {
		environnement.push('env')
		environnement.push(table_of_signs.signs[0] === '+' ? 'LT' : 'LB')
		environnement.push(table_of_signs.signs[table_of_signs.signs.length - 1] === '+' ? 'RT' : 'RB')
	}

	return {
		fx,
		fxKeyboard,
		domain,
		table_of_signs,
		roots,
		YIntercept,
		environnement: {
			answer: environnement.join('&')
		},
		asymptotes: {
			vertical,
			horizontal,
			slope
		},
		derivative: {
			fx: derivative_fx,
			table_of_signs: derivative_table_of_signs
		},
		extremes,
		draw: {
			parameters,
			code
		}
	}
}


function PolyFactor_getDomain(roots: ISolution[]): string {
	let domain = "\\mathbb{R}"
	if (roots.length > 0) {
		if (roots.filter(x => x.value === 0).length > 0) {
			domain += "^*"
		}
		if (roots.filter(x => x.value !== 0).length > 0) {
			domain += `\\setminus\\left\\{${roots.filter(x => x.value !== 0).map(x => x.tex).join(";")}\\right\\}`
		}
	}
	return domain
}

function PolyFactor_getAsymptotes_Vertical(reduced: PolyFactor, roots: ISolution[]): ASYMPTOTE[] {
	return roots.map((value, index) => {
		const evaluatedValue = reduced.evaluate(value.value) as Fraction
		const valueAsTex = value.tex

		const evaluateBefore = reduced.evaluate(value.value - 0.001, true) as number
		const evaluateAfter = reduced.evaluate(value.value + 0.001, true) as number

		if (Number.isFinite(evaluatedValue.value)) {
			return {
				tex: `\\lim_{x\\to ${valueAsTex} } f(x) = ${evaluatedValue.tex} \\implies \\text{point limite}: \\left(${valueAsTex};${evaluatedValue.tex}\\right)`,
				draw: `P${index + 1}(${value.value},${evaluatedValue.value})->o=10,color=red,fill=white,tex=\\left(${value.tex};${evaluatedValue.tex}\\right)/bc`,
				answer: `t(${value.display};${evaluatedValue.display})`
			}
		} else {
			const anchors = [
				evaluateBefore > 0 ? 'LT' : 'LB',
				evaluateAfter > 0 ? 'RT' : 'RB'
			]
			return {
				tex: `\\lim_{x\\to ${valueAsTex} } f(x) = \\infty \\implies x=${valueAsTex}`,
				draw: `a${index + 1}=line x=${value.value}->red`,
				answer: [`x=${value.display}`, ...anchors].join('&')
				// draw: `A${index + 1}(${value.value},0)->hide\nB${index + 1}(${value.value},1)->hide\na${index + 1}=A${index + 1}B${index + 1}->red`
			}
		}
	})
}

function PolyFactor_getAsymptotes_Horizontal_or_Slope(factorized: PolyFactor, delta_degrees: number): ASYMPTOTE[] {
	const numerator = factorized.numerator
	const denominator = factorized.denominator
	const numDegree = numerator.degree().value
	const denDegree = denominator.degree().value

	if (numDegree !== denDegree + delta_degrees) {
		return []
	}

	const numeratorPolynom = factorized.numerator.develop().factors[0].polynom
	const denominatorPolynom = factorized.denominator.develop().factors[0].polynom

	const {quotient, reminder} = numeratorPolynom.euclidean(denominatorPolynom)
	const delta_PolyFactor = new PolyFactor().fromPolynom(reminder)
		.divide(denominator)

	const tos_delta = delta_PolyFactor.tableOfSigns()

	const anchors = [
		tos_delta.signs[0] === '+' ? 'LT' : 'LB',
		tos_delta.signs[tos_delta.signs.length - 1] === '+' ? 'RT' : 'RB'
	]

	// recherche des points d'intersections avec l'asymptote.
	const roots: {
		x: { value: number, display: string },
		y: { value: number, display: string },
		answer: string
	}[] = []

	tos_delta.signs.forEach((sign, index) => {
		if (sign === 'z') {
			const root = tos_delta.roots[(index - 1) / 2]

			const x = root.exact instanceof Fraction
				? {value: root.exact.value, display: root.exact.display}
				: {value: root.value, display: root.value.toFixed(2)}

			const evaluatedY = root.exact instanceof Fraction
				? (quotient.evaluate({x: root.exact}) as Fraction)
				: quotient.evaluate({x: x.value}) as number

			const y = typeof evaluatedY === 'number'
				? {value: evaluatedY, display: evaluatedY.toFixed(2)}
				: {value: evaluatedY.value, display: evaluatedY.display}

			roots.push({
				x,
				y,
				answer: `(${x.display};${y.display})`
			})
		}
	})

	return [
		{
			tex: `y = ${quotient.tex}`,
			draw: `a=line y=${quotient.display}->green`,
			answer: [`y=${quotient.display}`, ...anchors].join('&'),
			delta: {
				tex: `\\delta(x) = \\frac{${reminder.tex}}{${denominator.asRoot.tex}}`,
				table_of_signs: delta_PolyFactor.tableOfSigns(),
				roots
			}
		}
	]
}

function PolyFactor_getExtremes(fx: PolyFactor, dfx: PolyFactor, dfx_table_of_signs: TABLE_OF_SIGNS): EXTREMA[] {

	return dfx.getZeroes().map((x, index) => {

		// Evaluate the extremes if needed.
		if (dfx_table_of_signs.signs[2 * index + 1] === "d") {
			return {
				x: {
					tex: x.tex,
					value: x.value
				},
				tex: '',
				value: NaN,
				answer: null,
				type: 'undefined'
			}
		}

		const previousSign = dfx_table_of_signs.signs[2 * index]
		const nextSign = dfx_table_of_signs.signs[2 * index + 2]

		const type = previousSign === nextSign ? "flat" :
			previousSign === "+" ? "max" : "min"
		const atype = previousSign === nextSign ? "_" :
			previousSign === "+" ? "M" : "m"

		if (x.exact) {
			const value = fx.evaluate(x.exact as Fraction) as Fraction

			return {
				x: {
					tex: x.tex,
					value: x.value
				},
				tex: value.tex,
				value: value.value,
				answer: `${atype}(${x.display};${value.display})`,
				type
			}
		}

		const value = fx.evaluate(x.value, true) as number

		return {
			x: {
				tex: x.value.toFixed(2),
				value: x.value
			},
			tex: value.toFixed(2),
			value: value,
			answer: `${atype}(${x.value.toFixed(DIGITS)};${value.toFixed(DIGITS)})`,
			type
		}
	})
}

function getBBox(...items: { x: number, y: number }[]): {
	x: { min: number, max: number },
	y: { min: number, max: number }
} {

	const defaultBound = 10
	const offsetBound = 3

	const itemsX = items.map(value => value.x)
	const itemsY = items.map(value => value.y)

	const calculated_xMin = Math.min(...itemsX)
	const calculated_xMax = Math.max(...itemsX)
	const calculated_yMin = Math.min(...itemsY)
	const calculated_yMax = Math.max(...itemsY)

	return {
		x: {
			min: Math.min(-defaultBound, calculated_xMin - offsetBound),
			max: Math.max(defaultBound, calculated_xMax + offsetBound)
		},
		y: {
			min: Math.min(-defaultBound, calculated_yMin - offsetBound),
			max: Math.max(defaultBound, calculated_yMax + offsetBound)
		}
	}
}

export function makeStudyFromCode(code: string, showCoords: boolean, displayMode?: boolean) {
	const [zeroes, signs, grows, coords] = code.split("@")

	if (grows !== undefined) {
		const extremes = {},
			zeroesValues = zeroes.split(",")
		let extremesValues = coords ? coords.split(",") : []


		if (!showCoords) {
			extremesValues = []
		}

		for (const i in zeroesValues) {
			const z = zeroesValues[i],
				g = grows[2 * (+i) + 1]

			if (g !== undefined) {
				let t = ""
				if (g === "M") {
					t = "max"
				} else if (g === "m") {
					t = "min"
				} else if (g === "_") {
					t = "replat"
				}

				let label = " "

				if (extremesValues[i] !== undefined) {
					// if in writing mode, show a question mark
					if (displayMode) {
						if (extremesValues[i] !== "") {
							label = `\\left(${z};${asciiToTex(extremesValues[i])}\\right)`
						}

					} else {
						label = `\\left(${z};${extremesValues[i] === "" ? "?" : asciiToTex(extremesValues[i])}\\right)`
					}
				}

				extremes[keyboards.exact.tex(z)] = {
					tex: {x: 1, y: 2},
					type: t,
					value: {x: 1, y: 2},
					label
				}
			}
		}

		return {
			zeroes: zeroes.split(",").map(x => {
				return {tex: keyboards.exact.tex(x)}
			}).filter(x => x.tex !== ""),
			factors: [],
			extremes,
			type: "grows",
			grows: [...grows.split("")],
			signs: [
				["", ...signs.split(""), ""],
				["", ...signs.split(""), ""]
			]
		}
	}

	return {
		zeroes: zeroes.split(",").map(x => {
			return {tex: keyboards.exact.tex(x)}
		}).filter(x => x.tex !== ""),
		factors: [],
		signs: [["", ...signs.split(""), ""]]
	}
}
