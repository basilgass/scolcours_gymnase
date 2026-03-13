<script lang="ts" setup>
import DropdownMenu from "@/Components/Ui/DropdownMenu.vue"
import EditLink from "@/Components/Ui/EditLink.vue"
import type {AxiosErrorMessage} from "@/types"
import type {QuestionInterface} from "@/types/modelInterfaces.ts"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {computed, nextTick, ref} from "vue"
import MoveItemTo from "@/Components/MoveItemTo.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"

const flash = useStoreFlashMessage()
const props = defineProps<{
	question: QuestionInterface,
	questions: Partial<QuestionInterface>[]
}>()

const emits = defineEmits<{
	removed: []
}>()

const questionsIds = computed(() => props.questions.map((q) => q.id))

const theQuestion = ref(props.question)

const displayIfIds = computed(() => {
	if (props.question.displayIf === null || props.question.displayIf === "") return []

	return (props.question.displayIf as string)
		.split(",")
		.map((id) => +id)
})

const toggleDisplayId = async function (id) {
	if (id === -1) {
		theQuestion.value.displayIf = null
	} else {
		await nextTick()
		const ids = [...displayIfIds.value],
			idx = ids.indexOf(id)

		if (idx === -1) {
			ids.push(id)
			ids.sort()
		} else {
			ids.splice(idx, 1)
		}

		theQuestion.value.displayIf = ids.length === 0 ? null : ids.join(",")
	}

	// Update to DB
	axios
		.post(
			route("api.admin.questions.displayIf", {
				question: theQuestion.value.id
			}),
			{
				_method: "PATCH",
				displayIf: theQuestion.value.displayIf
			}
		)
		.then(() => {
			flash.success(
				"Modification de la condition d'apparition réussi"
			)
		})
		.catch(() => {
			flash.error("Modification de la condition échouée.")
		})
}

function duplicateQuestion() {
	axios
		.post(route('api.admin.questions.duplicate', [props.question.id]))
		.then((res) => {
			router.visit(route('admin.questions.edit', [res.data.id]))
		})
}

function deleteQuestion() {
	axios
		.delete(route("api.admin.questions.destroy", {question: props.question.id}))
		.then(() => {
			flash.success("la question a été supprimée")
			emits('removed')
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err)
		})
}

</script>

<template>
	<div
		class="flex flex-col md:flex-row md:items-center justify-between w-full px-3 gap-3 py-2 admin-content rounded-t"
	>
		<div class="flex gap-2 items-start">
			<edit-link
				:label="question.id"
				:href="route('admin.questions.edit', {id: question.id})"
				inline
			/>
			<move-item-to
				:source-id="question.id"
				source="question"
				target="post"
				@moved="emits('removed')"
			/>

			<confirm-button
				xs
				@confirm="deleteQuestion"
			>
				<i class="bi bi-trash" />
			</confirm-button>
		</div>

		<div class="flex gap-2">
			<sc-button
				type="add"
				xs
				outline
				title="dupliquer"
				@click="duplicateQuestion"
			>
				<i class="bi bi-clipboard-plus" />
			</sc-button>
			<dropdown-menu prevent-close>
				<template #button>
					<i class="bi bi-eye" />
					{{ question.displayIf }}
				</template>

				<div
					v-for="q in questionsIds"
					:key="`display-if-${q}`"
					class="hover:bg-gray-100 px-3 py-2 font-code"
				>
					<div v-if="q === question.id">
						- question courante -
					</div>
					<div v-else>
						<label class="block cursor-pointer">
							<input
								:checked="displayIfIds.includes(q)"
								type="checkbox"
								@input="toggleDisplayId(q)"
							>
							{{ q }}</label>
					</div>
				</div>

				<template #footer>
					<button
						class="px-3 py-2"
						@click="toggleDisplayId(-1)"
					>
						toujours
					</button>
				</template>
			</dropdown-menu>
		</div>
	</div>
</template>
