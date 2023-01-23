<template>
	<section class="bg-white border border-gray-200 rounded shadow py-5">
		<!-- Title of the post -->
		<div class=" px-5 border-b border-gray-200 pb-5 flex flex-col gap-3 lg:flex-row  justify-between">
			<h2 class="text-lg md:text-xl xl:text-2xl">
				<span v-katex.auto="thePost.title" />

				<button
					v-show="editMode.enabled.value"
					v-admin
					class="text-xs ml-3"
					@click="showEditForm=true"
				>
					<i class="bi bi-pencil mr-2" /> {{ thePost.id }}
				</button>
			</h2>
			<div class="self-end flex w-full gap-3 lg:w-auto justify-between">
				<Link
					v-if="props.isolate"
					:href="route('theme.chapter.slide', [$page.props.theme.slug, props.chapter.slug, thePost.order])"
				>
					isoler
				</Link>

				<ui-switch
					v-if="thePost.switch"
					v-model="postSwitch"
					:false-text="postSwitchLabel.pre"
					:true-text="postSwitchLabel.post"
					class="mx-1"
					sm
				/>

				<button
					v-if="thePost.script"
					class="btn btn-xs"
					@click="updatePostData"
				>
					aléatoire
				</button>
			</div>
		</div>

		<!-- Header of the post (configuration, admin, ...) -->
		<div
			v-if="showEditForm"
			v-admin
		>
			<component
				:is="editForm"
				v-model="showEditForm"
				:post="thePost"
				@change="updatePost"
				@destroy="emits('destroy', $event)"
			/>
		</div>
		<!-- Displaying blocks of the post -->
		<div
			class="mt-5"
		>
			<draggable
				v-if="thePost.blocks.length"
				v-model="thePost.blocks"
				class="grid grid-cols-1 gap-3 my-5"
				handle=".draggable-handle"
				item-key="id"
				v-bind="{
					animation: 200,
					disabled: !($page.props.auth.can.admin),
				}"
				@end="updateBlocksOrder"
			>
				<template #item="{element}">
					<block-show
						:key="`post-${thePost.id}-block-${element.id}`"
						:block="element"
						:switch="postSwitch"
						@destroy="destroyBlock"
					/>
				</template>
			</draggable>

			<div
				v-show="editMode.enabled.value"
				v-admin
				class="px-5"
			>
				<button
					class="btn-new"
					@click="addBlock"
				>
					ajouter un bloc
				</button>
			</div>
		</div>

		<!-- post questions -->
		<article>
			<div
				v-if="thePost.questions.length"
				:class="thePost.blocks.length?'border-t border-gray-200 mt-5':''"
				class="flex justify-between px-5 py-5"
			>
				<h3
					class="font-extralight uppercase"
				>
					questions
				</h3>
				<div
					v-show="editMode.enabled.value"
					v-admin
				>
					<button
						class="btn btn-xs"
						@click="resetAnswers"
					>
						réinitialiser les réponses
					</button>
				</div>
			</div>

			<draggable
				v-if="thePost.questions.length"
				v-model="thePost.questions"
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-5"
				handle=".draggable-handle"
				item-key="id"
				v-bind="{
					animation: 200,
					disabled: !($page.props.auth.can.admin),
				}"
				@end="updateQuestionsOrder"
			>
				<template #item="{element}">
					<question-show
						:class="element.css??''"
						:question="element"
						@destroy="destroyQuestion"
						@duplicate="thePost.questions.push($event)"
					/>
				</template>
			</draggable>

			<div
				v-show="editMode.enabled.value"
				v-admin
				class="px-5"
			>
				<button
					class="btn-new mt-10"
					@click="addQuestion"
				>
					ajouter une question
				</button>
			</div>
		</article>
	</section>
</template>

<script setup>
import {computed, defineAsyncComponent, inject, provide, ref} from "vue"
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"
import BlockShow from "@/Components/Posts/Blocks/BlockShow.vue"
import {PiMath} from "pimath/esm"
import UiSwitch from "@/Components/Ui/UiSwitch.vue"

let emits = defineEmits(["change", "destroy"])
let props = defineProps({
		post: {type: Object, required: true},
		chapter: {type: Object, required: true},
		isolate: {type: Boolean, default: false}
	}),
	thePost = ref({
		...props.post,
		random: 1		// special trick to make random function... functional !
	})

const flash = inject("flash"),
	editMode = inject("editMode")

let showEditForm = ref(false),
	editForm = computed(() => {
		return defineAsyncComponent(
			() => import("@/Components/Posts/PostForm.vue")
		)
	}),
	updatePost = function (p) {
		thePost.value = p
	},
	updateBlocksOrder = function () {
		axios.post(route("posts.updateBlocksOrder", [thePost.value.id]), {
			order: thePost.value.blocks.map((x, index) => {
				return {id: x.id, order: index}
			}),
			_method: "PATCH"
		}).then(res => {
			// TODO : flash message !
			flash.add("les blocs ont bien été mis à jour !")
		}).catch(res => console.log("update ordering order: ", res.response.data.message))
	}


let addBlock = function () {
		axios.post(
			route("posts.blocks.store", [thePost.value.id])
		).then(res => {
			// Set the first block in edit mode.
			thePost.value.blocks.push({
				...res.data.data,
				isNew: true
			})
		}).catch(err => {
			console.error(err)
		})
	},
	destroyBlock = function (destroyId) {
		thePost.value.blocks = thePost.value.blocks.filter(x => x.id !== destroyId)
	}

let addQuestion = function () {
		axios.post(
			route("posts.questions.store", [thePost.value.id]), {
				math: false,
				mathAppend: "",
				body: "nouvelle question",
				answer: "-"
			}
		).then((res) => {
			// Add the question.
			thePost.value.questions.push({
				...res.data.data,
				isNew: true
			})
		})
	},
	destroyQuestion = function (destroyId) {
		thePost.value.questions = thePost.value.questions.filter(x => x.id !== destroyId)
	},
	updateQuestionsOrder = function () {
		axios.post(route("questions.updateOrder", [thePost.value.id]), {
			order: thePost.value.questions.map((x, index) => {
				return {id: x.id, order: index + 1}
			}),
			_method: "PATCH"
		}).then(res => {
			// TODO : flash message !
			flash.add("les questions ont bien été mis à jour !")
		}).catch(res => console.log("update questions order failed", res))

	},
	resetAnswers = function () {
		axios
			.patch(route("posts.questions.reset", [thePost.value.id]))
			.then(res => {
				for (let i in thePost.value.questions) {
					thePost.value.questions[i].user.answer = []
					thePost.value.questions[i].user.correct = false
				}
			})
	}

provide("postData",
	computed(() => {
		// trigger the computed value on button click
		try {
			if (thePost.value.script && thePost.value.random) {
				let F = new Function("PiMath", thePost.value.script)
				return F(PiMath)
			}
		} catch (e) {
			console.log("Post script generator error", e)
		}
		return {}
	})
)
let updatePostData = function () {
	thePost.value.random++
}
let postSwitchLabel = computed(() => {
		if (thePost.value.switch) {
			const [pre, post] = thePost.value.switch.split("@")
			return {
				pre,
				post: post ?? ""
			}
		}
		return {pre: "", post: ""}
	}),
	postSwitch = ref(false)


// onMounted(() => {
// 	// Load asynchronously the post
// 	axios.get(route("posts.show", thePost.value.id))
// 		.then((res) => {
// 			thePost.value = res.data.data
// 			thePost.value.random = 1
// 		})
// })
</script>
