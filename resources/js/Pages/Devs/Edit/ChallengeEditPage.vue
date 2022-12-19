<template>
	<challenge-form
		v-model="show"
		:challenge="props.challenge.data"
	/>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>

<script setup>
import {ref} from "vue"
import ChallengeForm from "@/Components/Challenges/ChallengeForm.vue"

let props = defineProps({
	challenge: {type: Object, required: true}
})
let show = ref(true)

</script>
