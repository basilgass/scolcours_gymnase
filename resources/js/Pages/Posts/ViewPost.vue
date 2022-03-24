<!--suppress ALL -->
<template>
	<div
		ref="root"
		class="py-6"
	>
		<component
			:is="PostTemplate"
			:post="post"
		/>
	</div>
</template>

<script>
import LayoutMain from "@/Pages/Shared/LayoutMain"

export default {
	layout: LayoutMain
}
</script>

<script setup>
import {computed, defineAsyncComponent, onMounted, ref} from "vue"

let root = ref(null)

const props = defineProps({
	post: {
		type: Object, default: () => {
		}
	}
})

const PostTemplate = computed(
	() => defineAsyncComponent(
		() => import(`@/Components/Posts/Templates/${props.post.template.component}`)
	)
)

</script>
