<script lang="ts" setup>
import type {LanguageDataInterface} from "@/Pages/languages/LanguageShow.vue"
import {Random} from "pimath"
import {inject, ref, watch} from "vue"
import {useLanguage} from "@/Components/Languages/useLanguage.ts"
import {shake} from "@/helpers/helperFunctions.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"

const languageData = inject<LanguageDataInterface>('LanguageData')
const {startGame, continueGame, selectedWordsIndex, currentWords} = useLanguage(languageData)

/**
 * Gestion du jeu.
 */
// TOOD: typo game is the same than the question type -> make one component for both
watch(selectedWordsIndex, () => {
	buildResult()
})

const typoButtons = ref(null)
const excludeLetters = ref([" ", ",", "'", ".", "!", "?", "(", ")", "-"])
const foreignLetters = ref([])
const resultLetters = ref([])

function buildResult() {
	let theWord = currentWords.value[0].foreign

	// Modify the word
	if (theWord.endsWith(", a, i, e")) {
		theWord = theWord.split(", a, i, e")[0]
	}
	if (theWord.endsWith(", i")) {
		theWord = theWord.split(", i")[0]
	}
	if (theWord.split(", -").length === 2) {
		theWord = theWord.split(", -")[0]
	}

	foreignLetters.value = Random.shuffle(theWord.split("")
		.filter(key => excludeLetters.value.indexOf(key) === -1)
		.map(key => {
			return {
				key: key.toUpperCase(),
				used: false
			}
		})
	)

	resultLetters.value = theWord.split("").map((key, index) => {
		return {
			index,
			key: key.toUpperCase(),
			visible: excludeLetters.value.indexOf(key) !== -1
		}
	})

	// Tell we are watching the first letter
	currentIndex.value = 0
	while (resultLetters.value[currentIndex.value].visible) {
		currentIndex.value++
		if (currentIndex.value >= resultLetters.value.length) {
			continueGame()
			return
		}
	}

}

const currentIndex = ref(-1)

function validateKey(index) {
	if (resultLetters.value[currentIndex.value].key === foreignLetters.value[index].key) {
		resultLetters.value[currentIndex.value].visible = true
		foreignLetters.value[index].used = true

		// finished ?
		currentIndex.value++
		if (currentIndex.value >= resultLetters.value.length) {
			continueGame()
			return
		}
		while (resultLetters.value[currentIndex.value].visible) {
			currentIndex.value++
			if (currentIndex.value >= resultLetters.value.length) {
				continueGame()
				return
			}
		}
	} else {
		shake(typoButtons.value.children[index])
	}
}

</script>
<template>
	<article>
		<div
			v-if="languageData.state.value==='intro'"
		>
			<div
				v-show="false"
				class="my-3"
			>
				<h2 class="text-lg font-extralight mb-2 uppercase">
					configuration de typographe
				</h2>
				<div class="flex gap-3" />
			</div>

			<div class="grid place-items-center mt-12">
				<sc-button
					v-show="languageData.units.value.length>0"
					type="primary"
					class="px-20 py-10 text-2xl"
					@click="startGame"
				>
					Commencer
				</sc-button>
			</div>
		</div>
		<div v-else>
			<div
				v-admin
				class="bg-grey-300 border border-600 rounded-sm"
			>
				{{ currentWords[0].fr }} --> {{ currentWords[0].foreign }}
			</div>

			<div class="space-y-10">
				<div class="text-xl text-center">
					{{ currentWords[0].fr }}
				</div>

				<div class="flex flex-wrap gap-2 justify-center bg-white px-5 py-3 text-lg">
					<div
						v-for="(key, index) in resultLetters"
						:key="`found-${index}`"
						:class="{
							'p-2 w-8 border-b-2 border-gray-200': key.key!==' ',
							'p-0 w-3': key.key===' ',
							'bg-white': key.key !== ' ' && index!==currentIndex,
							'is-active': index===currentIndex
						}"
						class="text-center text-lg font-code h-[2.5em]"
					>
						<span
							v-show="key.visible"
							v-text="key.key"
						/>
					</div>
				</div>

				<div
					ref="typoButtons"
					class="keyboard flex flex-wrap gap-4 justify-center max-w-xl mx-auto"
				>
					<button
						v-for="(key, index) in foreignLetters"
						:key="`${key.key}-${index}`"
						:class="{
							'bg-white hover:scale-105 hover:shadow-sm': !key.used,
							'bg-gray-200 disabled text-gray-400 cursor-not-allowed': key.used
						}"
						class="p-2 w-14 h-14 border border-gray-200 rounded-sm transition-all"
						@click="key.used?'':validateKey(index)"
					>
						{{ key.key }}
					</button>
				</div>
			</div>
		</div>
	</article>
</template>
