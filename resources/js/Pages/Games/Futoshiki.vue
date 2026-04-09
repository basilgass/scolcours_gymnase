<script setup lang="ts">
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {Futoshiki} from "pigames/build/module/lib/futoshiki"
import {nextTick, reactive, ref} from "vue"
import FormInput from "@/Components/Form/FormInput.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"

defineOptions({layout: LayoutMain})

const gameStarted = ref(false),
	start = function () {
		gameStarted.value = true

		futo.generate(size.value)
	}

const size = ref(4),
	futo = new Futoshiki(4)

// futo.generate()

const futoshiki = reactive(futo),
	valueSelector = ref(1),
	suggestionMode = ref(false),
	contradictions = ref([])

// let rows = computed(() => {
// 	let arr = []
// 	for (let i = 0; i < size.value; i++) {
// 		for (let j = 0; j < size.value; j++) {
//
// 		}
// 		arr.push(
// 			Object.values(futoshiki).filter(cell => cell.row === i)
// 		)
// 	}
//
// 	return arr
// })

const getConstrain = function (col, row) {
	if (row % 2 === 1) {
		// left / right constrain
		const AKey = `${col / 2 - 1}:${(row - 1) / 2}`,
			BKey = `${col / 2}:${(row - 1) / 2}`

		if (futoshiki.futoshiki[AKey].isLesserThan(futoshiki.futoshiki[BKey])) {
			return "bi bi-chevron-compact-left"
		}
		if (futoshiki.futoshiki[AKey].isGreaterThan(futoshiki.futoshiki[BKey])) {
			return "bi bi-chevron-compact-right"
		}
	}
	if (row % 2 === 0) {
		// greater / lesser constrain
		const AKey = `${(col - 1) / 2}:${row / 2 - 1}`,
			BKey = `${(col - 1) / 2}:${row / 2}`

		if (futoshiki.futoshiki[AKey].isLesserThan(futoshiki.futoshiki[BKey])) {
			return "bi bi-chevron-compact-up"
		}
		if (futoshiki.futoshiki[AKey].isGreaterThan(futoshiki.futoshiki[BKey])) {
			return "bi bi-chevron-compact-down"
		}
	}
	return ""
}
const setValue = function (col, row) {
	const cellKey = `${(col - 1) / 2}:${(row - 1) / 2}`
	if (suggestionMode.value && valueSelector.value > 0) {
		if (futoshiki.futoshiki[cellKey].value === null) {
			futoshiki.futoshiki[cellKey].toggleSuggestion(valueSelector.value)
		}
	} else {
		if (futoshiki.futoshiki[cellKey].default === null) {
			if (valueSelector.value === 0) {
				// Erase mode
				futoshiki.futoshiki[cellKey].value = null
			} else {
				futoshiki.futoshiki[cellKey].value = valueSelector.value
			}

			futoshiki.futoshiki[cellKey].suggestion = []

			// Show a success message.
			nextTick(() => {
				const solution = futoshiki.isSolved()
				if (solution.result) {
					alert("bravo")
				} else {
					if (futoshiki.cells.every(cell => cell.value)) {
						contradictions.value = solution.contradictions
					} else {
						contradictions.value = []
					}
				}
			})
		}
	}
}

