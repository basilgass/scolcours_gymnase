<script lang="ts" setup>
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {numberCorrection} from "@/helpers/helperFunctions"
import {Fraction, NumExp, Polynom} from "pimath"
/** Tools
 * title: tableau des valeurs d'une fonction
 * body: permet de créer un tableau des valeurs d'une fonction
 * parameters: fx=Fonction (texte), min=Nombre ou Fraction, max=Nombre ou Fraction, pas=Nombre ou Fraction
 * tags: algebre,1M
 */
import {computed, onMounted, ref, watch} from "vue"
import Card from "@/Components/Ui/Card.vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import FormInput from "@/Components/Form/FormInput.vue"
import ToolError from "@/Components/Tools/Parts/ToolError.vue"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "Fonction",
		type: "text",
		value: ref("2^x"),
		fromUrl: "fx",
		itemClass: 'col-span-2 md:col-span-4'
	},
	{
		label: "Borne inférieure",
		type: "text",
		value: ref("-5"),
		fromUrl: "xMin"
	},
	{
		label: "Borne supérieure",
		type: "text",
		value: ref("5"),
		fromUrl: "xMax"
	},
	{
		label: "Pas",
		type: "text",
		value: ref("0.5"),
		fromUrl: "step"
	},
	{
		label: "Arrondi",
		type: "text",
		value: ref("2"),
		fromUrl: "fixed"
	},
	{
		label: "tableau vertical",
		type: "switch",
		value: ref(true),
		fromUrl: "orientation",
		itemClass: 'col-span-1 md:col-span-2'
	},
	{
		label: "numérique",
		type: "switch",
		value: ref(false),
		fromUrl: "float",
		itemClass: 'col-span-1 md:col-span-2'
	}
])

// TODO: tableau des valeurs doit être restructurer pour fonctionner avec des valeurs trigonométriques.
// par exemple, borne inférieur: 3pi, pas: 2pi, etc...
// TODO: permettre un export TeX ou Excel.

const f = computed(() => forms[0].value.value as string)
const xMin = computed(() => forms[1].value.value as string)
const xMax = computed(() => forms[2].value.value as string)
const step = computed(() => forms[3].value.value as string)
const fixed = computed(() => forms[4].value.value as string)
const verticalTable = computed(() => forms[5].value.value as boolean)
const numericParse = computed(() => forms[6].value.value as boolean)

const activeInput = ref<number>(0)

interface ITableOfValue {
	x: string,
	fx: number,
	fxTex: string
}

const fx = computed<false | ITableOfValue[]>(() => {
	if (f.value === "") return false

	try {
		return getTableOfValues()
	} catch (e) {
		console.log(e)
		return false
	}
})
const isNumeric = computed(() => {
	return f.value.includes("sin") ||
		f.value.includes("cos") ||
		f.value.includes("tan")
})
const getTableOfValues = function (): ITableOfValue[] {
	let exp: NumExp | Polynom

	if (isNumeric.value || numericParse.value) {
		exp = new NumExp(f.value)
	} else {
		try {
			exp = new Polynom(f.value)
		} catch {
			try {
				exp = new NumExp(f.value)
			} catch {
				throw new Error("l'expression n'est pas reconnue.")
			}
		}
	}

	const x = new Fraction(Math.min(+xMin.value, +xMax.value))
	const vMax = new Fraction(Math.max(+xMin.value, +xMax.value))
	let vStep = +step.value === 0 ? 1 : +step.value

	const data = []

	let securityIncrement = 0

	while (x.value <= vMax.value) {
		let v = (exp instanceof Polynom)
			? exp.evaluate(x) as Fraction
			: {
				value: exp.evaluate({x: x.value}),
				tex: ""
			}

		data.push({
			x: x.value,
			fx: numberCorrection(v.value, +fixed.value),
			fxTex: v.tex
		})
		x.add(vStep)

		securityIncrement++

		if (securityIncrement > 100) {
			break
		}
	}

	return data
}

function checkIfNumeric() {
	if (fx.value && fx.value?.length > 0) {
		if (!numericParse.value && fx.value[0].fxTex === '') {
			forms.find(f => f.label === 'numérique').value.value = true
		}
	}
}

watch(fx, () => {
	checkIfNumeric()
})
onMounted(() => {
	checkIfNumeric()
})

function updateKbrd(event, index) {
	forms[index].value.value = event.input
}

