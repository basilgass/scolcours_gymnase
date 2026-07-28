<script setup lang="ts">
import {type Component, computed, ref, watch} from "vue"
import {
	equationLineType,
	KeyboardResolutionEmits,
	KeyboardResolutionFactorisationEvent
} from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionHelpers.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {Fraction, PolyFactor} from "pimath"
import KeyboardResolutionMiseEvidence
	from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionMiseEvidence.vue"
import KeyboardResolutionProduitRemarquable
	from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionProduitRemarquable.vue"
import KeyboardResolutionTrinome
	from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionTrinome.vue"
import KeyboardResolutionGroupement
	from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionGroupement.vue"

const props = defineProps<{
	equationLine: equationLineType
}>()

function update(ev: KeyboardResolutionFactorisationEvent) {
	emits('update', {
		method: 'factorisation',
		value: '',
		equation: props.equationLine.equation,
		polyfactor: updatePolyfactor(ev.polyfactor),
		success: ev.success
	})
}

const emits = defineEmits<KeyboardResolutionEmits>()

const factorId = ref<number | null>(null)
const selectedPolynom = computed(() => factors.value[factorId.value ?? -1]?.polynom ?? null)
const factors = computed(() => {
	if (props.equationLine.polyfactor) {
		return props.equationLine.polyfactor.factors
	}
	return new PolyFactor().fromPolynom(props.equationLine.equation.left).factors
})

type factorisationType = 'me' | 'pr' | 'tri' | 'gr'
const methodId = ref<factorisationType | null>(null)
const factorisationMethods: Record<factorisationType, {
	name: string,
	component: Component
}> = {
	'me': {
		name: 'mise en évidence',
		component: KeyboardResolutionMiseEvidence
	},
	'pr': {
		name: 'produit remarquable',
		component: KeyboardResolutionProduitRemarquable
	},
	'tri': {
		name: 'trinôme unitaire',
		component: KeyboardResolutionTrinome
	},
	'gr': {
		name: 'groupement',
		component: KeyboardResolutionGroupement
	},
}
const selectedMethod = computed(() => methodId.value ? factorisationMethods[methodId.value] : null)

function updatePolyfactor(value: PolyFactor | null): PolyFactor | null {
	// Replace the selected polynom / factor from the list of the factors.
	if (factorId.value === null || value === null) return null // should never be possible.

	const pow: Fraction = factors.value[factorId.value].power

	// Remplace le factor par la nouvelle version.
	const pf = new PolyFactor()
	pf.factors = [...factors.value]
	pf.factors.splice(factorId.value, 1, ...value.factors.map(f => f.pow(pow)))
	return pf
}

// Réinitialisation en cas de changement...
watch(() => props.equationLine, () => {
	factorId.value = null
	methodId.value = null
})

</script>

<template>
	<div v-if="factorId === null">
		<div>Choisir le polynôme à factoriser</div>

		<div class="flex flex-wrap gap-3">
			<template
				v-for="(factor, index) in factors"
				:key="`factor-${index}`"
			>
				<sc-button
					v-katex.nomargin="factor.polynom.tex"
					:outline="index !== factorId"
					type="action"
					sm
					@click="factorId=index"
				/>
			</template>
		</div>
	</div>
	<div v-else>
		<div>Factoriser</div>
		<div class="flex justify-between items-center">
			<div v-katex.nomargin="selectedPolynom.tex" />
			<sc-button
				type="delete"
				icon
				sm
				no-label
				@click="factorId = null"
			/>
		</div>
	</div>

	<div v-if="factorId!==null">
		<div v-if="methodId===null">
			<div>Choisir la méthode de factorisation</div>

			<div class="flex flex-wrap gap-3">
				<template
					v-for="(pr, key) in factorisationMethods"
					:key="`pr-${key}`"
				>
					<sc-button
						type="action"
						:outline="key !== methodId"
						sm
						@click="methodId=key"
					>
						{{ pr.name }} {{ key }}
					</sc-button>
				</template>
			</div>
		</div>
		<div v-else>
			<div>avec la méthode</div>

			<div class="flex justify-between items-center">
				<div class="font-semibold">
					{{ selectedMethod?.name }}
				</div>
				<sc-button
					type="delete"
					icon
					sm
					no-label
					@click="methodId = null"
				/>
			</div>
		</div>
	</div>

	<div v-if="factorId!==null && methodId!==null">
		<component
			:is="selectedMethod?.component"
			:polynom="selectedPolynom"
			@update="update"
		/>
	</div>
</template>
