<script
	lang="ts"
	setup
>

import FlipcardsIndex from "@/Components/Decks/FlipcardsIndex.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { flashInterface } from "@/types"
import type { deckInterface } from "@/types/modelInterfaces"
import { watchDebounced } from "@vueuse/core"
import axios from "axios"
import { inject, PropType, ref } from "vue"

defineOptions({ layout: LayoutMain })

const flash = inject<flashInterface>("flash")


const props = defineProps({
	deck: { type: Object as PropType<deckInterface>, required: true }
})

const chapterId = ref<undefined | number>(undefined)
const chapterTitle = ref("???")

const getTargetName = function () {

	if (chapterId.value === undefined) {
		chapterTitle.value = "???"
		return
	}
	axios
		.get(route(`chapters.info`, [chapterId.value]))
		.then((res) => {
			chapterTitle.value = res.data.title

		})
		.catch(() => {
			chapterTitle.value = "???"
		})
}

function assignChapter() {
	if (chapterTitle.value === "???") {
		return
	}

	axios.post(route("decks.assignChapter", [props.deck.id]), {
		_method: "PATCH",
		chapter_id: chapterId.value
	})
		.then((res) => {
			flash.success(`Le deck a été assigné au chapitre ${chapterTitle.value}`)
			chapterId.value = undefined
		})
		.catch(() => {
			flash.error(`Le deck n'a pas pu être assigné au chapitre ${chapterTitle.value}`)
			chapterId.value = undefined
		})
}
watchDebounced(chapterId, getTargetName, { debounce: 1000, maxWait: 2000 })
</script>
<template>
	<section class="my-5 scolcours-container">
		<div class="flex justify-between">
			<div>
				<h3 class="text-3xl">
					{{ deck.title }}
				</h3>
				<div class="font-code text-xs">
					{{ deck.slug }}
				</div>
				<Link :href="route('decks.index')">
				Retour à la liste des decks
				</Link>
			</div>
			<div>
				<div class="flex">
					<FormMaker
						v-model.number="chapterId"
						label="Chapitre"
						label-as-placeholder
						sm
						font-code
						@enter="assignChapter"
					/>
					<button
						class="btn btn-xs"
						@click="assignChapter"
					>
						OK
					</button>
				</div>
				<div
					class="text-xs text-gray-500 font-code"
					v-katex.auto="chapterTitle"
				/>
			</div>
		</div>

		<!-- view mode -->
		<flipcards-index :deck="props.deck" />
	</section>
</template>

<style scoped></style>
