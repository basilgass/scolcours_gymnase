<!--
Affichage du titre de la page
TODO: est-ce vraiment utile (utilisé dans DEV et language et d'autres - renommer et le rendre plus utile ?)
-->
<script lang="ts" setup>
import { onMounted, ref } from "vue"

defineProps({
	title: { type: String, default: "" },
	subtitle: { type: String, default: null },
	head: { type: String, default: "" },
	chapter: { type: String, default: "" }
})

const showTitle = ref(false)

onMounted(() => {
	showTitle.value = true
})
</script>
<template>
	<transition name="title-effect">
		<div v-if="showTitle">
			<h1

				class="text-3xl pt-5 mb-2"
			>
				{{ title }}
			</h1>
			<h3
				v-if="subtitle!==null"
				class="text-xl mb-2"
			>
				{{ subtitle }}
			</h3>
		</div>
	</transition>
</template>
