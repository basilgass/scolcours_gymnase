<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import { advancedKeyboards, keyboards } from "@/Composables/keyboardConfig.ts"
import { useKeyboard } from "@/Composables/useKeyboard.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { QuestionInterface } from "@/types/modelInterfaces.ts"
import { computed, ref, unref, watch } from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

defineOptions({ layout: LayoutMain })

const question = ref<QuestionInterface>({
	answer: "3/7",
	block: {
		id: -1,
		title: "DEV",
		body: "\\($a\\)",
		illustration: null
	},
	css: null,
	displayIf: null,
	id: undefined,
	keyboard: "exact",
	order: 1,
	user: {
		answer: "",
		result: false,
		update_at: ""
	}
})

const kbrds = computed(() => {
		return useKeyboard().getKeyboards(unref(question.value.keyboard))
	}),
	kbrdId = ref(0),
	kbrdFormat = computed(() => {
		if (kbrds.value === null) {
			return "format non reconnu"
		}

		if (kbrds.value[kbrdId.value] === undefined) {
			return "ce clavier n'existe pas..."
		}

		return kbrds.value[kbrdId.value].checker.checker.format

	}),
	kbrdsJson = computed(() => {
		return JSON.stringify(kbrds.value, null, "\t")
	})


watch(question.value, () => {
	switch (question.value.keyboard) {
		case "algebra":
			question.value.answer = "7sqrt2x^3"
			break
		case "coord":
			question.value.answer = "(3;4)"
			break
		case "equation":
			question.value.answer = "3x+2=0"
			break
		case "cartesian":
			question.value.answer = "y=2/3x-1"
			break
		case "exact":
			question.value.answer = "3+sqrt(5)"
			break
		case "fraction":
			question.value.answer = "3/5"
			break
		case "function":
			question.value.answer = "3x-2"
			break
		case "limit":
			question.value.answer = "oo"
			break
		case "number":
			question.value.answer = "5"
			break
		case "polynom":
			question.value.answer = "3x+1"
			break
		case "pow":
			question.value.answer = "7^8"
			break
		case "primitive":
			question.value.answer = "x^2+c"
			break
		case "rational":
			question.value.answer = "3x-1/x+2"
			break
		case "scientific":
			question.value.answer = "3.5*10^3"
			break
		case "simple":
			question.value.answer = "12"
			break
		case "solution":
			question.value.answer = "{3;7}"
			break
		case "vector":
			question.value.answer = "(3;4)"
			break
	}
})


const message = ref("")
function validate(evt) {
	if (evt.result) {
		message.value = "OK"
		return
	}

	message.value = "FALSE"
}

</script>
<template>
	<!-- Title -->
	<div
		ref="root"
		class="scolcours-container grid grid-cols-2 gap-3"
	>
		<div>
			<sc-button theme="algebre">
				HELLO WORLD
			</sc-button>
		</div>
		<div>
			<form-maker
				v-model="question.keyboard"
				sm
				type="select"
			>
				<option
					v-for="(value, key) in keyboards"
					:key="key"
					:value="key"
				>
					{{ value.name }}
				</option>
			</form-maker>
			<form-maker
				v-model="question.keyboard"
				sm
				type="select"
			>
				<option
					v-for="(value, key) in advancedKeyboards"
					:key="key"
					:value="key"
				>
					{{ value.name }}
				</option>
			</form-maker>
			<form-maker
				v-model="question.keyboard"
				:rows="3"
				label="claviers"
				name="keyboard"
				type="textarea"
			/>

			<div
				v-katex.auto="kbrdFormat"
				class="code h-16 text-sm"
			/>

			<form-maker
				v-model="kbrdsJson"
				:rows="20"
				language="json"
				type="codearea"
			/>
		</div>
		<div>
			<div class="mb-5">
				<form-maker
					v-model="question.block.body"
					:rows="3"
					label="Body"
					sm
					type="textarea"
				/>
				<form-maker
					v-model="question.answer"
					:label="`answer ${message}`"
					sm
					type="text"
				/>
			</div>

			<question-show
				:question
				is-dynamic
				is-minimal
				show-input
				@validate="validate"
			/>
		</div>
	</div>
</template>

