<template>
	<Head>
		<title>
			{{ headTitle }}
		</title>
	</Head>
	<transition name="title-effect">
		<h1
			v-if="showTitle"
			class="text-3xl pt-5 mb-2"
		>
			{{ title }}
		</h1>
	</transition>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import chapter from '@/Pages/Chapters/Chapter'

const props = defineProps({
	title: String,
	head: String,
	chapter: String
})

let headTitle = computed(()=>{
	if(props.head){
		return props.head
	}
	let calculatedTitle = 'ScolCours'
	
	if(props.chapter){
		calculatedTitle = props.chapter+'-'+calculatedTitle
	}
	
	if(props.title){
		calculatedTitle = props.title + '-' + calculatedTitle
	}
	
	return calculatedTitle
})

let showTitle = ref(false)

onMounted(()=>{
	showTitle.value = true
})
</script>