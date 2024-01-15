<script setup>
import { computed, onMounted, reactive, ref } from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import FormImageDrop from "@/Components/Form/FormImageDrop.vue"
import { parserHelperText } from "pidraw/esm/Parser"
import FormMaker from "@/Components/Form/FormMaker.vue"

defineEmits(["update:modelValue", "inputFocus"])
let props = defineProps({
	modelValue: {
		type: Object,
		default: () => {
			return {
				title: "",
				type: "draw",
				value: "",
				code: "",
				parameters: "",
				css: "",
				order: 0
			}
		}
	},
	active: { type: Boolean, default: false },
	name: { type: String, required: true },
	label: { type: String, default: "" },
	error: { type: String, default: "" },
	focus: { type: Boolean, default: false }
})

function imageFileDropped(e) {
	theModel.value.code = e
	emit("update:modelValue", theModel.value)
}

let chapterComponents = ref({})

function loadComponents() {
	theModel.value.type = "component"
	axios
		.get(route("illustrations.components"))
		.then((res) => {
			chapterComponents.value = res.data
		})
		.catch((err) => console.warn(err))
}

let theModel = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value)
})

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

	theModel.value.parameters =
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

onMounted(() => {
	if (props.modelValue.type === "component") {
		loadComponents()
	}
})
</script>

<template>
	<div class="form-illustration-wrapper">
		<div class="flex flex-col gap-3 -mt-2">
			<form-maker
				v-model="theModel.title"
				inline
				label="nom de la figure"
			/>

			<form-maker
				v-model="theModel.css"
				class="font-code"
				inline
				label="css"
			/>
		</div>

		<div class="grid grid-cols-1 gap-3 mt-5">
			<div class="w-full grid grid-cols-3 gap-3">
				<button
					:class="
						modelValue.type === 'image'
							? 'bg-amber-200'
							: 'bg-white'
					"
					class="btn"
					@click.prevent="theModel.type = 'image'"
				>
					Image
				</button>
				<button
					:class="
						modelValue.type === 'draw' ? 'bg-amber-200' : 'bg-white'
					"
					class="btn"
					@click.prevent="theModel.type = 'draw'"
				>
					Draw
				</button>
				<button
					:class="
						modelValue.type === 'component'
							? 'bg-amber-200'
							: 'bg-white'
					"
					class="btn"
					@click.prevent="loadComponents"
				>
					Component
				</button>
			</div>

			<!-- image illustration -->
			<div
				v-if="modelValue.type === 'image'"
				class="col-span-2 mb-5"
			>
				<form-image-drop @file-dropped="imageFileDropped" />
			</div>
			<!-- draw illustration -->
			<div
				v-else-if="modelValue.type === 'draw'"
				class="col-span-2 h-full w-full"
			>
				<div class="mb-3">
					<form-maker
						v-model="theModel.parameters"
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
					v-model="theModel.code"
					:hide-label="true"
					:rows="10"
					input-class="font-code"
					name="drawData"
					type="textarea"
					@current-line="currentLine = $event"
				/>

				<div class="font-code text-xs min-h-[3em]">
					<div v-if="theModel.code.split('\n\n').length>1">
						%<*> afficher qu'une fois<br>
						%<...> afficher aux steps indiqués (que suivant) <br>
						%-FG- couche au premier plan
					</div>
					<hr>
					<div class="flex justify-between">
						<div>{{ currentLineHelperText.parameters }}</div>
						<div>{{ currentLineHelperText.config }}</div>
					</div>
					<div>{{ currentLineHelperText.description }}</div>
				</div>
			</div>
			<!-- component illustration -->
			<div
				v-else
				class="col-span-2  h-full w-full grid grid-cols-1 items-center"
			>
				<div
					v-if="chapterComponents"
				>
					<h3 class="font-semibold">
						Sélectionner le module
					</h3>
					<div class="text-xs flex gap-2 flex-wrap px-3 py-2 mb-5">
						<button
							v-for="(description, comp) of chapterComponents"
							:key="comp"
							class="btn btn-xs"
							:class="theModel.value === comp ? 'font-semibold' : ''"
							@click="theModel.value = comp"
						>
							{{ comp }}
						</button>
					</div>
				</div>
				<form-maker
					v-model="theModel.parameters"
					label="parametres"
				/>
				<form-maker
					v-model="theModel.code"
					:rows="10"
					language="latex"
					type="code"
				/>
				<markdown-it
					v-if="chapterComponents[theModel.value]"
					:text="chapterComponents[theModel.value]"
					class="font-code text-left text-xs"
				/>
			</div>
		</div>
	</div>
</template>
