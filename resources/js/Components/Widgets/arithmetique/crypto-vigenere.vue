<!--<info>
parameters: key=#,text|clear|code|expanded
code: la phrase à coder
</info>-->
<script setup lang="ts">
import {computed, ref} from 'vue'
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {useWidget} from "@/Components/Widgets/useWidget.ts"
import CryptoHeader from "@/Components/Widgets/arithmetique/Parts/crypto-header.vue"
import {Cipher} from "@/helpers/cipher.ts"

/* =======================
   Props
======================= */
const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const {parameters} = useWidget(props)

/* =======================
   Reactive
======================= */
const cipherKey = ref<string>('HELLO WORLD')

/* =======================
   Show booleans
======================= */
const showTable = computed(() => {
	return true
})

/* =======================
   Alphabet
======================= */
const alphabet = Cipher.alphabet
const N = alphabet.length

/* =======================
   Grille
======================= */
const cellSize = ref<number>(32) // 32–40 OK mobile
const selectedRow = ref<number | null>(null)
const selectedCol = ref<number | null>(null)

function clickRow(i: number) {
	selectedRow.value = selectedRow.value === i ? null : i
}

function clickCol(j: number) {
	selectedCol.value = selectedCol.value === j ? null : j
}

function clickInside(col: number, row: number) {

	if (selectedRow.value === null && selectedCol.value === null) return

	if (selectedRow.value === row) {
		clickCol(col)
		return
	}

	if (selectedCol.value === col) {
		clickRow(row)
		return
	}
}

/* =======================
   Normalisation
======================= */
const normText = computed(() => Cipher._normalize(props.illustration.code))
const normKey = computed(() => {
	if (!parameters.value.key) {
		return Cipher._normalize(cipherKey.value)
	}

	return Cipher._normalize(parameters.value.key as string)
})

/* =======================
   Clé étendue
======================= */
const expandedKey = computed(() => Cipher._expandKey(normKey.value, normText.value))

/* =======================
   Encodage Vigenère
======================= */
const cipherText = computed(() => Cipher.vigenere(normKey.value, normText.value))

</script>

<template>
	<article class="space-y-6">
		<div v-if="parameters.key">
			clé de cryptage : {{ parameters.key }}
		</div>
		<div v-else>
			<form-maker
				v-model="cipherKey"
				type="text"
				inline-label
				label="clé de cryptage"
				icon="bi bi-key"
			/>
		</div>

		<crypto-header
			:text="{
				clear: normText,
				cipher: cipherText,
				key: cipherKey,
				expanded: expandedKey
			}"
			:parameters
		/>
		<!-- Tableau de Vigenère -->
		<div
			v-if="showTable"
		>
			<div
				v-theme.text
				class="flex gap-1 justify-start items-baseline"
			>
				<i
					class="bi text"
					:class="cellSize===32 ? 'bi-square-fill': 'bi-square'"
					@click="cellSize=32"
				/>
				<i
					class="bi text-sm"
					:class="cellSize===28 ? 'bi-square-fill': 'bi-square'"
					@click="cellSize=28"
				/>
				<i
					class="bi text-xs"
					:class="cellSize===24 ? 'bi-square-fill': 'bi-square'"
					@click="cellSize=24"
				/>
			</div>
			<div
				class="overflow-auto aspect-square"
			>
				<div class="inline-block">
					<div
						class="vigenere-grid grid transition-all"
						:style="{
							'--cell': cellSize + 'px',
							gridTemplateColumns: `var(--cell) repeat(${N}, var(--cell))`
						}"
					>
						<!-- coin vide -->
						<div class="border" />

						<!-- première ligne (colonnes) -->
						<div
							v-for="(c, j) in alphabet"
							:key="'col-'+j"
							class="border cursor-pointer select-none font-semibold"
							:class="{ 'bg-green-200': selectedCol === j }"
							@click="clickCol(j)"
						>
							{{ c }}
						</div>

						<!-- lignes -->
						<template
							v-for="(r, i) in alphabet"
							:key="'row-'+i"
						>
							<!-- entête ligne -->
							<div
								class="border cursor-pointer select-none font-semibold"
								:class="{ 'bg-blue-200': selectedRow === i }"
								@click="clickRow(i)"
							>
								{{ r }}
							</div>

							<!-- cellules -->
							<div
								v-for="(c, j) in alphabet"
								:key="i+'-'+j"
								class="border cursor-default select-none"
								:class="{
									'bg-blue-100 cursor-pointer': selectedRow === i,
									'bg-green-100 cursor-pointer': selectedCol === j,
									'bg-red-300 font-bold': selectedRow === i && selectedCol === j
								}"
								@click="clickInside(j, i)"
							>
								{{ Cipher._shift(i, j) }}
							</div>
						</template>
					</div>
				</div>
			</div>
		</div>
	</article>
</template>

<style scoped>
.vigenere-grid {
	--cell: 0;
}

.vigenere-grid > div {
	width: var(--cell);
	height: var(--cell);
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
