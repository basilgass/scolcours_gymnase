<template>
	<div class="w-full">
		<div class="flex justify-between gap-3 mb-4">
			<button
				v-if="props.hideable"
				class="btn-xs btn-edit"
				@click="showEditForm=!showEditForm"
			>
				éditer la question <i class="bi bi-pencil" />
			</button>

			<div v-show="showEditForm">
				<button
					class="btn-xs btn-edit"
					@click="patchQuestion"
				>
					<i class="bi bi-arrow-clockwise mr-3" /> Enregistrer
				</button>
				<button
					class="btn-xs btn-cancel"
					@click="cancelQuestion"
				>
					<i class="bi bi-x-lg mr-3" /> Annuler
				</button>
			</div>
		</div>
		<div
			v-show="showEditForm"
			class="grid grid-cols-1 gap-4 border-t -mx-4 -mb-2 px-4 pb-2"
		>
			<form-input
				v-model="form.answer"
				label="réponse"
				name="answer"
				class="font-code"
			/>

			<div class="flex items-end gap-4 w-full">
				<div class="grow">
					<form-input
						v-model="form.checker"
						label="Vérification"
						name="checker"
						class="font-code"
					/>
				</div>

				<div class="grow">
					<form-input
						v-model="form.keyboard"
						label="clavier"
						name="clavier"
						class="font-code"
					/>
				</div>
			</div>
			<div>
				<button
					v-for="(item, key) in checkersList"
					:key="key"
					class="btn btn-xs"
					@click="form.checker=key"
				>
					{{ `${key}${item.length>0?` @${item.join(' @')}`:''}` }}
				</button>
			</div>
			<div>
				<button
					v-for="item of keyboardsList"
					:key="item"
					class="btn btn-xs"
					@click="form.keyboard=item"
				>
					{{ item }}
				</button>
			</div>

			<div v-if="qcmShow">
				<div class="grid grid-cols-2">
					<h3 class="text-lg">
						QCM editor
					</h3>
					<h4 class="font-semibold">
						résultat <span
							class="font-code ml-5"
							v-text="qcmResult"
						/>
					</h4>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
					<textarea
						v-model="qcmInput"
						class="font-code border p-2"
						:rows="qcmRows"
						@input="qcmUpdate"
						@focus="qcmFocus"
					/>
					<div class="grid grid-cols-1 gap-3">
						<div
							v-for="btn of qcmButtons"
							:key="btn.value"
							class="grid grid-cols-2 gap-3 items-center"
						>
							<button
								class="btn"
								@click="qcmResult=btn.value"
							>
								<span
									v-if="btn.ascii"
									v-katex.display.ascii="btn.display"
								/>
								<span
									v-else
									v-katex.display.auto="btn.display"
								/>
							</button>
							<div class="font-code">
								>> {{ btn.value }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-if="studyShow">
				<h3 class="text-lg">
					Paramètres
				</h3>

				<div>
					<form-switch
						v-for="(item, key) of studyValues"
						:key="key"
						v-model="studyValues[key].selected"
						:name="studyValues[key].display"
						:label="studyValues[key].display"
						label-right
						@input="studyUpdate"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import FormInput from "@/Components/Form/FormInput"
import {useForm} from "@inertiajs/inertia-vue3"
import {computed, onMounted, reactive, ref} from "vue"
import {checkersList} from "@/Composables/useCheckers"
import {keyboardsList} from "@/keyboards"
import Button from "@/Components/Auth/Button.vue"
import FormSwitch from "@/Components/Form/FormSwitch.vue"

let props = defineProps({
	modelValue: {type: Object, required: true},
	hideable: {type: Boolean, default: false}
})

let emits = defineEmits(["update:modelValue", "cancel", "updated", "close"])
let form = useForm({...props.modelValue})
let showEditForm = ref(!props.hideable),
	qcmShow = computed(()=>{
		return form.keyboard.startsWith("qcm")
	}),
	qcmInput = ref(""),
	qcmResult = ref(""),
	qcmUpdate = function(){
		form.keyboard = "qcm@" + qcmInput.value.split("\n")
			.join(",")
	},
	qcmFocus = function(){
		let options = form.keyboard.split("@")[1]

		if(options){
			qcmInput.value = options.split(",").join("\n")
		}
	},
	qcmRows = computed(()=>qcmInput.value.split("\n").length+1),
	qcmButtons = computed(()=>{
		return qcmInput.value.split("\n").map(btn=>{
			let [value, display] = btn.split("|"),
				ascii = display?display.startsWith("#"):false

			if(display){
				return {
					value,
					display: ascii?display.substring(1):display,
					ascii
				}
			}else{
				return {
					value,
					display: value,
					ascii: false
				}
			}
		})
	})

let studyShow = computed(()=>{
		return form.keyboard.startsWith("#Study")
	}),
	studyValues = reactive({
		"ah": {selected: false, display: "AH"},
		"av": {selected: false, display: "AV"},
		"ao": {selected: false, display: "AO"},
		"p": {selected: false, display: "point"},
		"o": {selected: false, display: "ordonnée"},
		"z": {selected: false, display: "zéro"},
		"t": {selected: false, display: "trou"},
		"e": {selected: false, display: "extremum"},
		"hide": {selected: false, display: "sans graphique"},
		"raw": {selected: false, display: "raw"}
	}),
	studyUpdate = function(){
		let params = []
		for (let key in studyValues) {
			if(studyValues[key].selected){
				params.push(key)
			}
		}
		form.keyboard = "#Study@" + params.join(",")
	},
	studyFocus = function() {
		if (form.keyboard.startsWith("#Study@")) {
			let params = form.keyboard.split("#Study@")[1].split(",")
			for (let key of params) {
				if (studyValues[key]) {
					studyValues[key].selected = true
				}
			}
		}
	}
onMounted(()=>{
	if(qcmShow.value){qcmFocus()}
	if(studyShow.value){studyFocus()}
})

function cancelQuestion(){
	emits("cancel")
	emits("close")
	showEditForm.value = false
}
function patchQuestion(ev) {
	axios.post(
		route("questions.update", [props.modelValue.id]),
		{
			_method: "patch",
			...form.data()
		}
	).then(res => {
		emits("update:modelValue", res.data.data)
		emits("updated")
		emits("close")
		showEditForm.value = false
	})
}


</script>
