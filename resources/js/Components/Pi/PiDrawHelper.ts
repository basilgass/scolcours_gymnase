import {computed, onMounted, ref, watch} from "vue"
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {NumExp} from "piexpression"

export interface IPiDrawProps {
	draw: WidgetPropsInterface
	height?: number,
	width?: number,
}

interface ISliderOptions {
	included?: boolean
	interval: number;
	marks: number[];
	max: number;
	min: number;
	tooltip?: string;
}

export interface ISlider {
	factor: string;
	key: string;
	label: boolean;
	options: ISliderOptions;
	tex: boolean;
	value: number;
}

export interface IDrawStep {
	body: string,
	code: string[]
}

type IDrawComputedValuePostProcess = (value: number) => number

export interface IDrawComputedValue {
	expr: NumExp
	key: string,
	postProcess: null | IDrawComputedValuePostProcess
	reference: string,
}

export interface IDrawCode {
	addMode: boolean
	computedValues: IDrawComputedValue[]
	foreground: string[]
	sliders: ISlider[],
	steps: IDrawStep[],
	tex: string | undefined,
}

interface ISliderValues {
	default: number,
	factor: string,
	included: boolean,
	interval: number,
	key: string,
	marks: (number | string)[]
	max: number,
	min: number,
	tex: string
}

// REFACTOR: création du parseOneSlider pour être plus clair.
function parseOneSlider(slider: string): ISliderValues {
	// $[key]=a,b,c,d		// tous les points sont donnés
	// $[key]=a,...,b		// intervalle par défaut: 1
	// $[key]=a,b,...,c		// intervalle donné par b-a

	// OPTIONS
	// $[key]=a,...,b/interval/factor=default~->TeX

	if (!slider.startsWith('$')) return null

	const [code, tex] = slider.split('->')
	const [key, values_Interval, dflt] = code.split('=')
	const [values, interval] = values_Interval.split('/')
}

// TODO: DOCUMENTER !!!!!!
function makeSlider(slider: string): ISlider | null {

	// A slider is
	// $a=a,b,...,c/interval=default
	// $a 			is the key
	// interval 	not given => interval = b-a
	// b-a			marks separation... or maybe all given manually !
	// default		value given at start
	const [keyOpt, ...arr] = slider.split("=").map(x => x.trim())
	const [keyLabel, factor] = keyOpt.split('*')
	const label = keyLabel.startsWith('$$')
	const key = label ? keyLabel.substring(1) : keyLabel

	const code = arr.join("=") // a,b,...,c/interval=default[~]

	const values = code.split("/")[0].split(',')
		.filter(x => x !== '...' && x !== '')
		.map(Number)
		.filter(x => !isNaN(x))

	// values.sort() // make sure the values are sorted.
	values.sort((a, b) => a - b)

	const autoMarks = code.includes(",...,")
	const intervalVal = code.includes("/") ? code.split("/")[1].split('=')[0] : undefined
	const defaultVal = code.includes("=") ? +code.split("=")[1] : undefined
	const included = code.endsWith("~")

	if (values.length < 2) {
		return null
	}

	const marks: number[] = []

	if (autoMarks && values.length === 3) {
		const [a, b, c] = values
		const marksInterval = b - a

		const c2 = (c - a) % marksInterval === 0
			? c
			: a + Math.ceil((c - a) / marksInterval) * marksInterval
		for (let i = a; i <= c2; i += marksInterval) {
			marks.push(i)
		}
	} else {
		values.forEach(v => marks.push(v))
	}

	if (marks.length < 2) {
		return null
	}

	return {
		key,
		value: defaultVal ?? values[0],
		tex: true,
		factor: factor === undefined ? "1" : factor,
		label,
		options: {
			min: values[0],
			max: values[values.length - 1],
			interval: intervalVal ? +intervalVal : marks.length > 1 ? marks[1] - marks[0] : 1,
			marks,
			tooltip: "none",
			included
		}
	}
}

export function PiDraw_Parse_Code(drawCode: string): IDrawCode {
	// Split the code in blocks
	const blocks: string[] = drawCode.split("\n\n")

	const tex = parseTexOutput(blocks)

	// From the first block, extract the sliders.
	const sliders: ISlider[] = parseSliders(blocks)

	const computedValues: IDrawComputedValue[] = parseComputedValued(blocks)

	// Find the foreground block
	const foreground = parseForeground(blocks)

	// Reformat all steps.
	const steps = parseSteps(blocks)

	return {
		tex,
		sliders,
		steps,
		foreground,
		computedValues,
		addMode: parseAddMode(blocks)
	}
}

