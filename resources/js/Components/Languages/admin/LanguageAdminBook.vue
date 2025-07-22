<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import {BookInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {ref, watch} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

const props = defineProps<{
	language: string,
}>()

const book = defineModel<number>()

const books = ref<BookInterface[]>()


watch(() => props.language, () => {
	// load asynchronously the list of books for this language.
	axios.get(route('api.voc.languages.books.index', {language: props.language}))
		.then(res => {
			books.value = res.data
		})
})
const bookTitle = ref<string>("")
const bookSlug = ref<string>("")

function createBook() {
	axios.post(route('api.admin.voc.languages.books.store', {language: props.language}), {slug: bookSlug.value,
		title: bookTitle.value
	}).then(res => {
		books.value.push(res.data)
		book.value = res.data.id
	}).catch(res => {
		console.log(res.response.data.message)
	})
}

</script>

<template>
	<article class="flex flex-col gap-2">
		<div class="flex flex-col gap-3">
			<sc-button
				v-for="b in books"
				:key="b.id"
				type="admin"
				:outline="book!==b.id"
				@click="book === b.id ? book = -1 : book = b.id"
				class="text-left"
			>
				{{ b.title }} ({{ b.slug }} / {{ b.id }})
			</sc-button>
		</div>
		<div
			class="flex flex-col items-end border rounded-sm p-3 bg-content"
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

			<sc-button
				type="add"
				class="mt-3"
				@click="createBook"
			>
				Créer
			</sc-button>
		</div>
	</article>
</template>
