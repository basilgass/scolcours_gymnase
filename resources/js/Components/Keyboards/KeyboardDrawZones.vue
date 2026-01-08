<script lang="ts" setup>
import {PiDraw} from "pidraw"
import {computed, nextTick, onMounted, ref, useTemplateRef} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import type {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/types/keyboardInterfaces.ts"
import {Equation, Line, NumExp} from "pimath"

const svgContainer = useTemplateRef<InstanceType<typeof PiDrawParser>>('svgContainer')

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
let pidraw: PiDraw = null
type FigureType = typeof pidraw.figures[0]

function onChange(value?: { draw: PiDraw, mouse: MouseEvent }): void {
	// pidraw = value.draw
	const target = value.mouse?.target as SVGElement

	if (target && target.dataset?.zone) {
		zones[target.dataset.zone] = !zones[target.dataset.zone]
	}

	setInput().then((x) => emits("change", x))
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {

	// { draw: PiDraw, mouse: MouseEvent }
	if (value !== undefined) {
		// pidraw.update([], true)
		reset()

		value.split(',').forEach(zone => {
			if (Object.hasOwn(zones, zone)) {
				zones[zone] = true
			}
		})
	}

	const inputs: string[] = []

	for (const name in zones) {
		const poly = pidraw.figures[name] as FigureType
		if (zones[name]) {
			inputs.push(name)
			poly.fill(color.value)
		} else {
			poly.shape.fill('transparent')
		}
	}

	inputs.sort()

	return {
		input: inputs.join(','),
		tex: "",
		raw: getSvg()
	}
}

function getSvg() {
	return pidraw.rootSVG.svg()
}

function reset() {
	for (const zone in zones) {
		zones[zone] = false
	}
}

defineExpose<KeyboardExposeInterface>({
	reset,
	setInput,
	parameters: ""
})

/* ------------------*/
const code = ref<string>("")
const parameters = ref<string>("")
const zones: Record<string, boolean> = {}
const color = ref<string>("")
const dy = 20

const draw = computed(() => {
	return {
		parameters: parameters.value,
		code: code.value,
	}
})

function makeColumnPoints(expression: NumExp | number, x: number, index: number, visibility?: string | undefined): string[] {

	const y = typeof expression === 'number' ? expression : expression.evaluate({x})

	return [
		`P${index}(${x},${y + dy})`,
		`X${index}(${x},0)->o,fill=black${visibility === 'z' ? '' : ',!'}`,
		`L${index}(${x},${y})->o,fill=black${visibility === 'a' ? '' : ',!'}`,
		`N${index}(${x},${y - dy})`,
	]
}

function makePolygons(index: number, isAOAbove?: boolean): string[] {
	zones[`p${index + 1}`] = false
	zones[`n${index + 1}`] = false

	if (isAOAbove === undefined) {
		return [
			`p${index + 1}=poly L${index},L${index + 1},P${index + 1},P${index}->w=0`,
			`n${index + 1}=poly L${index},L${index + 1},N${index + 1},N${index}->w=0`
		]
	}

	zones[`m${index + 1}`] = false

	// le relativePosition indique si l'AO est en dessus ou en dessus de l'axe des x
	if (isAOAbove === true) {
		// l'asymptote est en dessus.
		return [
			`p${index + 1}=poly L${index},L${index + 1},P${index + 1},P${index}->w=0`,
			`m${index + 1}=poly L${index + 1},L${index},X${index},X${index + 1}->w=0`,
			`n${index + 1}=poly X${index},X${index + 1},N${index + 1},N${index}->w=0`
		]
	}

	return [
		`p${index + 1}=poly X${index},X${index + 1},P${index + 1},P${index}->w=0`,
		`m${index + 1}=poly L${index + 1},L${index},X${index},X${index + 1}->w=0`,
		`n${index + 1}=poly L${index},L${index + 1},N${index + 1},N${index}->w=0`
	]

}

function compute_zones(zeroes: number[], signs: string[], expression: NumExp, splitAtAxis?: boolean): string {
	const codeLines: string[] = []
	const codeZones: string[] = []

	// première colonne de point, sur la gauche
	codeLines.push(...makeColumnPoints(expression, -dy, 0, undefined))

	// on rajoute une colonne de point, sur la droite
	zeroes.push(dy)

	// création des zones
	zeroes.forEach((zero, index) => {
		// récupération du signe: z (zero), a (sur l'asymptote), d (défense)
		const sign = signs[index]
		if (sign === 'z' || sign === 'a') {
			codeLines.push(`z${index}=line x=${zero}->dot,gray,w=1`)
		} else if (sign === 'd') {
			codeLines.push(`v${index}=line x=${zero}->red`)
		}

		// Création des points
		const points = makeColumnPoints(expression, zero, index + 1, sign)
		codeLines.push(...points)

		// création des zones
		// c'est les zones à gauche du point consulté.
		const addZones = makePolygons(index,
			splitAtAxis
				? expression.evaluate({
				x: index === 0 ? -dy : zeroes[index - 1] + 0.01
			}) > 0
				: undefined
		)
		codeZones.push(...addZones)
	})

	// Fusion des points et des zones.
	codeLines.push(...codeZones)

	return codeLines.join('\n')
}

/**
 * enlève du tableau des signes les valeurs + et -
 * @param value
 */
function reduceSigns(value: string): string[] {
	return value.split("").filter(x => x !== '-' && x !== '+')
}

function parseTos(tos: string): { zeroes: number[], signs: string[] } {
	const [zeroesStr, signsStr] = tos.split('@')
	const zeroes = zeroesStr.split(",").map(Number)
	const signs = reduceSigns(signsStr)

	return {zeroes, signs}
}

function compute_with_TOS(tos: string) {

	const {zeroes, signs} = parseTos(tos)
	const expression = new NumExp("0")

	code.value = compute_zones(zeroes, signs, expression)
}

function compute_with_AO_and_TOS(ao: string, tos: string) {

	const {zeroes, signs} = parseTos(tos)
	const expression = new NumExp(ao.split('=')[1])

	code.value = `a=line ${ao}->green,w=2\n`
		+ compute_zones(
			zeroes,
			signs.map(x => x === 'z' ? 'a' : 'd'),
			expression)

}

function compute_with_All(tos: string, ao: string, aotos: string) {

	const {signs: signsArr, zeroes: zeroValues} = parseTos(tos)
	const {signs: AOsignsArr, zeroes: AOzeroValues} = parseTos(aotos)

	const expression = new NumExp(ao.split('=')[1])

	// Tous les zéros, dans l'ordre.
	const zeroesSet = new Set([
		...zeroValues,
		...AOzeroValues
	])

	// Si l'asymptote coupe l'abscisse, on récupère le zéro.
	const line = new Line().fromEquation(new Equation(ao))
	if (!line.slope.isZero()) {
		zeroesSet.add(line.height.clone().opposite().divide(line.slope).value)
	}

	// Création de la liste unique des zéros, dans l'ordre croissant.
	const zeroes = [...zeroesSet]
	zeroes.sort((a, b) => +a - (+b))

	// Calculs du positionnement de l'asymptote par rapport à l'abscisse.
	const signs: string[] = []

	zeroes.forEach(zero => {
		const aIndex = zeroValues.findIndex(x => x === zero)
		const bIndex = AOzeroValues.findIndex(x => x === zero)
		const a = aIndex >= 0 ? signsArr[aIndex] : null
		const b = bIndex >= 0 ? AOsignsArr[bIndex] : null

		signs.push(a === 'd' || b === 'd' ? 'd' : a === null ? 'a' : 'z')
	})

	code.value =
		`a=line ${ao}->green,w=2\n`
		+ compute_zones(zeroes, signs, expression, true)
}

function makeInput() {
	const inputs = props.keyboard.parameters.find(p => p.startsWith('input='))?.split('input=')[1].split(',') ?? []
	if (inputs.length > 0) {
		// le code est fait "à la main"
		inputs.forEach(inp => {
			zones[inp] = false
		})
		code.value = props.keyboard.values.join('\n')
		return
	}

	const tos = props.keyboard.parameters.find(p => p.startsWith('tos='))?.split('tos=')[1]
	const ao = props.keyboard.parameters.find(p => p.startsWith('ao='))?.split('ao=')[1]
	const aotos = props.keyboard.parameters.find(p => p.startsWith('aotos='))?.split('tos=')[1]

	if (tos && !ao) {
		compute_with_TOS(tos)
		return
	}
	if (!tos && ao && aotos) {
		compute_with_AO_and_TOS(ao, aotos)
		return
	}

	if (tos && ao && aotos) {
		// version la plus complexe.
		compute_with_All(tos, ao, aotos)
		return
	}

	console.warn('Aucune valeur de génération reconnue pour les zones.')
}

onMounted(() => {
	parameters.value = props.keyboard.parameters.find(p => p.startsWith('p='))?.substring(2) ?? "axis,grid,x=-5:5,y=-5:5"
	color.value = props.keyboard.parameters.find(p => p.startsWith('color='))?.substring(6) ?? 'yellow/0.4'

	makeInput()

	// Pour toutes les zones clickable, on ajoute un "data-zone" après le dessin
	nextTick(() => {
		Object.keys(zones).forEach(name => {
			const poly = pidraw.figures[name]

			if (poly) {
				poly.shape.attr({'data-zone': name})
			}
		})
	})

})

function onComponentMounted(draw: PiDraw) {
	pidraw = draw

	nextTick(() => {
		onChange({draw, mouse: null})
	})

}
</script>

<template>
	<div>
		<pi-draw-parser
			ref="svgContainer"
			:draw
			@mounted="onComponentMounted"
			@draw-click="onChange"
		/>
	</div>
</template>