function parseTexOutput(blocks: string[]): string | undefined {
	return blocks[0]
			.split("\n")
			.find(line => line.startsWith("$tex="))?.split("$tex=")[1]
		?? undefined
}

function parseComputedValued(blocks: string[]): IDrawComputedValue[] {
	const block = blocks[0].split("\n")
	const result: IDrawComputedValue[] = []

	block
		.filter((line: string) =>
			/^\$[a-z]\(\$[a-z]\)/.test(line) &&
			line.split('=').length === 2 &&
			!line.includes(',') &&
			line.includes('x'))
		.forEach(line => {
			const key = line.substring(0, 2)
			const reference = line.substring(3, 5)
			const [before, exprString] = line.split('=')
			const [, post] = before.split(':')

			let postProcess = null
			console.log(post, /^\.[0-9]+$/.test(post))
			if (/^\.[0-9]+$/.test(post)) {
				postProcess = (value: number) => +value.toFixed(+post.substring(1))
			}
			try {
				const expr = new NumExp(exprString)
				result.push({
					key,
					reference,
					expr,
					postProcess
				})
			} catch {
				// Do nothing
			}
		})

	return result
}

function parseSliders(blocks: string[]): ISlider[] {
	return blocks[0].split("\n")
		.filter((line: string) => {
			return line.startsWith("$") && !line.startsWith("$tex")
		})
		.map((slider: string) => {

			try {
				return makeSlider(slider)
			} catch {
				return null
			}
		})
		.filter(slider => slider !== null)
}

function parseAddMode(blocks: string[]): boolean {
	return blocks.some((block: string) => block.startsWith('%-FG-+'))
}

function parseForeground(blocks: string[]): string[] {
	const foregroundBlock = blocks.find((block: string) => block.startsWith("%-FG-")) ?? ""

	return foregroundBlock
		.split('\n')
		.filter((line: string) => !line.startsWith("%-FG-") && line.trim() !== "")
}

function parseSteps(blocks: string[]): { body: string, code: string[] }[] {
	return blocks
		.filter((block: string) => !block.startsWith("%-FG-"))
		.map((block: string) => {
			// Remove all lines starting with $
			const code: string[] = block
				.split("\n")
				.filter((line: string) => !line.startsWith("$") && line.trim() !== "")

			if (code.length === 0) {
				return null
			}

			// If the first line starts with %, remove it and store it as the body.
			const body: string = code[0].startsWith("%") ? code.shift().substring(1) : ""

			return {
				body,
				code
			}
		})
		.filter(block => block !== null)
}

export function piDrawHelper(props: IPiDrawProps) {

	const draw = computed(() => props.draw)

	// Split the code into three parts:
	// - the sliders, aka line starting with $[a-z]
	// - the steps, aka line blocks separated by two newlines
	// - the foreground, aka a line block starting with %-FG-

	const parsedCode = computed<IDrawCode>(() => {
		return PiDraw_Parse_Code(draw.value.code)
	})

	// Current stepper counter.
	const index = ref<number>(-1)

	// Count the number of steps in the code.
	const max = computed<number>(() => parsedCode.value.steps.length)

	// Determine if the stepper is running
	const running = computed(() => index.value >= 0)

	const code = computed<string[]>(() => {
		return [
			...parsedCode.value.foreground,
			...parsedCode.value.steps[Math.max(0, index.value)].code
		]
	})

	const body = computed<string>(() => {
		if (max.value > 1) {
			return index.value === -1 ? 'Marche à suivre' : parsedCode.value.steps[index.value].body
		}

		return ""
	})

	function updateSliders() {
		sliders.value = []
		parsedCode.value.sliders.forEach((slider: ISlider) => {
			sliders.value.push(slider)
		})
	}

	const sliders = ref<ISlider[]>([])
	watch(() => props.draw.code, () => {
		updateSliders()
	})

	onMounted(() => {
		updateSliders()
	})
	return {
		index,
		max,
		running,
		body,
		code,
		sliders
	}
}
