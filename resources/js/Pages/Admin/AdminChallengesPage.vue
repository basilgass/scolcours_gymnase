<script
	lang="ts"
	setup
>
import { PropType } from "vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type { ChallengeInterface } from "@/types/modelInterfaces"

defineOptions({ layout: LayoutMain })
defineProps({
	challenges: { type: Object as PropType<ChallengeInterface[]>, required: true }
})

</script>
<template>
	<section class="scolcours-container">
		<h1 class="text-3xl pt-5 mb-10">
			administration des challenges
		</h1>
		<div class="w-full">
			<div
				v-for="challenge in challenges"
				:key="challenge.slug"
				class="hover:bg-gray-200 flex justify-between px-4 py-2"
			>
				<div>
					<InertiaLink
						:href="route('challenges.show', [challenge.slug])"
						class="text-lg leading-6 font-medium text-gray-900"
					>
						{{ challenge.title }}
					</InertiaLink>
					<p class="mt-1 max-w-2xl text-sm text-gray-500">
						{{ challenge.slug }}
					</p>
				</div>
				<div>
					<div>{{ challenge.updated_at }}</div>
					<div>Is activated</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped></style>
