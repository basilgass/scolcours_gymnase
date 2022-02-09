<template>
	<!-- Title -->
	<div ref="root">
		<ArticleTitle title="Dev" />
		<div class="katex-boxed">
			DU texte bloc:
			
			\[3x^2 + 3x^2 + \sqrt{3x-5} + 3x^2 + \sqrt{3x-5} + 3x^2 + \sqrt{3x-5} + 3x^2 + \sqrt{3x-5} + 3x^2 + \sqrt{3x-5}\]
			
			et du texte en ligne \(3x^2 + \sqrt{3x-5} + 3x^2 + \sqrt{3x-5} \) avec une suite dans les idées.
		</div>
	</div>
</template>
<script>
import LayoutMain from '@/Pages/Shared/LayoutMain'

export default {
	layout: LayoutMain
}
</script>
<script setup>
import ArticleTitle from '@/Components/Ui/ArticleTitle'
import { onMounted,ref } from 'vue'

let root = ref(null)
onMounted(() => {
	katexAutoRender(root.value)
})

</script>

