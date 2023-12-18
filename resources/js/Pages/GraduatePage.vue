<!--suppress ALL -->
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain,
}
</script>
<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {computed, nextTick, onMounted, ref, watch} from "vue"
import {PiMath} from "pimath/esm"
import BarChart from "@/Components/Charts/barChart.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

let pointsData = ref(""),
	maxPoints = ref(20),
	pourcentage = ref(""),
	pourcentage4 = ref(false),
	precision = ref(0.5),
	halfPoints = ref(true),
	chart = ref(null),
	chartD = ref(null),
	showChartD = ref(false)

// Nouvelle version, plus logique et stable
let bareme = computed(() => {
		if (maxPoints.value <= 0) {
			return null
		}

		if (+pourcentage.value < 0) {
			return null
		}

		if (precision.value <= 0) {
			return null
		}

		let pt = 0,
			result = {}
		while (pt <= maxPoints.value) {
			const note = calculerLaNote(pt),
				ptKey = PiMath.Numeric.numberCorrection(pt)
			result[pt] = {
				pt: ptKey,
				note: Math.round(note * 2) / 2,
				centieme: note.toFixed(2)
			}

			pt = +(pt + precision.value).toFixed(3)
		}

		return result
	}),
	pointsSorted = computed(() => {
		let keys = Object.keys(bareme.value)
		keys = keys.sort((a, b) => +a - b)
		return keys
	}),
	pointsParNote = computed(() => {
		// returns [
		//      {note, pointsDe, pointsA}
		// ]
		let arr = []
		for (let i = 6; i >= 1; i -= 0.5) {
			let values = Object.values(bareme.value)
				.filter(x => x.note === i)
				.map(x => x.pt)

			arr.push({
				note: i,
				pointsMin: Math.min(...values),
				pointsMax: Math.max(...values),
			})
		}

		return arr
	})

let calculerLaNote = function (pt) {
	// échelle fédérale.
	if (pourcentage.value === "") {
		return pt / maxPoints.value * 5 + 1
	}

	// échelle avec pourcentage.
	if (isNaN(+pourcentage.value)) {
		return 0
	}

	const seuil = maxPoints.value * (+pourcentage.value) / 100
	let note1 = 1, note4 = pourcentage4.value ? 4 : 3.75, note6 = 6

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



let listeDesPoints = computed(() => {
		return pointsData.value.split( " ")
			.map(pt => Math.min(pt, maxPoints.value))
			.filter(pt=>bareme.value.hasOwnProperty(pt))
	}),
	listeDesPointsAvecErreurs = computed(() => {
		return pointsData.value.split( " ")
			.filter(pt=>pt!=="" && !bareme.value.hasOwnProperty(pt))
	}),
	listeDesNotes = computed(()=>{
		return listeDesPoints.value
			.map(pt=>bareme.value[pt].note)
	}),
	decompteDesNotes = computed(()=>{
		let arr = []

		for(let i=1; i<=6; i+=0.5){
			arr.push(listeDesNotes.value.filter(note=>note===i).length)
		}

		return arr
	}),
	moyenneDesNotes = computed(() => {
		if(listeDesNotes.value.length===0){return "-"}

		return (listeDesNotes.value.reduce((a,b) => a+b) / listeDesNotes.value.length).toFixed(2)
	}),
	medianeDesNotes = computed(() => {
		if(listeDesNotes.value.length===0){return "-"}

		// https://stackoverflow.com/questions/45309447/calculating-median-javascript
		const s = [...listeDesNotes.value].sort((a, b) => a - b)
		const mid = Math.floor(s.length / 2)

		return (s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]).toFixed(2)
	})








onMounted(() => {
	// chartDObject = new Chart(chartD.value, {
	// 	type: "line",
	// 	data: {
	// 		labels: [],
	// 		datasets: [{data: []}],
	// 	},
	// 	config: {
	// 		responsive: true,
	// 		maintainAspectRatio: false,
	// 		plugins: {
	// 			legend: {
	// 				display: false,
	// 			},
	// 		},
	// 		scales: {
	// 			x: {
	// 				type: "linear",
	// 				min: 0,
	// 				max: maxPoints.value,
	// 				ticks: {
	// 					stepSize: halfPoints.value ? 0.5 : 1,
	// 				},
	// 			},
	// 		},
	// 	},
	// })
})

</script>
<template>
	<!-- Title -->
	<ArticleTitle title="Echelle" />

	<div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
		<div class="space-y-5">
			<form-maker
				type="number"
				v-model="maxPoints"
				focus
				label="points maximum du test"
				name="points"
			/>

			<div class="flex items-end align-bottom gap-3 flex-grow">
				<form-maker
					v-model.number="precision"
					class="grow"
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
				helper-text="vide pour échelle fédérale"
				label="pourcentage"
				name="points"
			/>
		</div>

		<div
			class="min-w-[9em] w-full bg-white rounded border border-slate-100 p-3"
		>
			<div
				class="mb-3 py-2 text-center font-code bg-slate-700 text-slate-100"
			>
				mode compact
			</div>
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
				<tbody>
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
			</table>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
		<div>
			<form-maker
				type="textarea"
				v-model="pointsData"
				:rows="6"
				helper-text="notes séparées par des espaces, des virgules ou à la ligne."
				label="liste des points"
				name="points"
			/>
			<div
				v-show="listeDesPointsAvecErreurs.length>0"
				class="text-red-600 text-sm"
			>
				Il y a un ou des points supérieurs au maximum ({{ listeDesPointsAvecErreurs.join(', ') }})
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
</template>
