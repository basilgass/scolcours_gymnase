import { asciiToTex } from "@/Composables/keyboardConfig"
import { useKeyboard } from "@/Composables/useKeyboard"
import { Fraction, ISolution, PolyFactor, TABLE_OF_SIGNS } from "pimath"

const { keyboards } = useKeyboard()

interface ASYMPTOTE {
	tex: string,
	draw: string,
	delta?: {
		tex: string,
		table_of_signs: TABLE_OF_SIGNS
	},
}

interface EXTREMA {
	value: number,
	tex: string,
	type: "min" | "max" | "flat" | "undefined",
	x: { tex: string, value: number }
}

export interface ETUDE_DE_FONCTION_RATIONNELLE {
	fx: string
	domain: string
	roots: string,
	table_of_signs: TABLE_OF_SIGNS,
	asymptotes: {
		vertical: ASYMPTOTE[],
		horizontal: ASYMPTOTE[],
		slope: ASYMPTOTE[]
	},
	derivative: {
		fx: string,
		table_of_signs: TABLE_OF_SIGNS
	},
	extremes: EXTREMA[],
	draw: {
		code: string,
		parameters: string
	}

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
	const reduced = factorized.reduce()

	// const numeratorRoots = factorized.numerator.getZeroes()
	const denominatorsRoots = factorized.denominator.getZeroes()

	// Display function as TeX
	const fx = `f(x) = ${value.asRoot.tex} = ${factorized.asRoot.tex}`

	// Domain of the function
	const domain = PolyFactor_getDomain(denominatorsRoots)

	// Table of sign
	const table_of_signs = factorized.tableOfSigns()

	// Roots
	const rootsValues = factorized.getZeroes().map((x, index) => {
		if (table_of_signs.signs[2 * index + 1] === "z") {
			return x.exact ? x.tex : x.value.toFixed(2)
		}

		return null
	}).filter(x => x !== null)
	const roots = rootsValues.length === 0 ? "\\varnothing" : `S=\\left\\{ ${rootsValues.join(";")} \\right\\}`

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
			return { x: item.value, y: 0 }
		}),
		...dfx.getZeroes().map(item => {
			return { x: item.value, y: 0 }
		}),
		...extremes.filter(item => item.type !== 'undefined').map(item => {
			return { x: item.x.value, y: item.value }
		})
	)

	const parameters = `grid,axis,x=${BBox.x.min}:${BBox.x.max},y=${BBox.y.min}:${BBox.y.max}`
	let code = `f(x)=${factorized.asRoot.display}->thick,blue`

	// Draw the asymptotes
	vertical.forEach(av => code += `\n${av.draw}`)
	horizontal.forEach(av => code += `\n${av.draw}`)
	slope.forEach(av => code += `\n${av.draw}`)

	// Draw particular points.
	// TODO: Filter if some point are the same !
	
	// roots
	// TODO: root is in TeX : must be more clever !
	rootsValues.forEach((root, index) => code += `\nZ${index}(${root},0)->tex=@`)

	// Extremes
	extremes.filter(x => x.type!=='undefined').forEach((extreme, index) => {
		code += `\nE${index}(${extreme.x.value},${extreme.value})->tex=\\left(${extreme.x.tex};${extreme.tex}\\right)/${extreme.type === "max" ? "t" : "b"}c`
	})

	// Add asymptote's delta roots.

	return {
		fx,
		domain,
		table_of_signs,
		roots,
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

		if (Number.isFinite(evaluatedValue.value)) {
			return {
				tex: `\\lim_{x\\to ${valueAsTex} } f(x) = ${evaluatedValue.tex} \\implies \\text{point limite}: \\left(${valueAsTex};${evaluatedValue.tex}\\right)`,
				draw: `P${index + 1}(${value.value};${evaluatedValue.value})->red`
			}
		} else {
			return {
				tex: `\\lim_{x\\to ${valueAsTex} } f(x) = \\infty \\implies x=${valueAsTex}`,
				draw: `a${index + 1}=line x=${value.value}->red`
				// draw: `A${index + 1}(${value.value},0)->hide\nB${index + 1}(${value.value},1)->hide\na${index + 1}=A${index + 1}B${index + 1}->red`
			}
		}
	})
}

function PolyFactor_getAsymptotes_Horizontal_or_Slope(factorized: PolyFactor, delta_degrees: number): ASYMPTOTE[] {
	// TODO: Repeated parts...
	const numerator = factorized.numerator
	const denominator = factorized.denominator
	const numDegree = numerator.degree().value
	const denDegree = denominator.degree().value

	if (numDegree !== denDegree + delta_degrees) {
		return []
	}

	const numeratorPolynom = factorized.numerator.develop().factors[0].polynom
	const denominatorPolynom = factorized.denominator.develop().factors[0].polynom

	const { quotient, reminder } = numeratorPolynom.euclidean(denominatorPolynom)
	const delta_PolyFactor = new PolyFactor().fromPolynom(reminder)
		.divide(denominator)

	return [
		{
			tex: `y = ${quotient.tex}`,
			draw: `a=line y=${quotient.display}->green`,
			delta: {
				tex: `\\delta(x) = \\frac{${reminder.tex}}{${denominator.asRoot.tex}}`,
				table_of_signs: delta_PolyFactor.tableOfSigns()
			}
		}
	]
}

function PolyFactor_getExtremes(fx: PolyFactor, dfx: PolyFactor, dfx_table_of_signs:TABLE_OF_SIGNS): EXTREMA[] {

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
				type: 'undefined'
			}
		}

		const previousSign = dfx_table_of_signs.signs[2 * index]
		const nextSign = dfx_table_of_signs.signs[2 * index + 2]

		const type = previousSign === nextSign ? "flat" :
			previousSign === "+" ? "max" : "min"
		if (x.exact) {
			const value = fx.evaluate(x.exact as Fraction) as Fraction

			return {
				x: {
					tex: x.tex,
					value: x.value
				},
				tex: value.tex,
				value: value.value,
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

// TODO: update makeStudyFromCode to the new version (for keyboard)
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
					tex: { x: 1, y: 2 },
					type: t,
					value: { x: 1, y: 2 },
					label
				}
			}
		}

		return {
			zeroes: zeroes.split(",").map(x => {
				return { tex: keyboards.exact.tex(x) }
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
			return { tex: keyboards.exact.tex(x) }
		}).filter(x => x.tex !== ""),
		factors: [],
		signs: [["", ...signs.split(""), ""]]
	}
}
