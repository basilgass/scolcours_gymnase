<script lang="ts" setup>
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
/** Chapter
 * title: tableau de remboursement d'emprunt
 * body: construit le tableau de remboursement d'emprunt pour un certain nombre d'années.
 */
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import FinancesAmortissement from "@/Components/Widgets/arithmetique/finances-amortissement.vue"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "montant emprunté",
		type: "number",
		value: ref("10000"),
		fromUrl: "S"
	},
	{
		label: "intérêts en pourcent",
		type: "number",
		value: ref(3),
		fromUrl: "n",
	},
	{
		label: "années",
		type: "number",
		value: ref(10),
		fromUrl: "n",
	}
])
const pmt = computed<number>(() => {
	const S = forms[0].value.value as number
	if (isNaN(S)) return 0
	if (S < 0) return 0

	return S
})

const rate = computed(() => {
	const i = forms[1].value.value as number
	if (isNaN(i)) return 0
	if (i < 0) return 0
	return i
})

const nper = computed(() => {
	const n = forms[2].value.value as number
	if (isNaN(n)) return 0
	if (n < 0) return 0
	return n
})

const result = computed<boolean>(() => !(pmt.value === 0 || rate.value === 0 || nper.value === 0))


</script>

<template>
	<article
		ref="root"
		class="space-y-10"
	>
		<!-- Value to modify enter -->
		<tool-form
			:forms="forms"
			form-class="grid grid-cols-3 gap-6"
		/>

		<!-- Tableau de signes -->
		<Card class="max-w-lg mx-auto shadow">
			<div v-if="result">
				<finances-amortissement
					:illustration="{
						parameters: '',
						code: `A=${pmt}\nn=${nper}\ni=${rate/100}`,
					}"
				/>
			</div>
			<div v-else>
				{{ pmt }} - {{ rate }} - {{ nper }}
			</div>
		</Card>
	</article>
</template>
