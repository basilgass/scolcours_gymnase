<script lang="ts" setup>
/** Tools
 * title: mathématiques financières
 * body: calculateur TVM — intérêts composés, rentes ordinaires et anticipées
 * parameters:
 * tags: finances,2C
 */
import {computed, ref, watch} from "vue"
import Card from "@/Components/Ui/Card.vue"
import ToolError from "@/Components/Tools/Parts/ToolError.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {TVM, type CompoundingFrequency, type RentType, type TVMResult} from "@/PiMathExtended/TVM.ts"

// ─── Config ───────────────────────────────────────────────────────────────────

type Mode = 'capital' | 'rente'

const mode     = ref<Mode>('capital')
const compute  = ref('S')
const compound = ref<CompoundingFrequency>('annual')
const rentType = ref<RentType>('ordinary')

// Réinitialiser l'inconnue lors du changement de mode
watch(mode, () => { compute.value = 'S' })

// ─── Saisies ──────────────────────────────────────────────────────────────────

const inputC = ref('5000')     // Capital initial C  /  Valeur actuelle A
const inputS = ref('6333.85')  // Valeur finale S
const inputR = ref('500')      // Versement périodique R
const inputJ = ref('3')        // Taux annuel j en %
const inputN = ref('8')        // Durée en années

const C = computed(() => parseFloat(inputC.value))
const S = computed(() => parseFloat(inputS.value))
const R = computed(() => parseFloat(inputR.value))
const j = computed(() => parseFloat(inputJ.value) / 100)   // décimal
const n = computed(() => parseFloat(inputN.value))

// ─── Options ──────────────────────────────────────────────────────────────────

const COMPOUNDING_OPTIONS: { value: CompoundingFrequency; label: string }[] = [
	{value: 'annual',     label: 'Annuelle (m = 1)'},
	{value: 'semiannual', label: 'Semestrielle (m = 2)'},
	{value: 'quarterly',  label: 'Trimestrielle (m = 4)'},
	{value: 'monthly',    label: 'Mensuelle (m = 12)'},
	{value: 'weekly',     label: 'Hebdomadaire (m = 52)'},
	{value: 'daily',      label: 'Journalière (m = 365)'},
]

const CAPITAL_COMPUTE_OPTIONS = [
	{value: 'S', label: 'Valeur finale  S = C·(1+i)ⁿ'},
	{value: 'C', label: 'Capital initial  C = S·(1+i)⁻ⁿ'},
	{value: 'j', label: 'Taux annuel  j'},
	{value: 'n', label: 'Durée  t (années)'},
]

const RENTE_COMPUTE_OPTIONS = [
	{value: 'S',   label: 'Valeur finale S (depuis R)'},
	{value: 'A',   label: 'Valeur actuelle A (depuis R)'},
	{value: 'R_S', label: 'Versement R (depuis S)'},
	{value: 'R_A', label: 'Versement R (depuis A)'},
	{value: 'n_S', label: 'Durée t (depuis S)'},
	{value: 'n_A', label: 'Durée t (depuis A)'},
	{value: 'j_S', label: 'Taux annuel j (depuis S)'},
	{value: 'j_A', label: 'Taux annuel j (depuis A)'},
]

const computeOptions = computed(() =>
	mode.value === 'capital' ? CAPITAL_COMPUTE_OPTIONS : RENTE_COMPUTE_OPTIONS
)

// ─── Visibilité des champs ────────────────────────────────────────────────────

// "C" désigne A (valeur actuelle) en mode rente
const labelC = computed(() => mode.value === 'capital' ? 'Capital initial C' : 'Valeur actuelle A')

const showC = computed(() => {
	if (mode.value === 'capital') return compute.value !== 'C'
	return ['R_A', 'n_A', 'j_A'].includes(compute.value)
})
const showS = computed(() => {
	if (mode.value === 'capital') return compute.value !== 'S'
	return ['R_S', 'n_S', 'j_S'].includes(compute.value)
})
const showR = computed(() =>
	mode.value === 'rente' && !['R_S', 'R_A'].includes(compute.value)
)
const showJ = computed(() => {
	if (mode.value === 'capital') return compute.value !== 'j'
	return !['j_S', 'j_A'].includes(compute.value)
})
const showN = computed(() => {
	if (mode.value === 'capital') return compute.value !== 'n'
	return !['n_S', 'n_A'].includes(compute.value)
})

