<template>
	<h1 class="text-3xl pt-5">
		Contrôle des illustrations
	</h1>

	<section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
		<illustration-show
			v-for="(illustration, id) of illustrations"
			:key="`illustration-${id}`"
			:illustration="illustration"
		/>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>

import ProgressBar from "@/Components/Ui/ProgressBar.vue"
import {computed} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"

let props = defineProps({
	illustrations: {type: Array, required: true}
})
</script>

