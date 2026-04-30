<script setup lang="ts">

import {ChallengeInterface} from "@/types/challengeInterfaces.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import Leaderboard from "@/Components/Challenges/Leaderboard.vue"

defineOptions({layout: LayoutMain})

defineProps<{
	challenge: ChallengeInterface,
	teams: number[]
}>()

</script>

<template>
	<section>
		<article-title
			title="classement"
			:return-link="{
				label: 'retour au challenge',
				url: route('challenges.show', challenge.slug)
			}"
		>
			<template #right>
				<div
					v-admin
					class="font-code text-xs"
				>
					id {{ challenge.id }}
				</div>
			</template>
		</article-title>

		<Leaderboard
			:challenge-id="challenge.id"
			:teams
		/>
	</section>
</template>

<style scoped>

</style>
