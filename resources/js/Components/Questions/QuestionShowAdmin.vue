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
import ScButton from "@/Components/Ui/scButton.vue"

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
			route("api.admin.questions.updateDisplayIf", {
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

function addIllustration(){
	if(theQuestion.value.block.illustration){
		return
	}

	axios
		.post(
			route("api.admin.blocks.illustrations.store", {block: theQuestion.value.block.id}),
			{}
		)
		.then((res) => {
			router.visit(route("admin.illustrations.edit", [res.data.id]))
			flash.success("une nouvelle illustration a été créée")
		}).catch((res) => {
			console.warn("add illustration: ", res)
		}
	)
}
function deleteIllustration(){
	axios.delete(
		route('api.admin.illustrations.destroy', {illustration: theQuestion.value.block.illustration.id})
	).then(()=>{
		theQuestion.value.block.illustration = null
		flash.success("L'illustration a bien été supprimée.")
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

			<sc-button
				v-if="!theQuestion.block.illustration"
				type="add"
				xs
				outline
				@click="addIllustration"
			>
				<i class="bi bi-image" />
			</sc-button>
			<confirm-button
				v-else
				xs
				@confirm="deleteIllustration"
			>
				<i class="bi bi-image" /> => <i class="bi bi-trash" />
			</confirm-button>

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
