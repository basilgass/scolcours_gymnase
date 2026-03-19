<script
	lang="ts"
	setup
>
import {PropType} from "vue"
import type {ChallengeInterface} from "@/types/modelInterfaces"
import Card from "@/Components/Ui/Card.vue"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"

defineOptions({layout: LayoutAdmin})

defineProps({
	challenges: {type: Object as PropType<ChallengeInterface[]>, required: true}
})

</script>
<template>
	<section class="scolcours-container">
		<h1 class="text-3xl pt-5 mb-10">
			administration des challenges
		</h1>
		<div class="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
			<card
				v-for="challenge in challenges"
				:key="challenge.slug"
				v-theme.bg.text="challenge.chapter.theme_id"
				with-themes
			>
				<div>
					<InertiaLink
						v-katex.auto="challenge.title"
						:href="route('challenges.show', { challenge: challenge.slug })"
						class="text-lg leading-6 font-medium"
					/>
					<p class="max-w-2xl text-sm font-code">
						{{ challenge.slug }}
					</p>
					<div class=" mt-3 flex justify-between text-xs font-code">
						<div>{{ challenge.updated_at }}</div>
						<div>Is activated</div>
					</div>
				</div>
			</card>
		</div>
	</section>
</template>


