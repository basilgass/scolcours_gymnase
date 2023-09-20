<template>
	<form-field>
		<div class="flex flex-col gap-3 -mt-2">
			<form-input
				v-model="theModel.title"
				inline
				label="nom de la figure"
				name="title"
			/>

			<form-input
				v-model="theModel.css"
				class="font-code"
				inline
				label="css"
				name="css"
			/>
		</div>

		<div class="grid grid-cols-1 gap-3 mt-5">
			<div class="w-full grid grid-cols-3 gap-3">
				<button
					:class="modelValue.type==='image'?'bg-amber-200':'bg-white'"
					class="btn"
					@click.prevent="theModel.type='image'"
				>
					Image
				</button>
				<button
					:class="modelValue.type==='draw'?'bg-amber-200':'bg-white'"
					class="btn"
					@click.prevent="theModel.type='draw'"
				>
					Draw
				</button>
				<button
					:class="modelValue.type==='component'?'bg-amber-200':'bg-white'"
					class="btn"
					@click.prevent="loadComponents"
				>
					Component
				</button>
			</div>

			<!-- image illustration -->
			<div
				v-if="modelValue.type==='image'"
				class="col-span-2 mb-5"
			>
				<form-image-drop
					@file-dropped="imageFileDropped"
				/>
			</div>
			<!-- draw illustration -->
			<div
				v-else-if="modelValue.type==='draw'"
				class="col-span-2 h-full w-full"
			>
				<div class="mb-3">
					<div class="font-code text-xs grid grid-cols-3 gap-3 gap-y-0 items-end">
						<form-switch
							v-model="drawParameters.axis"
							label="axes"
							name="axis"
							sm
							@input="updateDrawParameters"
						/>

						<form-input
							v-model="drawParameters.x"
							inline
							label="x="
							name="gridX"
							sm
							@input="updateDrawParameters"
						/>

						<form-input
							v-model="drawParameters.y"
							inline
							label="y="
							name="gridY"
							sm
							@input="updateDrawParameters"
						/>
						<form-switch
							v-model="drawParameters.grid"
							label="grilles"
							name="grid"
							sm
							@input="updateDrawParameters"
						/>

						<form-switch
							v-model="drawParameters.nolabel"
							label="pt anonyme"
							name="nolabel"
							sm
							@input="updateDrawParameters"
						/>

						<form-switch
							v-model="drawParameters.nopoint"
							label="pt caché"
							name="nopoint"
							sm
							@input="updateDrawParameters"
						/>
					</div>
					<form-input
						v-model="theModel.parameters"
						class="font-code mt-3 text-xs"
						name="parameters"
						label="paramètres"
						inline
						sm
						@input="updateSwitchParameters"
					/>
				</div>

				<form-textarea
					v-model="theModel.code"
					:hide-label="true"
					:rows="10"
					name="drawData"
					@current-line="currentLine = $event"
				/>

				<div class="font-code text-xs min-h-[3em]">
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
				class="col-span-2 border-dashed border-gray-200 border-2 rounded h-full w-full grid grid-cols-1 text-center items-center"
			>
				<ol v-if="chapterComponents">
					<li
						v-for="(description, comp) of chapterComponents"
						:key="comp"
						:class="theModel.value===comp?'btn-success':'btn'"
						@click="theModel.value=comp"
					>
						{{ comp }}
					</li>
				</ol>
				<form-input
					v-model="theModel.parameters"
					label="parametres"
					name="drawParameters"
				/>
				<form-textarea
					v-model="theModel.code"
					:hide-label="true"
					:rows="10"
					name="drawData"
				/>
				<markdown-it
					v-if="chapterComponents[theModel.value]"
					:text="chapterComponents[theModel.value]"
					class="font-code text-left"
				/>
			</div>
		</div>
	</form-field>
</template>

<script setup>
import FormField from "@/Components/Form/FormField.vue"
import {computed, nextTick, onMounted, reactive, ref} from "vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import FormImageDrop from "@/Components/Form/FormImageDrop.vue"
import {parserHelperText} from "pidraw/esm/Parser"
import FormSwitch from "@/Components/Form/FormSwitch.vue"

defineEmits(["update:modelValue", "inputFocus"])
let props = defineProps({
	modelValue: {
		type: Object, default: () => {
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
	active: {type: Boolean, default: false},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""},
	focus: {type: Boolean, default: false}
})

function imageFileDropped(e) {
	theModel.value.code = e
	emit("update:modelValue", theModel.value)
}

let chapterComponents = ref({})

function loadComponents() {
	theModel.value.type = "component"
	axios.get(route("illustrations.components"))
		.then(res => {
			chapterComponents.value = res.data
		})
		.catch(err => console.warn(err))
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
	nopoint: false
})
let updateDrawParameters = async function () {
		await nextTick()
		let opts = []
		for(const [key, value] of Object.entries(drawParameters)){
			if(value===true){
				opts.push(key)
			}else if(typeof value==="string" && value!==""){
				opts.push(`${key}=${value}`)
			}
		}

		theModel.value.parameters = opts.length===0?null:opts.join(",")
	},
	updateSwitchParameters = async function(){
		await nextTick()

		if (props.modelValue.type ==="draw" && props.modelValue.parameters){
			let opts = props.modelValue.parameters.split(",")
			drawParameters.axis = opts.includes("axis")
			drawParameters.grid = opts.includes("grid")
			drawParameters.nolabel = opts.includes("nolabel")
			drawParameters.nopoint = opts.includes("nopoint")
			const x = opts.filter(value=>value.startsWith("x="))
			if(x.length===1) {
				drawParameters.x = x[0].split("=")[1] || ""
			}
			const y = opts.filter(value=>value.startsWith("y="))
			if(y.length===1) {
				drawParameters.y = y[0].split("=")[1] || ""
			}
		}
	}

let currentLine = ref(""),
	currentLineHelperText = computed(() => {
		return parserHelperText(currentLine.value)
	})

onMounted(() => {
	if (props.modelValue.type === "component") {
		loadComponents()
	}

	updateSwitchParameters()
})
</script>
