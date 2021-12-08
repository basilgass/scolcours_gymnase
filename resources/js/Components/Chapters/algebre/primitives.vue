<template>
	<section ref="root">
		<Panel
				type="definition"
			>
			<div>
				La primitive \(F\) d'une fonction \(f\) est la fonction qui, lorsqu'elle est dérivée, donne la fonction
				\(f\).
			</div>
			<div class="mt-4">
				<h3 class="md:inline md:mr-4">
					exemple
				</h3>
				<span>
					\(f(x) = x^2 \implies F(x) = \frac{1}{3}\cdot x^3 + c\) avec \(c \in \mathbb{R}\)
				</span>
			</div>
		</Panel>
		<primitive-simple />
	</section>
</template>

<script setup>
import Panel from '@/Components/Ui/Panel'
import { onMounted, ref } from 'vue'
import PrimitiveSimple from '@/Components/Exercise/algebre/PrimitiveSimple'

const root = ref(null)

onMounted(()=>{
	katexAutoRender(root.value)
})

</script>

