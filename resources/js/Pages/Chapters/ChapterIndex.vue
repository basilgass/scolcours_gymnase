<script lang="ts" setup>
import ChapterCard from "@/Components/Chapters/ChapterCard.vue"
import ChapiterIndexCreateAdmin from "@/Components/Chapters/ChapterIndexCreateAdmin.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type {ChallengeInterface, ChapterShowInterface} from "@/types/modelInterfaces"
import {router} from "@inertiajs/vue3"
import ArticleSubtitle from "@/Components/Ui/ArticleSubtitle.vue"
import ChallengeCard from "@/Components/Challenges/ChallengeCard.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	chapters: ChapterShowInterface[],
	challenges: ChallengeInterface[]
}>()

function triggerEnter(items: ChapterShowInterface[]) {
	// si il n'y a qu'un élément afficher, on le charge.
	if (items.length === 1) {
		router.visit(route("chapters.show", [items[0].id]))
		return
	}
}

// Load the scores for the challenges (do it once)
const useScore = useStoreScore()
useScore.getScores('Challenge', props.challenges.map(x => x.id))

</script>

<template>
	<section class="scolcours-container space-y-12">
		<article>
			<article-subtitle>Chapitres</article-subtitle>

			<filtered-list
				:list="chapters"
				class=""
				list-class="columns-xs space-y-5"
				@enter="triggerEnter"
			>
				<template #button>
					<ChapiterIndexCreateAdmin />
				</template>

				<template #card="{ item }: { item: ChapterShowInterface }">
					<chapter-card :chapter="item" />
				</template>
			</filtered-list>
		</article>

		<article>
			<article-subtitle>Challenges</article-subtitle>

			<filtered-list :list="challenges">
				<template #card="{ item }: { item: ChallengeInterface }">
					<challenge-card :challenge="item" />
				</template>
			</filtered-list>
		</article>
	</section>
</template>