const drawParams = ref('')
const drawParamsAuto = computed(() => {
	if (fx.value === false) {
		return ""
	}

	const yMin = Math.min(...fx.value.map(f => f.fx))
	const yMax = Math.max(...fx.value.map(f => f.fx))

	// On s'arraange pour que les unités y correspondent environ à l'horizontal.
	const dy = yMax - yMin
	const dx = +xMax.value - (+xMin.value)

	const scale = Math.round(dx / dy * 100) / 100
	const unitY = Math.abs(1 - scale) > 0.1 ? Math.max(0.1, scale) : 1

	return `axis,grid,x=${xMin.value}:${xMax.value},y=${yMin * scale - 1}:${yMax * scale + 1},unitY=${unitY}`
})

const draw = computed<WidgetPropsInterface>(() => {
	if (fx.value === false) {
		return null
	}
	const parameters = drawParams.value ? drawParams.value : drawParamsAuto.value

	return {
		parameters,
		code: `f(x)=${f.value}`
	}
})

</script>

<template>
	<article class="space-y-6">
		<tool-form
			:active="activeInput"
			:forms="forms"
			form-class="grid grid-cols-2 md:grid-cols-4 gap-3"
		/>

		<Card>
			<keyboard-display
				v-show="activeInput===0"
				back
				keyboard="polynom"
				next
				reset
				@change="updateKbrd($event, 0)"
				@next="activeInput=1"
			/>
			<keyboard-display
				v-show="activeInput===1"
				back
				keyboard="number"
				next
				reset
				@change="updateKbrd($event, 1)"
				@next="activeInput=2"
			/>
			<keyboard-display
				v-show="activeInput===2"
				back
				keyboard="number"
				next
				reset
				@change="updateKbrd($event, 2)"
				@next="activeInput=3"
			/>
			<keyboard-display
				v-show="activeInput===3"
				back
				keyboard="number"
				next
				reset
				@change="updateKbrd($event, 3)"
				@next="activeInput=4"
			/>
			<keyboard-display
				v-show="activeInput===4"
				back
				keyboard="number"
				next
				reset
				@change="updateKbrd($event, 4)"
				@next="activeInput=0"
			/>
		</Card>


		<Card v-if="fx">
			<div
				v-katex.ascii="`f(x) = ${f}`"
				class="katex-boxed"
			/>

			<div
				class="overflow-x-auto"
			>
				<div
					class="relative"
					:class="{
						'columns-1 md:columns-2 lg:columns-3 xl:columns-4': verticalTable,
						'flex flex-row': !verticalTable
					}"
				>
					<div
						class="bg-analyse-dark text-white *:border-analyse break-inside-avoid-column"
						:class="{
							'flex flex-row': verticalTable,
							'flex flex-col': !verticalTable
						}"
					>
						<div
							:class="{
								'w-[100px] border border-b-0': verticalTable,
								'w-[100px] border-b': !verticalTable
							}"
							v-katex="`x`"
						/>
						<div
							:class="{
								'flex-1 border-t border-r': verticalTable,
								'w-[100px] border-b flex-1 grid place-items-center ': !verticalTable
							}"
							v-katex="`f(x)`"
						/>
					</div>
					<div
						v-for="v of fx"
						:key="`item-${v.x}`"
						class="min-w-[4em]
							border-analyse border border-b-0
							*:border-analyse
							 break-inside-avoid-column"
						:class="{
							'flex flex-row': verticalTable,
							'flex flex-col min-w-[100px] border-r-0 last:border-r': !verticalTable
						}"
					>
						<div
							class="grid place-items-center
								bg-analyse-light"
							:class="{
								'border-r w-[100px] place-self-stretch': verticalTable,
								'border-b': !verticalTable
							}"
							v-katex="`${v.x}`"
						/>
						<div
							class=""
							:class="{
								'flex-1': verticalTable,
								'flex-1 grid place-items-center border-b': !verticalTable
							}"
							v-katex="`${ numericParse ? v.fx : v.fxTex}`"
						/>
					</div>
				</div>
			</div>
		</Card>
		<tool-error v-else />

		<Card if="draw">
			<FormInput
				type="text"
				v-model="drawParams"
				label="paramètres du graphe"
			/>
			<div class="font-code">
				{{ drawParamsAuto }}
			</div>
			<pi-draw-parser
				:draw
			/>
		</Card>
	</article>
</template>
