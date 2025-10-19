<script lang="ts" setup>
import FormImageDrop from "@/Components/Form/FormImageDrop.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type {IllustrationInterface, WidgetInterface} from "@/types/modelInterfaces"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {computed, onMounted, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import Card from "@/Components/Ui/Card.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import FilteredList from "@/Components/Ui/FilteredList.vue"

// Define the layout
defineOptions({layout: LayoutMain})

// Props definition
const props = defineProps<{
	illustration: IllustrationInterface,
	parent: {
		id: number,
		type: "" | "Question"
	}
}>()

// Flash message
const flash = useStoreFlashMessage()

// reactive illustration data.
const theIllustration = ref<IllustrationInterface>(props.illustration)

const unknownWidget = {
	id: -1,
	name: " ? ",
	slug: null,
	component: null,
	theme_id: null,
	description: "module inconnu",
	control: false
}

// current component
const currentComponent = computed<WidgetInterface>(() => {
	const widget = chapterComponents.value
		.find(w => w.id === theIllustration.value?.widget?.id)
	return widget ?? unknownWidget
})

// available components.
const chapterComponents = ref<WidgetInterface[]>([])

// Load the list of components
function loadComponents() {
	axios
		.get(route("api.admin.widgets.index"))
		.then((res) => {
			chapterComponents.value = res.data
		})
		.catch((err) => console.warn(err))
}

// Change the current component.
function toggleComponent(component: WidgetInterface) {
	theIllustration.value.widget_id = component.id
	theIllustration.value.widget = component
}

// Specific components
function imageFileDropped(e) {
	theIllustration.value.code = e
}

// Helper for the current line.
const currentLine = ref("")
const currentLineHelperText = computed<{
	parameters: string,
	options: string,
	description: string
}>(() => {
	// TODO: Parse helper text from the current component.
	// if (currentComponent.value.slug === "draw-parser-widget") {
	// 	return parserHelperText(currentLine.value)
	// }
	return {
		parameters: "",
		options: "",
		description: ""
	}
})

// Copy / Paste illustration
const hasClipboard = computed(() => {
	return sessionStorage.getItem("scolcours-clipboard-illustration") !== null
})


function copyIllustration() {
	sessionStorage.setItem(
		"scolcours-clipboard-illustration",

		JSON.stringify({
			parameters: theIllustration.value.parameters,
			code: theIllustration.value.code,
			title: theIllustration.value.title,
			css: theIllustration.value.css,
			widget_id: theIllustration.value.widget_id,
			widget: theIllustration.value.widget
		})
	)
}

function pasteIllustration() {
	const clipboard = sessionStorage.getItem("scolcours-clipboard-illustration")
	if (clipboard) {
		const paste = JSON.parse(clipboard)

		theIllustration.value.parameters = paste.parameters
		theIllustration.value.code = paste.code
		theIllustration.value.title = paste.title
		theIllustration.value.css = paste.css
		theIllustration.value.widget_id = paste.widget_id
		theIllustration.value.widget = paste.widget
	}
}

// Save the illustration to database
function illustrationSave() {
	axios
		.post(route("api.admin.illustrations.update", [theIllustration.value.id]), {
			...theIllustration.value,
			_method: "PATCH"
		})
		.then(() => {
			flash.success("Illustration enregistrée")
		})
		.catch((error) => {
			console.error(error)
		})
}

// Save the illustration to database and go back to the belonging block.
function illustrationSaveAndEdit() {
	illustrationSave()

	if (props.parent.type === 'Question') {
		router.visit(route("admin.questions.edit", {question: props.parent.id}))
		return
	}

	router.visit(route("admin.blocks.edit", [theIllustration.value.block_id]))
}

// Visit the belonging block (no save, no edit)
function illustrationVisit() {
	// TODO: n'existe pas
	router.visit(route("illustrations.show", [theIllustration.value.id]))
}

// Delete the illustration
function illustrationDelete() {
	axios
		.post(route("api.admin.illustrations.destroy", [theIllustration.value.id]), {
			_method: "delete"
		})
		.then((res) => {
			flash.success("L'illustration a été supprimée")
			// Go to the post.
			router.visit(res.data)
		})
		.catch((error) => console.error(error))
}

onMounted(() => {
	loadComponents()
})
</script>

