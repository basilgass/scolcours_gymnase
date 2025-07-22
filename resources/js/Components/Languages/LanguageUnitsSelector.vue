<script lang="ts" setup>

import {BookInterface, TranslationUnitInterface, TranslationUnitInterfaceExtended} from "@/types/modelInterfaces"
import axios from "axios"
import {computed, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

const units = defineModel<TranslationUnitInterfaceExtended[]>()

defineProps<{
	books: BookInterface[]
}>()

const selectedBook = ref(-1)


const updateUnits = function (item: TranslationUnitInterfaceExtended) {
	// Change the state
	item.selected = !item.selected

	// Load the missing words
	if (item.words.length === 0) {
		axios.get(route("api.admin.voc.units.words.index", {unit: item.id}))
			.then(res => {
				item.words = res.data
			})
	}
}

const numberOfWords = computed(() => {
	// sum for all units selected, get the number of words
	return units.value.reduce((acc, item) => {
		return item.selected ? acc + item.words.length : acc
	}, 0)
})

function getUnits_from_Book(book_id: number) {
	if (selectedBook.value === book_id) {
		selectedBook.value = -1
		units.value = []
		return
	}
	selectedBook.value = book_id
	units.value = []

	axios.get(route("api.admin.voc.books.units.index", {book: book_id}))
		.then(res => {
			units.value = res.data.map((value: TranslationUnitInterface) => {
				return {
					...value,
					selected: false,
					words: []
				}
			})
		})
}

// TODO: Loading books async or not ?
// onMounted(() => {
// 	axios.get(route('voc.languages.books.index', {language: 2}))
// 		.then(res => {
// 			console.log(res.data)
// 		})
//
// })

</script>

<template>
	<div class="">
		<div
			class="list
		flex flex-col
		space-y-5"
		>
			<div
				v-for="book in books"
				:key="book.id"
				:class="book.id===selectedBook?'open':''"
				class="card flex items-start bg-white rounded-lg"
				@click="getUnits_from_Book(book.id)"
			>
				<div class="book-img">
					<img
						v-if="book.cover"
						class="book z-0"
						:src="book.cover"
					>
					<div
						v-else
						class="book z-0 w-[80px] h-[160px] grid place-items-center border"
					>
						<i
							class="bi bi-image text-5xl text-gray-500"
							:class="book.id===selectedBook?'':'-mt-[70px]'"
						/>
					</div>
				</div>

				<div class="flex-1 flex flex-col p-2 info z-10">
					<div
						class="text-lg font-extralight"
					>
						{{ book.title }}
					</div>
					<div
						:class="book.id===selectedBook?'':'hidden'"
						class="transition duration-200 text-xs"
					>
						Nombre de mots: {{ numberOfWords }}
					</div>
					<div
						class="bottom summary"
						@click.stop
					>
						<div class="flex flex-wrap gap-2">
							<sc-button
								v-for="(item, key) of units"
								:key="key"
								:active="item.selected"
								xs
								@click="updateUnits(item)"
							>
								{{ item.title }}
							</sc-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.list {
	& .card {
		cursor: pointer;
		transition: all 0.1s;
		box-shadow: 0 1px 4px rgba(0, 0, 0, .2);
		overflow: hidden;
		height: 90px;
		position: relative;
		padding-left: 130px;

		& .book-img {
			position: absolute;
			top: 0;
			left: 0;
			width: 700px;
			perspective: 700px;
		}

		& .bottom {
			height: 0;
			overflow: hidden;
			font-weight: normal;
		}

		&.open {
			height: auto;
			min-height: 250px;
			padding: 10px 10px 10px 150px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, .2);

			& .bottom {
				padding-top: 20px;
				padding-bottom: 20px;
				height: 100%;
				overflow: visible;
			}

			& .book-img {
				top: 20px;
				left: 20px;
			}

			& .book {
				transform: rotateY(50deg);
				box-shadow: -10px 10px 10px 2px rgba(0, 0, 0, .2), -2px 0px 0px 0px #888;
				transition: all 0.5s;
				transition-delay: 0.05s;
			}


		}

		& .book {
			transition: all 0.5s;
			width: 120px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
			overflow: hidden;
		}

	}
}
</style>
