<script lang="ts" setup>
/**
 * Zone clavier : format de réponse, toggle, sélecteur de réponse, validation, clavier dynamique.
 * Absorbe : QuestionAnswerToggleKeyboard, QuestionAnswerSelector, QuestionAnswerValidation.
 */
import {computed, inject, nextTick, ref, useTemplateRef} from "vue"
import {
	keyboardComponentType,
	questionDataKey,
	questionResultInterface,
	questionUserInputDisplayType
} from "@/Components/Questions/QuestionInterface.ts"
import type {KeyboardInputInterface} from "@/types/keyboardInterfaces.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {useQuestionValidation} from "@/Components/Questions/useQuestionValidation.ts"
import {useWrongAnswerAnimation} from "@/Composables/useHelpers.ts"

const questionData = inject(questionDataKey)!

defineEmits<{
	validate: [event: questionResultInterface]
}>()

// ── Keyboard refs (exposé pour QuestionShow.loadAnswers) ──────────────────────

const keyboardComponentsRefs = useTemplateRef<keyboardComponentType[]>('keyboardComponent')

defineExpose({
	getKeyboards(): Record<number, keyboardComponentType> {
		const obj: Record<number, keyboardComponentType> = {}
		keyboardComponentsRefs.value.forEach(kbrd => {
			const index = +kbrd.$el.getAttribute('data-index')
			obj[index] = kbrd
		})
		return obj
	}
})

// ── Toggle keyboard ───────────────────────────────────────────────────────────

function toggleKeyboard(value: questionUserInputDisplayType) {
	questionData.config.showInput.value = value
}

// ── Answer selector ───────────────────────────────────────────────────────────

const totalAnswers = computed(() => questionData.answers.values.value.length ?? 0)
const currentId = computed({
	get: () => questionData.current.id.value ?? 0,
	set: (v: number) => { questionData.current.id.value = v }
})
const isFirst = computed(() => currentId.value === 0)
const isLast = computed(() => currentId.value === totalAnswers.value - 1)

// ── Answer format ─────────────────────────────────────────────────────────────

const answerFormat = computed(() => {
	if (!questionData.current.keyboard) return ""

	if (questionData.current.keyboard.value.name === "Basic") {
		const customOutput = questionData.current.keyboard.value.parameters
			.filter((x) => x.startsWith("format:"))
			.map((x) => x.split("format:")[1])[0]

		return customOutput ?? questionData.current.checker.value.checker.format
	}

	return questionData.current.checker.value.checker.format
})

function updateQuestion(event: KeyboardInputInterface, index: number) {
	questionData.user.answers.value[index] = event
}

const keyboardParameters = computed(() => {
	if (!questionData.config.editorMode) return ""
	if (questionData.current.keyboard.value.name === '') return ''
	if (!keyboardComponentsRefs.value) return ""
	const id = questionData.current.id.value
	return keyboardComponentsRefs.value[id].parameters
})

// ── Validation ────────────────────────────────────────────────────────────────

const validateButtonRef = useTemplateRef<InstanceType<typeof ScButton>>('validateButton')
const useValidation = useQuestionValidation(questionData)

function onValidate() {
	useValidation.validate(validateButtonRef.value?.$el)

	if (
		!useValidation.result.value.result &&
		questionData.config.animation &&
		!questionData.config.silent
	) {
		useWrongAnswerAnimation(validateButtonRef.value?.$el)
	}
}

const answerIntegrityCheck = computed(() => {
	const id = questionData.current.id.value
	const checker = questionData.validators.value[id].checker.checker.checker
	const answer = questionData.validators.value[id].answer
	const integrity = checker.checkFormat(answer)
	return integrity === '' ? true : integrity
})

const closeErrors = ref(false)
const showErrors = computed(() => !closeErrors.value && useValidation.errors.value.length > 0)

function closingErrors() {
	closeErrors.value = true
	nextTick(() => {
		useValidation.errors.value = []
		closeErrors.value = false
	})
}
</script>

