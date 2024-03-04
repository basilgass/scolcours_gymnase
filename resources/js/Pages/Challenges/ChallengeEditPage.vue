<script setup lang="ts">
import { ref } from "vue"
import ChallengeForm from "@/Components/Challenges/ChallengeForm.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })
const props = defineProps({
	challenge: {type: Object, required: true}
})
const show = ref(true)

</script>

<template>
	<challenge-form
		v-model="show"
		:challenge="props.challenge.data"
	/>
</template>
