<script lang="ts" setup>
import DropdownMenu from "@/Components/Ui/DropdownMenu.vue"
import EditLink from "@/Components/Ui/EditLink.vue"
import type { flashInterface } from "@/types"
import type { QuestionInterface } from "@/types/modelInterfaces.ts"
import { router } from "@inertiajs/vue3"
import axios from "axios"
import { computed, inject, nextTick, PropType, ref } from "vue"

const flash = inject<flashInterface>("flash")

const props = defineProps({
	question: { type: Object as PropType<QuestionInterface>, required: true },
})

const theQuestion = ref(props.question)

const questionsIds = inject<number[]>("questionsIds", [])

const displayIfIds = computed(() => {
	if (props.question.displayIf === null || props.question.displayIf===true) return []

		return (props.question.displayIf as string)
			.split(",")
			.map((id) => +id)
})


const toggleDisplayId = async function(id) {
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

	axios
		.post(
			route("questions.updateDisplayIf", {
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

function duplicateQuestion(){
	axios
		.post(route('questions.duplicate', [props.question.id]))
		.then((res)=>{
			router.visit(route('questions.edit', [res.data.id]))
		})
}
</script>
<template>
	<div
		class="flex items-center justify-between w-full px-3 gap-3 py-2 bg-slate-600 text-white rounded-t"
	>
		<edit-link
			:id="question.id"
			route-name="questions.edit"
			inline
		/>

		<div class="flex gap-2">
			<button
				class="text-xs px-2"
				title="dupliquer"
				@click="duplicateQuestion"
			>
				<i class="bi bi-clipboard-plus" />
			</button>
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