<template>
	<div class="question-keyboard-wrapper">
		<!-- Answer format -->
		<div
			v-katex.auto="answerFormat"
			class="text-center text-xs text-gray-500 my-2"
		/>

		<!-- Toggle keyboard -->
		<div
			v-if="questionData.config.showInput.value!=='force'"
			class="text-right text-sm py-3 px-3"
		>
			<sc-button
				v-if="questionData.config.showInput.value==='hide'"
				class="flex gap-2 justify-center items-center mx-auto px-2 py-2 rounded-xl shadow hover:shadow-none w-full"
				theme
				@click="toggleKeyboard('show')"
			>
				<i class="text-xl bi bi-calculator" /><span class="hidden md:inline-block"> donner la réponse</span>
			</sc-button>
			<button
				v-else
				class="px-5 group text-red-600"
				@click="toggleKeyboard('hide')"
			>
				fermer
				<i
					class="bi bi-x-lg inline-block ml-2 group-hover:rotate-180 transition-all transform duration-500 ease-in-out"
				/>
			</button>
		</div>

		<div
			v-show="questionData.config.showInput.value!=='hide'"
			class="px-3"
		>
			<!-- Answer selector -->
			<div
				v-if="totalAnswers>1"
				class="question-answer-selector flex justify-between items-center my-5"
			>
				<div class="w-15">
					<transition name="btn-pop">
						<button
							v-if="!isFirst"
							v-theme.bg.text
							class="w-15 px-3 py-1 grid place-items-center text-xl rounded-full cursor-pointer"
							@click="currentId--"
						>
							<i class="bi-chevron-left" />
						</button>
					</transition>
				</div>
				<div
					class="text-center text-xs text-gray-400 flex-1"
					v-text="`Réponse ${currentId+1} / ${totalAnswers}`"
				/>
				<div class="w-15">
					<transition name="btn-pop">
						<button
							v-if="!isLast"
							v-theme.bg.text
							class="w-15 px-3 py-1 grid place-items-center text-xl rounded-full cursor-pointer"
							@click="currentId++"
						>
							<i class="bi-chevron-right" />
						</button>
					</transition>
				</div>
			</div>

			<!-- Validation button -->
			<suspense>
				<div class="question-validation-wrapper">
					<div class="max-w-xl mx-auto keyboard mb-5">
						<sc-button
							ref="validateButton"
							:class="{ 'cursor-not-allowed': useValidation.lock.value }"
							:disabled="useValidation.lock.value || useValidation.answersCount.value===0"
							class="key-cmd w-full"
							theme
							@click="onValidate"
						>
							<p v-if="useValidation.lock.value">
								{{ useValidation.buttonLabel }}
							</p>
							<p
								v-else-if="useValidation.answersCount.value===0"
								class="font-extralight"
							>
								Entrer une réponse...
							</p>
							<p v-else-if="useValidation.answersCount.value<useValidation.count">
								{{ useValidation.answersCount.value }} réponse(s) sur {{ questionData.answers.values.value.length }}
							</p>
							<p v-else>
								<i class="bi bi-check" /> <span class="hidden md:inline md:ml-2">Valider</span>
							</p>
						</sc-button>
					</div>

					<!-- Error messages -->
					<transition
						name="fade"
						@after-leave="closingErrors()"
					>
						<div
							v-if="showErrors"
							class="max-w-xl mx-auto p-3 my-2 border rounded relative
							text-red-600 dark:text-red-100
							bg-red-100 dark:bg-red-900
							border-red-600 dark:border-red-700"
						>
							<button
								class="absolute top-1 right-1 text-xs"
								@click="closeErrors = true"
							>
								<i class="bi bi-x-lg" />
							</button>
							<div
								v-for="(msg, index) in useValidation.errors.value"
								:key="`error-${index}`"
								v-katex.auto="msg"
								class="text-xs"
							/>
						</div>
					</transition>

					<div
						v-if="answerIntegrityCheck!==true"
						v-katex.auto="answerIntegrityCheck"
						class="p-3 my-2 border rounded
						text-red-600 dark:text-red-100
						bg-red-100 dark:bg-red-900
						border-red-600 dark:border-red-700"
					/>
				</div>
			</suspense>

			<!-- Dynamic keyboard component -->
			<component
				:is="validator.keyboard.component"
				v-for="(validator, index) in questionData.validators.value"
				v-show="questionData.current.id.value === index"
				:key="`keyboard-id-${index}`"
				ref="keyboardComponent"
				:data-index="index"
				:keyboard="validator.keyboard"
				:reference="validator.answer"
				class="touch-manipulation"
				@change="updateQuestion($event, index)"
			/>

			<div
				v-if="questionData.config.editorMode && keyboardComponentsRefs"
				class="fixed left-2 bottom-2 w-[60vw] md:w-[40vw] lg:w-[30vw] z-10"
			>
				<pre class="font-code text-[12px]! mt-5 bg-gray-200 border border-gray-300 p-3 shadow-sm rounded-sm">{{ keyboardParameters }}</pre>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