// ─── Calcul ───────────────────────────────────────────────────────────────────

// Construit un TVMResult uniforme pour les méthodes statiques directes
// (non accessibles via solve() en raison de l'ordre des branches)
function buildResult(pv: number, fv: number, pmt: number,
                     i: number, m: number, nper: number, years: number,
                     type: RentType): TVMResult {
	return {
		pv:         Math.round(pv   * 100) / 100,
		fv:         Math.round(fv   * 100) / 100,
		pmt:        Math.round(pmt  * 100) / 100,
		annualRate: i * m,
		periodRate: i,
		nper:       Math.round(nper  * 1000) / 1000,
		years:      Math.round(years * 1000) / 1000,
		m,
		type,
	}
}

const result = computed((): TVMResult | false => {
	try {
		const m       = TVM.getM(compound.value)
		const i       = j.value / m
		const periods = n.value * m
		const ty      = rentType.value

		// ── Capital unique ─────────────────────────────────────────────────────
		if (mode.value === 'capital') {
			return TVM.solve({
				pv:   compute.value !== 'C' ? C.value : undefined,
				fv:   compute.value !== 'S' ? S.value : undefined,
				rate: compute.value !== 'j' ? j.value : undefined,
				nper: compute.value !== 'n' ? n.value : undefined,
				compounding: compound.value,
			})
		}

		// ── Rentes ────────────────────────────────────────────────────────────
		switch (compute.value) {
			case 'S':
				return TVM.solve({pmt: R.value, rate: j.value, nper: n.value, pv: 0, compounding: compound.value, type: ty})
			case 'A':
				return TVM.solve({pmt: R.value, rate: j.value, nper: n.value, fv: 0, compounding: compound.value, type: ty})
			case 'R_S':
				return TVM.solve({fv: S.value, rate: j.value, nper: n.value, pv: 0, compounding: compound.value, type: ty})
			case 'R_A':
				return buildResult(C.value, 0, TVM.paymentFromPV(C.value, i, periods, ty), i, m, periods, n.value, ty)
			case 'n_S':
				return TVM.solve({fv: S.value, pmt: R.value, rate: j.value, pv: 0, compounding: compound.value, type: ty})
			case 'n_A': {
				const nPV = TVM.nperFromPV(C.value, R.value, i, ty)
				return buildResult(C.value, 0, R.value, i, m, nPV, nPV / m, ty)
			}
			case 'j_S': {
				const iFV = TVM.rateFromFV(S.value, R.value, periods, ty)
				return buildResult(0, S.value, R.value, iFV, m, periods, n.value, ty)
			}
			case 'j_A':
				return TVM.solve({pv: C.value, pmt: R.value, nper: n.value, fv: 0, compounding: compound.value, type: ty})
		}
	} catch {
		return false
	}
	return false
})

// ─── Affichage ────────────────────────────────────────────────────────────────

function pct(x: number, decimals = 4): string {
	return `${parseFloat((x * 100).toFixed(decimals))}\\%`
}

// Formule affichée (selon le cas)
const formulaTex = computed((): string => {
	if (!result.value) return ''
	const ant = result.value.type === 'anticipatory'
	const antFactor = ant ? '\\cdot (1+i)' : ''

	if (mode.value === 'capital') {
		switch (compute.value) {
			case 'S': return `S = C \\cdot (1+i)^n`
			case 'C': return `C = S \\cdot (1+i)^{-n}`
			case 'j': return `i = \\sqrt[n]{\\dfrac{S}{C}} - 1 \\quad \\Rightarrow \\quad j = i \\cdot m`
			case 'n': return `n = \\dfrac{\\ln(S/C)}{\\ln(1+i)} \\quad \\Rightarrow \\quad t = n/m`
		}
	}
	switch (compute.value) {
		case 'S':
		case 'R_S':
		case 'n_S':
		case 'j_S': return `S = R \\cdot \\dfrac{(1+i)^n - 1}{i}${antFactor}`
		case 'A':
		case 'R_A':
		case 'n_A':
		case 'j_A': return `A = R \\cdot \\dfrac{1-(1+i)^{-n}}{i}${antFactor}`
	}
	return ''
})

