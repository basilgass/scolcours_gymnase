<script setup lang="ts">
import {Monom, PolyFactor, Polynom} from "pimath"
import {computed, ref} from "vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {
	KeyboardResolutionFactorisationEmits
} from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionHelpers.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import KeyboardResolutionFactorisationWrapper
	from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionFactorisationWrapper.vue"
import {KeyboardInputInterface} from "@/types/keyboardInterfaces.ts"

const props = defineProps<{
	polynom: Polynom
}>()

const isSuccess = ref<boolean>(false)
const errorMessage = ref<string>('')

const selector = ref<'a' | 'b'>('a')
const a = ref<string>('?')
const b = ref<string>('?')

const tex = computed<string>(() => {
	const pf = makePolyFactor()
	return pf
		? `\\def\\arraystretch{1.5em}\\begin{aligned} &${props.polynom.tex} = \\\\ & ${isSuccess.value ? '\\color{#6c6}' : ''}${pf.tex} = \\\\ & \\scriptsize ${pf.clone().develop().tex} \\end{aligned}`
		: '?'
})

const remProducts2 = [
	"(a+b)^2",
	"(a-b)^2",
	"(a+b)(a-b)",
]

const remProducts3 = [
	"(a+b)^3",
	"(a-b)^3",
	"(a+b)(a^2-ab+b^2)",
	"(a-b)(a^2+ab+b^2)"
]

const useableProducts = computed<string[]>(() => {
	const degree = props.polynom.degree().value

	switch (degree) {
		case 0:
		case 1:
			return []
		case 2:
			return remProducts2
		case 3:
			return remProducts3
		default:
			return [...remProducts2, ...remProducts3]
	}
})
const selectProduct = ref<string | null>(null)


function update(ev: KeyboardInputInterface) {
	if (selector.value === 'a') {
		if (ev.input === '') return a.value = '?'
		a.value = ev.input
	} else {
		if (ev.input === '') return b.value = '?'
		b.value = ev.input
	}

	isSuccess.value = checkResult()

	emits('update', {
		polyfactor: makePolyFactor(),
		success: isSuccess.value
	})
}

function makePolyFactor(): PolyFactor | null {
	if (selectProduct.value === null) return null

	try {
		const ma = new Monom(a.value === '?' ? 'a' : a.value)
		const mb = new Monom(b.value === '?' ? 'b' : b.value)

		const product = selectProduct.value
			.replaceAll('a', ma.display)
			.replaceAll('b', mb.display)

		return new PolyFactor().fromString(product)
	} catch {
		return null
	}
}

function checkResult(): boolean {
	errorMessage.value = ""

	const pf = makePolyFactor()

	if (pf === null) {
		errorMessage.value = "Les valeurs de \\(a\\) et \\(b\\) doivent être des monômes !"
		return false
	}

	return pf.develop().isEqual(new PolyFactor(props.polynom))
}

const emits = defineEmits<KeyboardResolutionFactorisationEmits>()

</script>

<template>
	<KeyboardResolutionFactorisationWrapper
		:tex
		:error-message
	>
		<div>
			<h3 class="text-xs mb-2">
				sélectionner un produit remarquable
			</h3>
			<div
				v-if="useableProducts.length>0"
				class="flex flex-wrap gap-3 my-3"
			>
				<template
					v-for="p in useableProducts"
					:key="p"
				>
					<sc-button
						v-katex.inline="p"
						sm
						type="action"
						:outline="selectProduct!==p"
						@click="selectProduct = p"
					/>
				</template>
			</div>
			<div
				v-else
				class="text-red-600 border border-red-600 bg-red-50 px-3 py-1 text-sm"
			>
				Il n'y a pas de produit remarquable pour <span v-katex="polynom.display" />
			</div>
		</div>

		<div v-if="selectProduct">
			<div class="grid grid-cols-2 gap-3 mb-2">
				<sc-button
					v-katex.nomargin="`a=${a}`"
					type="action"
					:outline="selector!=='a'"
					sm
					@click="selector = 'a'"
				/>
				<sc-button
					v-katex.nomargin="`b=${b}`"
					type="action"
					:outline="selector!=='b'"
					sm
					@click="selector = 'b'"
				/>
			</div>

			<keyboard-display
				v-show="selector==='a'"
				keyboard="polynom"
				reset
				back
				@change="update"
			/>
			<keyboard-display
				v-show="selector==='b'"
				keyboard="polynom"
				reset
				back
				@change="update"
			/>
		</div>
	</KeyboardResolutionFactorisationWrapper>
</template>
