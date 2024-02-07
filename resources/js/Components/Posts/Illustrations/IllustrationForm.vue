<script setup lang="ts">
import { computed, onMounted, PropType, reactive, ref } from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import FormImageDrop from "@/Components/Form/FormImageDrop.vue"
import { parserHelperText } from "pidraw/esm/Parser"
import FormMaker from "@/Components/Form/FormMaker.vue"
import { IllustrationInterface, widgetInterface } from "@/types/modelInterfaces.js"
import axios from "axios"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"

const emit = defineEmits(["change", "inputFocus", "destroy"])
let props = defineProps({
	illustration: { type: Object as PropType<IllustrationInterface>, required: true },
	active: { type: Boolean, default: false },
	focus: { type: Boolean, default: false }
})

const show = defineModel<boolean>()
const theIllustration = ref<IllustrationInterface>(props.illustration )

const chapterComponents = ref<{[Key: string]: widgetInterface}>({})
function toggleComponent (component:widgetInterface) {
	theIllustration.value.widget_id = component.id
	theIllustration.value.widget = component
	emit("change", theIllustration)
}
function imageFileDropped(e) {
	theIllustration.value.code = e
	emit("change", theIllustration.value)
}

function loadComponents() {
	// theModel.value.type = "component"
	axios
		.get(route("widgets.components"))
		.then((res) => {
			chapterComponents.value = res.data
		})
		.catch((err) => console.warn(err))
}

let drawParameters = reactive({
	axis: false,
	grid: false,
	x: "",
	y: "",
	nolabel: false,
	nopoint: false,
	tex: false
})

// List of draw parameters
const drawParametersList = [
	"axis",
	"grid",
	"x=-10:10",
	"y=-10:10",
	"nolabel",
	"nopoint",
	"tex"
]
let updateDrawParameters = function(event, value) {
	// Determine if the value is already in the parameters
	if (value.startsWith("x=")) {
		drawParameters.x = drawParameters.x === "" ? (value.split("=")[1]) : ""
	} else if (value.startsWith("y=")) {
		drawParameters.y = drawParameters.y === "" ? (value.split("=")[1]) : ""
	} else {
		drawParameters[value] = !drawParameters[value]
	}


	let opts = []
	for (const [key, value] of Object.entries(drawParameters)) {
		if (value === true) {
			opts.push(key)
		} else if (typeof value === "string" && value !== "") {
			opts.push(`${key}=${value}`)
		}
	}

	theIllustration.value.parameters =
		opts.length === 0 ? null : opts.join(",")
}

/**
 * Permet d'afficher les informations de la lignes courantes.
 * @type {Ref<UnwrapRef<string>>}
 */
let currentLine = ref(""),
	currentLineHelperText = computed(() => {
		return parserHelperText(currentLine.value)
	})


function updateIllustration(illustration: IllustrationInterface) {
	theIllustration.value = illustration
}

let saveIllustration = function() {
		axios
			.post(route("illustrations.update", [theIllustration.value.id]), {
				...theIllustration.value,
				_method: "PATCH"
			})
			.then((res) => {
				emit("change", res.data)
			})
			.catch((error) => {
				console.error(error)
			})
	},
	deleteIllustration = function() {
		axios
			.post(route("illustrations.destroy", [props.illustration.id]), {
				_method: "delete"
			})
			.then(() => {
				emit("destroy", props.illustration.id)
			})
			.catch((error) => console.error(error))
	},
	copyIllustration = function() {
		localStorage.setItem("scolcours-clipboard-illustration", `${theIllustration.value.parameters ?? ""}\n${theIllustration.value.code}`)
	},
	pasteIllustration = function() {
		let paste = localStorage.getItem("scolcours-clipboard-illustration")
		if (paste !== null) {
			const values = paste.split("\n")
			theIllustration.value.parameters = values.shift()
			theIllustration.value.code = values.join("\n")
		}
	},
	hasClipboard = computed(() => {
		return localStorage.getItem("scolcours-clipboard-illustration") !== null
	})
onMounted(() => {
	loadComponents()
})
</script>