// Résultat principal (valeur encadrée)
const resultTex = computed((): string => {
	if (!result.value) return ''
	const r = result.value

	if (mode.value === 'capital') {
		switch (compute.value) {
			case 'S': return `S = ${r.fv.toFixed(2)}`
			case 'C': return `C = ${r.pv.toFixed(2)}`
			case 'j': return `j = ${pct(r.annualRate)}`
			case 'n': return `t = ${r.years}\\ \\text{ans} \\quad (n = ${r.nper}\\ \\text{périodes})`
		}
	}
	switch (compute.value) {
		case 'S':           return `S = ${r.fv.toFixed(2)}`
		case 'A':           return `A = ${r.pv.toFixed(2)}`
		case 'R_S':
		case 'R_A':         return `R = ${r.pmt.toFixed(2)}`
		case 'n_S':
		case 'n_A':         return `t = ${r.years}\\ \\text{ans} \\quad (n = ${r.nper}\\ \\text{périodes})`
		case 'j_S':
		case 'j_A':         return `j = ${pct(r.annualRate)}`
	}
	return ''
})
</script>

<template>
	<article>
		<!-- ── Formulaire ─────────────────────────────────────────────────── -->
		<Card>
			<template #header>
				<h3 class="text-xl">
					Données
				</h3>
			</template>

			<!-- Sélecteur de mode -->
			<div class="flex gap-2 mb-5">
				<button
					v-for="m in [{value: 'capital', label: 'Capital unique'}, {value: 'rente', label: 'Rente'}]"
					:key="m.value"
					class="px-4 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer"
					:class="mode === m.value
						? 'bg-gray-700 text-white'
						: 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
					@click="mode = m.value as 'capital' | 'rente'"
				>
					{{ m.label }}
				</button>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
				<!-- Inconnue à calculer -->
				<div>
					<label class="block text-sm text-gray-600 mb-1">Calculer</label>
					<select
						v-model="compute"
						class="block w-full border-b border-gray-300 py-1.5 text-sm bg-transparent focus:outline-none"
					>
						<option
							v-for="opt in computeOptions"
							:key="opt.value"
							:value="opt.value"
						>
							{{ opt.label }}
						</option>
					</select>
				</div>

				<!-- Capitalisation -->
				<div>
					<label class="block text-sm text-gray-600 mb-1">Capitalisation</label>
					<select
						v-model="compound"
						class="block w-full border-b border-gray-300 py-1.5 text-sm bg-transparent focus:outline-none"
					>
						<option
							v-for="opt in COMPOUNDING_OPTIONS"
							:key="opt.value"
							:value="opt.value"
						>
							{{ opt.label }}
						</option>
					</select>
				</div>

				<!-- Type de rente (uniquement en mode rente) -->
				<div v-if="mode === 'rente'">
					<label class="block text-sm text-gray-600 mb-1">Type de rente</label>
					<select
						v-model="rentType"
						class="block w-full border-b border-gray-300 py-1.5 text-sm bg-transparent focus:outline-none"
					>
						<option value="ordinary">
							Ordinaire (fin de période)
						</option>
						<option value="anticipatory">
							Anticipée (début de période)
						</option>
					</select>
				</div>
			</div>

			<!-- Saisies numériques (conditionnelles) -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<FormInput
					v-if="showC"
					v-model="inputC"
					:label="labelC"
					font-code
				/>
				<FormInput
					v-if="showS"
					v-model="inputS"
					label="Valeur finale S"
					font-code
				/>
				<FormInput
					v-if="showR"
					v-model="inputR"
					label="Versement périodique R"
					font-code
				/>
				<FormInput
					v-if="showJ"
					v-model="inputJ"
					label="Taux annuel j (%)"
					font-code
				/>
				<FormInput
					v-if="showN"
					v-model="inputN"
					label="Durée t (années)"
					font-code
				/>
			</div>
		</Card>

		<!-- ── Résultat ───────────────────────────────────────────────────── -->
		<Card
			v-if="result"
			class="mt-4"
		>
			<!-- Formule -->
			<div
				v-katex.display="formulaTex"
				class="text-gray-500 mb-2"
			/>

			<!-- Valeur encadrée -->
			<div
				v-katex.display.boxed.lg="resultTex"
				class="my-4"
			/>

			<!-- Tableau récapitulatif -->
			<div class="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
				<!-- Taux par période -->
				<div class="rounded border bg-gray-50 p-3 text-center">
					<div class="text-xs text-gray-500 mb-1">
						Taux par période
					</div>
					<div
						v-katex="`i = ${pct(result.periodRate)}`"
						class="font-code text-sm"
					/>
				</div>

				<!-- Taux annuel -->
				<div class="rounded border bg-gray-50 p-3 text-center">
					<div class="text-xs text-gray-500 mb-1">
						Taux annuel
					</div>
					<div
						v-katex="`j = ${pct(result.annualRate)}`"
						class="font-code text-sm"
					/>
				</div>

				<!-- Fréquence -->
				<div class="rounded border bg-gray-50 p-3 text-center">
					<div class="text-xs text-gray-500 mb-1">
						Fréquence
					</div>
					<div
						v-katex="`m = ${result.m}`"
						class="font-code text-sm"
					/>
				</div>

				<!-- Nombre de périodes -->
				<div class="rounded border bg-gray-50 p-3 text-center">
					<div class="text-xs text-gray-500 mb-1">
						Périodes
					</div>
					<div
						v-katex="`n = ${result.nper}`"
						class="font-code text-sm"
					/>
				</div>

				<!-- Durée en années -->
				<div class="rounded border bg-gray-50 p-3 text-center">
					<div class="text-xs text-gray-500 mb-1">
						Durée
					</div>
					<div
						v-katex="`t = ${result.years}\\ \\text{ans}`"
						class="font-code text-sm"
					/>
				</div>

				<!-- Capital / Valeur actuelle -->
				<div
					v-if="result.pv !== 0"
					class="rounded border bg-gray-50 p-3 text-center"
				>
					<div class="text-xs text-gray-500 mb-1">
						{{ mode === 'capital' ? 'Capital initial' : 'Valeur actuelle' }}
					</div>
					<div
						v-katex="`${mode === 'capital' ? 'C' : 'A'} = ${result.pv.toFixed(2)}`"
						class="font-code text-sm"
					/>
				</div>

				<!-- Valeur finale -->
				<div
					v-if="result.fv !== 0"
					class="rounded border bg-gray-50 p-3 text-center"
				>
					<div class="text-xs text-gray-500 mb-1">
						Valeur finale
					</div>
					<div
						v-katex="`S = ${result.fv.toFixed(2)}`"
						class="font-code text-sm"
					/>
				</div>

				<!-- Versement (rente uniquement) -->
				<div
					v-if="mode === 'rente'"
					class="rounded border bg-gray-50 p-3 text-center"
				>
					<div class="text-xs text-gray-500 mb-1">
						Versement
					</div>
					<div
						v-katex="`R = ${result.pmt.toFixed(2)}`"
						class="font-code text-sm"
					/>
				</div>

				<!-- Type de rente (rente uniquement) -->
				<div
					v-if="mode === 'rente'"
					class="rounded border bg-gray-50 p-3 text-center"
				>
					<div class="text-xs text-gray-500 mb-1">
						Type
					</div>
					<div class="text-sm font-medium">
						{{ result.type === 'ordinary' ? 'Ordinaire' : 'Anticipée' }}
					</div>
				</div>
			</div>
		</Card>

		<tool-error
			v-else
			class="mt-4"
		/>
	</article>
</template>
