<script lang="ts" setup>
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
/** Tools
 * title: puissance modulaire
 * body: calcul d'une puissace modulaire
 * parameters: '37^1125mod6'
 * tags: arithmetiques,3C
 */
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import ToolError from "@/Components/Tools/Parts/ToolError.vue"

// Define the forms
const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "puissance",
		type: "text",
		value: ref("17^1234"),
		fromUrl: "x",
	},
	{
		label: 'modulo',
		type: "number",
		value: ref("6"),
		fromUrl: "mod",
	}
])
const A = computed<string>(() => forms[0].value.value as string)
const B = computed<string>(() => forms[1].value.value as string)

const result = computed(() => {
	try {
		return calculate()
	} catch (e) {
		console.warn(e)
		return false
	}
})

function calculate() {
	if (!Number.isSafeInteger(+B.value)) return false
	const mod = +B.value

	const [a, pow] = A.value.split('^').map(Number)

	if (!Number.isSafeInteger(a)) return false
	if (!Number.isSafeInteger(pow)) return false

	const powBin = pow.toString(2)
	const pow2: number[] = powBin
		.split('')
		.reverse()
		.map((x, index) => x === '1' ? Math.pow(2, index) : 0)

	const pmod: { pow: number, x_before: number, x2: number, x: number, add: boolean }[] = []
	pow2.forEach((_, index) => {
		if (index === 0) {
			pmod.push({
				pow: 1,
				x_before: a % mod,
				x2: a % mod,
				x: a % mod,
				add: pow2.includes(1)
			})
			return
		}

		const x1 = pmod[pmod.length - 1].x
		const x2 = Math.pow(x1, 2)
		const p = Math.pow(2, index)

		pmod.push({
			pow: p,
			x_before: x1,
			x2,
			x: x2 % mod,
			add: pow2.includes(p)
		})
	})

	const decompose = pmod.filter(value => value.add).map(value => value.x)

	return {
		a,
		pow,
		pow2: pow2.filter(x => x !== 0),
		pow2Tex: pow2.filter(x => x !== 0).map(value => `${result.value.a}^{${value}}`).join('\\cdot '),
		mod,
		x: (decompose.reduce((a, b) => a * b, 1)) % mod,
		pmod: '\\begin{array}{llll}' + pmod
			.map((value, index) => {
				return `${a}^{${value.pow}} & ${index > 0 ? `\\equiv ${value.x_before}^2` : ''} &${value.x2 !== value.x ? `\\equiv ${value.x2}` : ''} &  \\equiv ${!value.add ? '\\color{lightgray}' : ''} ${value.x}   \\mod ${mod}`
			}).join('\\\\') + '\\end{array}',
		decompose
	}
}
</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<Card v-if="result">
			<div class="max-w-lg mx-auto space-y-6">
				<div>
					<h3 class="font-semibold">
						décomposition de <span v-katex="result.pow" /> en puissance de 2
					</h3>
					<div v-katex.left="`${result.pow} = ${result.pow2.join('+')}`" />
				</div>

				<div>
					<h3 class="font-semibold">
						puissance modulaire incrémentale
					</h3>
					<div v-katex.left="result.pmod" />
				</div>

				<div>
					<h3 class="font-semibold">
						résultat final
					</h3>
					<div
						v-katex.left="`\\begin{aligned}
											${result.a}^{${result.pow}} &\\equiv ${result.a}^{${result.pow2.join('+')}}\\\\
											&\\equiv ${result.pow2Tex}\\\\
											&\\equiv ${result.decompose.join('\\cdot ')}\\\\
											&\\equiv ${result.x} \\mod ${result.mod}\\\\
											\\end{aligned}`"
					/>
				</div>
			</div>
		</Card>
		<tool-error v-else />
	</article>
</template>
