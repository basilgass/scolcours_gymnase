<script lang="ts" setup>
import BarChart from "@/Components/Charts/barChart.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import { numberCorrection } from "@/helpers/helperFunctions.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { computed, ref } from "vue"

defineOptions({ layout: LayoutMain })
const pointsData = ref(""),
	maxPoints = ref(20),
	pourcentage = ref(""),
	pourcentage4 = ref(false),
	precision = ref(0.5)

// Nouvelle version, plus logique et stable
type baremeInterface = Record<string, {
		pt: number,
		note: number,
		centieme: string
	}>;

const bareme = computed<baremeInterface>(() => {
		if (maxPoints.value <= 0) return {}

		if (+pourcentage.value < 0) return {}

		if (precision.value <= 0) return {}

		let pt = 0,
			result = {}
		while (pt <= maxPoints.value) {
			const note = calculerLaNote(pt),
				ptKey = numberCorrection(pt)
			result[pt] = {
				pt: ptKey,
				note: Math.round(note * 2) / 2,
				centieme: note.toFixed(2)
			}

			pt = +(pt + precision.value).toFixed(3)
		}

		return result
	}),
	pointsParNote = computed<{ note: number, pointsMin: number, pointsMax: number }[]>(() => {
		// returns [
		//      {note, pointsDe, pointsA}
		// ]
		const arr = []
		for (let i = 6; i >= 1; i -= 0.5) {
			const values = Object.values(bareme.value)
				.filter(x => x.note === i)
				.map(x => x.pt)

			arr.push({
				note: i,
				pointsMin: Math.min(...values),
				pointsMax: Math.max(...values)
			})
		}

		return arr
	})

function calculerLaNote(pt: number): number {
	// échelle fédérale.
	if (pourcentage.value === "") {
		return pt / maxPoints.value * 5 + 1
	}

	// échelle avec pourcentage.
	if (isNaN(+pourcentage.value)) {
		return 0
	}

	const seuil = maxPoints.value * (+pourcentage.value) / 100
	const note1 = 1, note4 = pourcentage4.value ? 4 : 3.75, note6 = 6

	if (pt < seuil) {
		// note de 1 à 3.75 (ou 4)
		// 0pt          => 1
		// seuil pt     => 3.75 (ou 4)
		// pente        => 2.75 (ou 3)/seuil
		return note1 + (note4 - note1) / seuil * pt
	} else {
		// seuil pt     => 3.75 (ou 4)
		// maxPooints   => 6
		return note4 + (note6 - note4) / (maxPoints.value - seuil) * (pt - seuil)
	}
}

const listeDesPoints = computed<number[]>(() => {
		return pointsData.value.split(/\s+/)
			.filter(pt => pt.trim() !== "" && !isNaN(+pt))
			.map(pt => Math.min(+pt, maxPoints.value))
			.filter(pt => Object.hasOwn(bareme.value, pt))
	}),
	listeDesPointsAvecErreurs = computed<string[]>(() => {
		return pointsData.value.split(/\s+/)
			.filter(pt => pt !== "" && !Object.hasOwn(bareme.value, +pt.toString()))
	}),
	listeDesNotes = computed<number[]>(() => {
		return listeDesPoints.value
			.map(pt => bareme.value[pt].note)
	}),
	decompteDesNotes = computed<number[]>(() => {
		const arr = []

		for (let i = 1; i <= 6; i += 0.5) {
			arr.push(listeDesNotes.value.filter(note => note === i).length)
		}

		return arr
	}),
	moyenneDesNotes = computed<number | string>(() => {
		if (listeDesNotes.value.length === 0) return "-"

		return (listeDesNotes.value.reduce((a, b) => a + b) / listeDesNotes.value.length).toFixed(2)
	}),
	medianeDesNotes = computed<number | string>(() => {
		if (listeDesNotes.value.length === 0) return "-"

		// https://stackoverflow.com/questions/45309447/calculating-median-javascript
		const s = [...listeDesNotes.value].sort((a, b) => a - b)
		const mid = Math.floor(s.length / 2)

		return (s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]).toFixed(2)
	})