<template>
	<article class="my-5 scolcours-container">
		<header class="mb-5 flex justify-between gap-5">
			<div class="text-3xl flex-1">
				édition d'une illustration
			</div>

			<div>
				<sc-button
					class="outline-0"
					xs
					@click="copyIllustration"
				>
					<i class="bi bi-clipboard-plus" />
				</sc-button>
				<sc-button
					v-if="hasClipboard"
					class="outline-0"
					xs
					@click="pasteIllustration"
				>
					<i class="bi bi-clipboard-pulse" />
				</sc-button>
			</div>
			<div class="self-start grid grid-cols-2 gap-2 items-center flex-wrap">
				<sc-button
					type="primary"
					xs
					@click="illustrationSave"
				>
					enregistrer
				</sc-button>
				<sc-button
					type="primary"
					xs
					@click="illustrationSaveAndEdit"
				>
					<i class="bi bi-save" /> <i class="bi bi-arrow-right" /> <span>{{ parent.type ?? "Block" }}</span>
				</sc-button>
				<sc-button
					type="cancel"
					xs
					@click="illustrationVisit"
				>
					retour
				</sc-button>
				<confirm-button
					xs
					@confirm="illustrationDelete"
				>
					supprimer
				</confirm-button>
			</div>
			<div v-if="false">
				<button
					class="btn btn-xs"
					@click="copyIllustration"
				>
					<i class="bi bi-clipboard-plus" />
				</button>
				<button
					v-if="hasClipboard"
					class="btn btn-xs"
					@click="pasteIllustration"
				>
					<i class="bi bi-clipboard-pulse" />
				</button>
			</div>
		</header>
		<main class="flex flex-col h-full">
			<!-- sélection du widget -->
			<Card class="mb-3">
				<filtered-list
					:list="chapterComponents"
					no-title
				>
					<template #card="{item}: {item: WidgetInterface}">
						<sc-button
							:outline="theIllustration.widget.id !== item.id"
							:theme="item.theme_id ?? 0"
							xs
							@click="toggleComponent(item)"
						>
							{{ item.name }}
						</sc-button>
					</template>
				</filtered-list>
			</Card>

			<div class="flex-1">
				<!-- edition et prévisualisation -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
					<div class="grid grid-cols-1 gap-3">
						<!-- image illustration -->
						<div
							v-if="currentComponent?.component === 'image-widget.vue'"
							class="col-span-2 mb-5"
						>
							<form-image-drop @file-dropped="imageFileDropped" />
						</div>

						<!-- draw illustration -->
						<div
							v-else-if="currentComponent?.component === 'draw-parser-widget.vue'"
							class="col-span-2 w-full"
						>
							<div class="mb-3">
								<form-maker
									v-model="theIllustration.parameters"
									class="font-code mt-3 text-xs"
									inline
									label="paramètres"
									sm
								>
									<template #message>
										grid, axis, x=-5:5, y=-5:5, unit=1:2, tex, nolabel, nopoint
									</template>
								</form-maker>
							</div>

							<form-maker
								v-model="theIllustration.code"
								:hide-label="true"
								:rows="10"
								input-class="font-code"
								name="drawData"
								type="codearea"
								@current-line="currentLine = $event"
							/>

							<div class="font-code text-xs min-h-[3em]">
								<div v-if="theIllustration.code.split('\n\n').length > 1">
									%&lt;*&gt; afficher qu'une fois<br>
									%&lt;...&gt; afficher aux steps indiqués (que suivant) <br>
									%-FG- couche au premier plan
								</div>
								<hr>
								<div v-if="currentLine.startsWith('$')">
									$a=a,b,...,c/intervalle=valeur[~]<br>
									~ est optionnel: il désactive les parenthèses autour de la variable
								</div>
								<div
									v-else
									class="flex justify-between"
								>
									<div>{{ currentLineHelperText.parameters }}</div>
									<div>{{ currentLineHelperText.options }}</div>

									<div>{{ currentLineHelperText.description }}</div>
								</div>
							</div>
						</div>

						<!-- component illustration -->
						<div
							v-else
							class="col-span-2 h-full w-full flex flex-col gap-3"
						>
							<form-maker
								v-model="theIllustration.parameters"
								label="parametres"
							/>
							<form-maker
								v-model="theIllustration.code"
								:rows="10"
								language="latex"
								type="codearea"
							/>
							<markdown-it
								v-if="currentComponent"
								:text="currentComponent.description"
								class="font-code !text-xs min-h-[3em]"
							/>
						</div>
					</div>

					<illustration-show
						:illustration="theIllustration"
						class="bg-content p-5 border"
						preview
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full p-5">
				<form-maker
					v-model="theIllustration.title"
					inline
					label="nom de la figure"
					sm
				/>

				<form-maker
					v-model="theIllustration.css"
					class="font-code"
					inline
					label="css"
					sm
				/>
			</div>
		</main>
	</article>
</template>
