<script setup lang="ts">
import { PropType, ref } from "vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { QuestionInterface } from "@/types/modelInterfaces"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	question: {type: Object as PropType<QuestionInterface>, required: true}
})

const theQuestion = ref(props.question)
</script>
<template>
	<article>
		Something here
	</article>
</template>