</script>
<template>
	<section class="scolcours-container">
		<!-- Title -->
		<ArticleTitle title="Echelle" />

		<div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
			<div class="space-y-5">
				<form-maker
					v-model="maxPoints"
					focus
					font-code
					label="points maximum du test"
					name="points"
					type="number"
				/>

				<div class="flex items-end align-bottom gap-3 flex-grow">
					<form-maker
						v-model.number="precision"
						class="grow"
						font-code
						label="précision"
						name="precision"
						@blur="
							precision =
								isNaN(+precision) || +precision <= 0
									? 0.5
									: +precision
						"
					/>
					<button
						:class="+precision === 1 ? 'is-active' : 'bg-white'"
						class="btn px-10"
						@click="precision = 1"
					>
						1
					</button>
					<button
						:class="+precision === 0.5 ? 'is-active' : 'bg-white'"
						class="btn px-10"
						@click="precision = 0.5"
					>
						0.5
					</button>
					<button
						:class="+precision === 0.1 ? 'is-active' : 'bg-white'"
						class="btn px-10"
						@click="precision = 0.1"
					>
						0.1
					</button>
				</div>

				<form-maker
					v-model.number="pourcentage"
					font-code
					helper-text="vide pour échelle fédérale"
					label="pourcentage"
					message="laisser vide pour l'échelle fédérale \(\quad \frac{pt}{max}\cdot 5+ 1\)"
					message-class="text-xs"
					name="points"
				/>
			</div>

			<div
				class="min-w-[9em] w-full bg-white rounded border border-slate-100 p-3"
			>
				<!--				<div-->
				<!--					class="mb-3 py-2 text-center font-code bg-slate-700 text-slate-100"-->
				<!--				>-->
				<!--					mode compact-->
				<!--				</div>-->
				<table class="table tab w-full text-center font-code text-xl">
					<thead>
						<tr class="font-semibold">
							<td>de</td>
							<td>à</td>
							<td class="">
								éval.
							</td>
						</tr>
					</thead>
					<tbody v-if="Object.keys(bareme).length > 0">
						<tr
							v-for="item in pointsParNote"
							:key="`range-${item.note}`"
							class="odd:bg-amber-100"
						>
							<td>{{ item.pointsMin }}</td>
							<td>{{ item.pointsMax }}</td>
							<td class="font-semibold">
								{{ item.note }}
							</td>
						</tr>
					</tbody>
					<tbody v-else>
						<tr class="text-center text-sm text-red-600">
							<td
								class="py-5"
								colspan="3"
							>
								Le barème n'a pas pu être créé... merci de vérifier la configuration
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
			<div>
				<form-maker
					v-model="pointsData"
					:rows="17"
					font-code
					helper-text="notes séparées par des espaces, des virgules ou à la ligne."
					label="liste des points"
					name="points"
					type="textarea"
				/>
				<div
					v-show="listeDesPointsAvecErreurs.length>0"
					class="text-red-600 text-sm"
				>
					Il y a un ou des points supérieurs au maximum ({{ listeDesPointsAvecErreurs.join(", ") }})
				</div>
			</div>

			<div
				v-if="listeDesNotes.length>0"
				class="mt-8 flex flex-col gap-4"
			>
				<div>
					<div class="flex gap-2 md:gap-4 xl:gap-10 justify-between text-center">
						<div
							class="bg-white p-3 grid place-items-center text-lg border border-slate-100 rounded-xl shadow aspect-square w-full py-8"
						>
							<div class="flex flex-col h-full justify-between">
								<div class="font-extralight">
									Nombre de notes
								</div>
								<div class="font-semibold text-xl">
									{{ listeDesNotes.length }}
								</div>
							</div>
						</div>
						<div
							class="bg-white p-3 grid place-items-center text-lg border border-slate-100 rounded-xl shadow aspect-square w-full py-8"
						>
							<div class="flex flex-col h-full justify-between">
								<div class="font-extralight">
									Moyenne
								</div>
								<div class="font-semibold text-xl">
									{{ moyenneDesNotes }}
								</div>
							</div>
						</div>
						<div
							class="bg-white p-3 grid place-items-center text-lg border border-slate-100 rounded-xl shadow aspect-square w-full py-8"
						>
							<div class="flex flex-col h-full justify-between">
								<div class="font-extralight">
									Médiane
								</div>
								<div class="font-semibold text-xl">
									{{ medianeDesNotes }}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					class="bg-white p-5 w-full border border-slate-100 rounded-xl shadow"
				>
					<bar-chart
						:chart-dataset="decompteDesNotes"
						:chart-labels="[1, 1.5,2, 2.5,3, 3.5,4, 4.5,5, 5.5,6]"
						:chart-options="{scales: { y: { ticks: { stepSize: 1, }, }, }, }"
						chart-colorset="graduate"
					/>
				</div>
			</div>
		</div>
	</section>
</template>
