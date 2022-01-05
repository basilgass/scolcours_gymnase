<template>
	<div class="mb-4">
		<Link
			href="/challenge"
			class="text-sm text-gray-400 hover:text-gray-800 transition-colors"
		>
			<i class="bi bi-chevron-left text-xs mr-2" />retour à la liste
		</Link>
	</div>
	<component
		:is="challengeComponent"
	/>
</template>

<script>
import LayoutMain from '@/Pages/Shared/LayoutMain'

export default {
	layout: LayoutMain
}
</script>
<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'

const props = defineProps({
	'challenge': String,
	'theme': Object,
})

const challengeComponent = computed(
	() => defineAsyncComponent(
		() => import(`@/Components/Challenges/${props.challenge}`)
	)
)

</script>
