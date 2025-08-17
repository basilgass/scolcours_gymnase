<script setup lang="ts">

import GeneratorItem from "@/Components/Elements/GeneratorItem.vue"
import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ChallengeTraining from "@/Components/Challenges/ChallengeTraining.vue"

defineOptions({ layout: LayoutMain })
defineProps<{
	generator: GeneratorInterface
}>()
</script>

<template>
	<article>
		<suspense>
			<challenge-training :generator />
		</suspense>
	</article>
</template>

<style scoped>

</style>
