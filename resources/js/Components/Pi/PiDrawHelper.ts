import {computed, onMounted, ref, watch} from "vue"
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"

export interface IPiDrawProps {
	width?: number,
	height?: number,
	draw: WidgetPropsInterface
}

interface ISliderOptions {
	min: number;
	max: number;
	interval: number;
	marks: number[];
	tooltip?: string;
}

export interface ISlider {
	key: string;
	value: number;
	wrap: boolean;
	options: ISliderOptions;
}

export interface IDrawStep {
	body: string,
	code: string[]
}

export interface IDrawCode {
	tex: string | undefined,
	sliders: ISlider[],
	steps: IDrawStep[],
	foreground: string[]
}

function makeSlider(slider: string): ISlider | null {

	// A slider is
	// $a=a,b,...,c/interval=default
	// $a is the key
	// interval not given => interval = b-a
	// b-a: marks separation... or maybe all given manually !
	// default value given at start

	const [key, ...arr] = slider.split("=").map(x => x.trim())
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
	const wrap = code.endsWith("~")

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
		wrap,
		options: {
			min: values[0],
			max: values[values.length - 1],
			interval: intervalVal ? +intervalVal : marks.length > 1 ? marks[1] - marks[0] : 1,
			marks,
			tooltip: "none"
		}
	}
}

export function PiDraw_Parse_Code(drawCode: string): IDrawCode {
	// Split the code in blocks
	const blocks: string[] = drawCode.split("\n\n")

	const tex: string = blocks[0]
			.split("\n")
			.find(line => line.startsWith("$tex="))?.split("$tex=")[1]
		?? undefined

	// From the first block, extract the sliders.
	const sliders: ISlider[] = blocks[0].split("\n")
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


	// Find the foreground block
	const foreground: string[] = (blocks
		.find((block: string) => block.startsWith("%-FG-")) ?? "")
		.split('\n')
		.filter((line: string) => !line.startsWith("%-FG-") && line.trim() !== "")

	// Reformat all steps.
	const steps: {
		body: string,
		code: string[]
	}[] = blocks
		.filter((block: string) => !block.startsWith("%-FG-"))
		.map((block: string) => {
			// Remove all lines starting with $
			const code: string[] = block.split("\n").filter((line: string) => !line.startsWith("$") && line.trim() !== "")

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


	return {
		tex,
		sliders,
		steps,
		foreground
	}
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
