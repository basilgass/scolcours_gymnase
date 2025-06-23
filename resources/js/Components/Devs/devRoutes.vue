<script setup lang="ts">

import FormMaker from "@/Components/Form/FormMaker.vue"
import {watchDebounced} from "@vueuse/core"
import {AxiosErrorMessage} from "@/types"
import {ref} from "vue"
import axios from "axios"

const name = ref<{ id: number, title: string }>()
const result = ref([])
watchDebounced(name, getRoute, {debounce: 1000, maxWait: 2000})

function getRoute(value: { id: number, title: string } | string) {

	const [n, ...params] = typeof value === 'string' ?
		value.split(',') :
		name.value.title.split(',')

	axios.get(route(n, params))
		.then((res) => {
			result.value = res.data
		})
		.catch((err: AxiosErrorMessage) => result.value = [err.response.data.message])
}
</script>

<template>
	<div>
		<form-maker
			type="search"
			:fetch="route('routes.index')"
			v-model="name"
			@enter="getRoute($event as string)"
		/>
		<pre class="text-xs">{{ result }}</pre>
	</div>
</template>

<style scoped>

</style>
