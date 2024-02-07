<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain,
}
</script>
<script setup>
import {ref} from "vue"
import IllustrationForm from "@/Components/Posts/Illustrations/IllustrationForm.vue"

let props = defineProps({
	illustration: {type: Object, required: true},
})
let show = ref(true)
</script>

<template>
	<illustration-form
		v-model="show"
		:illustration="props.illustration"
	/>
</template>