</script>
<template>
	<article>
		<ArticleTitle title="Futoshiki" />

		<div v-show="!gameStarted">
			<FormInput
				type="number"
				v-model="size"
				name="nombre de colonnes"
			/>
			<sc-button
				type="primary"
				@click="start"
			>
				commencer
			</sc-button>
		</div>

		<div v-if="gameStarted">
			<div>
				<div
					v-for="row in size*2-1"
					:key="`row-${row}`"
					class="flex"
				>
					<div
						v-for="col in size*2-1"
						:key="`cell-${col}:${row}`"
					>
						<div
							:class="{
								'w-[3em] h-[3em] bg-white border rounded-xs': row%2===1 && col%2===1,
								'w-[1em] h-[3em]': row%2===1 && col%2===0,
								'w-[3em] h-[1em]': row%2===0 && col%2===1,
								'w-[1em] h-[1em]': row%2===0 && col%2===0,
							}"
							class="grid place-items-center"
						>
							<div
								v-if="row%2===1 && col%2===1"
								class="relative w-full h-full"
								@click="setValue(col, row)"
							>
								<div
									class="absolute inset-0 h-full grid grid-cols-3 place-items-center text-xs text-gray-500"
								>
									<div
										v-for="i of 9"
										v-show="futoshiki.futoshiki[`${(col - 1) / 2}:${(row - 1) / 2}`].suggestion.indexOf(i)!==-1"
										:key="`suggestion-${i}`"
									>
										{{ i }}
									</div>
								</div>
								<div
									:class="futoshiki.futoshiki[`${(col - 1) / 2}:${(row - 1) / 2}`].default===null?'text-blue-500':''"
									class="grid place-items-center w-full h-full text-2xl"
								>
									{{ futoshiki.futoshiki[`${(col - 1) / 2}:${(row - 1) / 2}`]?.value }}
								</div>
							</div>
							<div
								v-else-if="row%2!==col%2"
								class="w-full h-full grid place-items-center"
							>
								<i
									:class="getConstrain(col, row)"
									@click="getConstrain(col, row)"
								/>
							</div>
							<div v-else />
						</div>
					</div>
				</div>
			</div>

			<div class="mt-5">
				<h3 class="font-light">
					sélecteur
				</h3>

				<div class="flex gap-3">
					<div
						:class="valueSelector===0?'bg-red-200':'bg-white'"
						class="w-[3em] h-[3em] rounded-sm grid
							place-items-center font-2xl cursor-pointer
							hover:bg-amber-200 transition-colors"
						@click="valueSelector = 0"
					>
						<i class="bi bi-eraser" />
					</div>
					<div
						v-for="value in size"
						:key="`value-${value}`"
						:class="valueSelector===value?'bg-blue-200':'bg-white'"
						class="w-[3em] h-[3em] rounded-sm grid
							place-items-center font-2xl cursor-pointer
							hover:bg-amber-200 transition-colors"
						@click="valueSelector = value"
					>
						{{ value }}
					</div>

					<div
						:class="suggestionMode?'bg-blue-200':'bg-white'"
						class="w-[3em] h-[3em] rounded-sm grid
							place-items-center font-2xl cursor-pointer
							hover:bg-amber-200 transition-colors"
						@click="suggestionMode = !suggestionMode"
					>
						<i class="bi bi-pencil" />
					</div>
				</div>
			</div>

			<div class="text-red-600">
				<div
					v-for="(contradiction, index) in contradictions"
					:key="`contradiction-${index}`"
				>
					{{ contradiction }}
				</div>
			</div>
		</div>
	</article>
</template>

<style>
.futoshiki {
	text-align: center;
}

.futoshiki-cell {
	width: 3rem;
	height: 3rem;
	background-color: white;
	border: thin solid black;
	font-size: 2em;

}

.futoshiki-cell > div {
	width: 100%;
	height: 100%;
	position: relative;
	display: grid;
	place-items: center;
}

.futoshiki-cell-suggestion {
	padding: 0.2rem;
	font-size: 0.7rem;
	position: absolute;
	inset: 0;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr;
	color: darkcyan;
	background-color: transparent;
}

.futoshiki-corner {
	width: 1rem;
	height: 1rem;
}

.futoshiki-constraint-v {
	width: 1rem;
	height: 3rem;
}

.futoshiki-constraint-v.lesser-than:before {
	content: '<';
}

.futoshiki-constraint-v.greater-than:before {
	content: '>';
}

.futoshiki-constraint-h {
	width: 3rem;
	height: 1rem;
}

.futoshiki-constraint-h.lesser-than:before {
	content: '^';
}

.futoshiki-constraint-h.greater-than:after {
	content: '^';
	display: inline-block;
	transform: rotate(180deg);
}
</style>
