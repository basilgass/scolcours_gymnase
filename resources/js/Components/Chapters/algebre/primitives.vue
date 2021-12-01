<template>
	<section ref="root">
		<Panel class="bg-green-300 border-green-600 border-l-4 border-l-red-400 rounded-l-none">
			La primitive \(F\) d'une fonction \(f\) est la fonction qui, lorsqu'elle est dérivée, donne la fonction \(f\)
		</Panel>

		<p>exemples</p>
		<div>
			\(f(x) = x^2 \implies F(x) = \frac{1}{3}\cdot x^3 + c\) avec \(c \in \mathbb{R}\)
		</div>

		<primitive-simple />
	</section>
</template>

<script setup>
	import Panel from "@/Components/Ui/Panel"
	import { onMounted, ref } from "vue"
	import PrimitiveSimple from "@/Components/Exercise/algebre/PrimitiveSimple"

	const root = ref(null)

	onMounted(()=>{
		window.katexAutoRender(root.value)
	})

</script>

