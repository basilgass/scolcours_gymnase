<!--
Affichage du titre de la page
TODO: est-ce vraiment utile (utilisé dans DEV et language)
-->
<template>
	<Head>
		<title>
			{{ headTitle }}
		</title>
	</Head>
	<transition name="title-effect">
		<div>
			<h1
				v-if="showTitle"
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
<script setup>
import {computed, onMounted, ref} from "vue"

const props = defineProps({
	title: String,
	subtitle: {type: String, default: null},
	head: String,
	chapter: String
})

let headTitle = computed(() => {
	if (props.head) {
		return props.head
	}
	let calculatedTitle = "ScolCours"

	if (props.chapter) {
		calculatedTitle = props.chapter + "-" + calculatedTitle
	}

	if (props.title) {
		calculatedTitle = props.title + "-" + calculatedTitle
	}

	return calculatedTitle
})

let showTitle = ref(false)

onMounted(() => {
	showTitle.value = true
})
</script>
