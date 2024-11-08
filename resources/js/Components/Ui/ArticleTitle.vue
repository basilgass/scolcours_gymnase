<!--
Affichage du titre de la page
TODO: est-ce vraiment utile (utilisé dans DEV et language et d'autres - renommer et le rendre plus utile ?)
-->
<script lang="ts" setup>

defineProps({
	title: { type: String, default: "" },
	subtitle: { type: String, default: null },
	head: { type: String, default: "" },
	chapter: { type: String, default: "" }
})

</script>
<template>
	<header>
		<h1
			v-katex.auto="title"
			class="text-3xl pt-5 mb-2"
		/>
		<h3
			v-if="subtitle!==null"
			class="text-xl mb-2"
		>
			{{ subtitle }}
		</h3>
	</header>
</template>
