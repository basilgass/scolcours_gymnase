<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import { BookInterface } from "@/types/modelInterfaces.ts"
import axios from "axios"
import { ref, watch } from "vue"

const props = defineProps<{
	language: string,
}>()

const book = defineModel<number>()

const books = ref<BookInterface[]>()


watch(()=>props.language, ()=>{
	// load asynchronously the list of books for this language.
	axios.get(route('translation.books', [props.language]))
		.then(res=>{
			books.value = res.data
		})
})
const bookTitle = ref<string>("")
const bookSlug = ref<string>("")
function createBook(){
	axios.post(route('translation.books.create'), {
		language: props.language,
		slug: bookSlug.value,
		title: bookTitle.value
	}).then(res=>{
		books.value.push(res.data)
		book.value = res.data.id
	}).catch(res=>{
		console.log(res.response.data.message)
	})
}

</script>

<template>
	<article class="flex flex-col gap-2">
		<button
			v-for="b in books"
			:key="b.id"
			class="btn btn-xs text-left hover:pl-2 transition-all"
			:class="book===b.id ? 'is-active': 'bg-white'"
			@click="book === b.id ? book = -1 : book = b.id"
		>
			{{ b.title }} ({{ b.slug }} / {{ b.id }})
		</button>
		<div
			class="flex flex-col items-end border rounded-sm p-3 bg-white"
			v-if="book===-1"
		>
			<form-maker
				v-model="bookTitle"
				label="nouveau livre"
				class="flex-1 w-full"
			/>
			<form-maker
				v-model="bookSlug"
				label="code du livre"
				class="flex-1 w-full"
				sm
			/>

			<button
				class="btn btn-add mt-3"
				@click="createBook"
			>
				Créer
			</button>
		</div>
	</article>
</template>
