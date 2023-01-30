<template>
	<article>
		<ArticleTitle :title="language" />

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<Link
				:href="`/${language}/memory`"
				class="bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				memory
			</Link>
			<Link
				:href="`/${language}/guess`"
				class="bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				suggestions
			</Link>
			<Link
				:href="`/${language}/list`"
				class="bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				liste des mots
			</Link>
			<Link
				:href="`/${language}/type`"
				class="bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				Typographie
			</Link>
		</div>
	</article>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {computed, nextTick, ref, watch} from "vue"
import {PiMath} from "pimath/esm"
import FormInput from "@/Components/Form/FormInput.vue"
import FormNumber from "@/Components/Form/FormNumber.vue"

let props = defineProps({
	language: {type: String, required: true},
})
</script>
