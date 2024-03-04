<!--
Affichage du titre de la page
TODO: est-ce vraiment utile (utilisé dans DEV et language)
-->
<script setup lang="ts">
import { computed, onMounted, ref } from "vue"

const props = defineProps({
	title: { type: String, default: "" },
	subtitle: {type: String, default: null},
	head: { type: String, default: "" },
	chapter: { type: String, default: "" }
})

const headTitle = computed(() => {
	if (props.head) {
		return props.head
	}
	let calculatedTitle = "ScolCours"

	if (props.chapter) {
		calculatedTitle = props.chapter + " - " + calculatedTitle
	}

	if (props.title) {
		calculatedTitle = props.title + " - " + calculatedTitle
	}

	return calculatedTitle
})

const showTitle = ref(false)

onMounted(() => {
	showTitle.value = true
})
</script>
<template>
	<Head title="blalbal">
		<title>
			{{ headTitle }}
		</title>
	</Head>
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
