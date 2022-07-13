<!--suppress ALL -->
<template>
	<article>
		<div class="pt-4 mb-4">
			<Link
				:href="route('theme.chapter', [$page.props.theme.slug, challenge.chapter.slug])"
				class="text-sm text-gray-400 hover:text-gray-800 transition-colors"
			>
				<i class="bi bi-chevron-left text-xs mr-2" />retour à {{ props.challenge.chapter.title }}
			</Link>
		</div>

		<component
			:is="challengeComponent"
		/>
	</article>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"


export default {
	layout: LayoutMain
}

</script>
<script setup>
import {computed, defineAsyncComponent, ref} from "vue"
import ChallengeWrapper from "@/Components/Challenges/ui/challengeWrapper"
import {provide} from "vue"

const props = defineProps({
	"challenge": {type:Object, required:true},
	"component": {type: String, require: true}
})

provide("challenge", props.challenge)

const challengeComponent = computed(
	() => defineAsyncComponent(
		() => import(`@/Components/${props.component}`)
	)
)

</script>