<template>
	<dialog-modal
		v-model="show"
		class="bg-gray-50 min-h-[90vh]"
		@cancel="show=false"
	>
		<template #header>
			<div class="bg-white border-b border-gray-200 px-5 py-3 mb-5">
				<div class="flex justify-between items-baseline w-full">
					<h1>
						<span class="text-xl md:text-2xl"> édition d'une illustration </span>
						<span class="text-xs font-code ml-5"> (id: {{ theIllustration.id }}) </span>
					</h1>
					<div class="flex gap-3 justify-end">
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
						<button
							class="btn-primary btn-xs"
							@click="saveIllustration"
						>
							enregistrer
						</button>
						<button
							class="btn-cancel btn-xs"
							@click="show = false"
						>
							fermer
						</button>
						<confirm-button
							class="btn-delete btn-xs"
							@confirm="deleteIllustration"
						>
							supprimer
						</confirm-button>
					</div>
				</div>
			</div>
		</template>

		<div class="flex flex-col h-full">
			<div class="px-5 border-b">
				<!-- sélection du widget -->
				<h3 class="font-semibold">
					Sélectionner le module: {{ chapterComponents[theIllustration.value]?.name }}
				</h3>
				<div class="text-xs flex gap-2 flex-wrap px-3 py-2">
					<button
						v-for="(data, comp) of chapterComponents"
						:key="comp"
						v-theme.btn="data.theme_id"
						class="btn btn-xs transition-all"
						:class="theIllustration.widget.id === data.id ? 'font-semibold border-2 shadow scale-110' : ''"
						@click="toggleComponent(data)"
					>
						{{ data.name }}
					</button>
				</div>
			</div>

			<div class="flex-1 px-5">
				<!-- edition et previsualisation -->
				<div
					class="grid grid-cols-1 md:grid-cols-2 gap-3"
				>
					<div class="grid grid-cols-1 gap-3">
						<!-- image illustration -->
						<div
							v-if="chapterComponents[theIllustration.widget.id]?.component === 'image-widget.vue'"
							class="col-span-2 mb-5"
						>
							<form-image-drop @file-dropped="imageFileDropped" />
						</div>
						<!-- draw illustration -->
						<div
							v-else-if="chapterComponents[theIllustration.widget.id]?.component === 'draw-parser-widget.vue'"
							class="col-span-2 w-full"
						>
							<div class="mb-3">
								<form-maker
									v-model="theIllustration.parameters"
									class="font-code mt-3 text-xs"
									inline
									label="paramètres"
									sm
								/>
								<div
									class="font-code text-xs flex gap-3 justify-between px-1"
								>
									<button
										v-for="p in drawParametersList"
										:key="p"
										class="font-code text-xs"
										@click="updateDrawParameters($event, p)"
									>
										{{ p }}
									</button>
								</div>
							</div>

							<form-maker
								v-model="theIllustration.code"
								:hide-label="true"
								:rows="10"
								input-class="font-code"
								name="drawData"
								type="textarea"
								@current-line="currentLine = $event"
							/>

							<div class="font-code text-xs min-h-[3em] bg-gray-200">
								<div v-if="theIllustration.code.split('\n\n').length>1">
									%<*> afficher qu'une fois<br>
									%<...> afficher aux steps indiqués (que suivant) <br>
									%-FG- couche au premier plan
								</div>
								<hr>
								<div class="flex justify-between">
									<div>{{ currentLineHelperText.parameters }}</div>
									<div>{{ currentLineHelperText.options }}</div>
								</div>
								<div>{{ currentLineHelperText.description }}</div>
							</div>
						</div>
						<!-- component illustration -->
						<div
							v-else
							class="col-span-2  h-full w-full grid grid-cols-1 items-center"
						>
							<form-maker
								v-model="theIllustration.parameters"
								label="parametres"
							/>
							<form-maker
								v-model="theIllustration.code"
								:rows="10"
								language="latex"
								type="code"
							/>
							<markdown-it
								v-if="chapterComponents[theIllustration.widget.id]"
								:text="chapterComponents[theIllustration.widget.id].description"
								class="font-code text-xs min-h-[3em] bg-gray-200"
							/>
						</div>
					</div>
					<illustration-show
						:illustration="theIllustration"
						class="bg-white"
						preview
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full p-5">
				<form-maker
					v-model="theIllustration.title"
					inline
					sm
					label="nom de la figure"
				/>

				<form-maker
					v-model="theIllustration.css"
					class="font-code"
					inline
					sm
					label="css"
				/>
			</div>
		</div>
	</dialog-modal>
</template>
