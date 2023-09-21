<!--
Affichage d'un post avec toutes les config activées
Principalement la couche utilisée dans ChapterSlide.
-->
<template>
	<section class="bg-white border border-gray-200 rounded shadow py-5" :id="`post-${props.post.id}`">
		<!-- Title of the post -->
		<div
			class="px-5 border-b border-gray-200 pb-5 flex flex-col gap-3 lg:flex-row justify-between"
		>
			<h2 class="text-lg md:text-xl xl:text-2xl">
				<span v-katex.auto="thePost.title" />

				<button
					v-show="editMode.enabled.value"
					v-admin
					class="text-xs ml-3"
					@click="showEditForm = true"
				>
					<i class="bi bi-pencil mr-2" /> {{ thePost.id }}
				</button>
			</h2>
			<div class="self-end flex w-full gap-3 lg:w-auto justify-between">
				<Link
					v-if="props.isolate"
					:href="
						route('theme.chapter.slide', [
							$page.props.theme.slug,
							props.chapter.slug,
							thePost.order,
						])
					"
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
		<div class="mt-5">
			<draggable
				v-if="thePost.blocks.length"
				v-model="thePost.blocks"
				class="grid grid-cols-1 gap-3 my-5"
				handle=".draggable-handle"
				item-key="id"
				v-bind="{
					animation: 200,
					disabled: !$page.props.auth.can.admin,
				}"
				@end="updateBlocksOrder"
			>
				<template #item="{ element }">
					<block-show
						:key="`block-${element.id}`"
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
		<questions-index
			:class="
				thePost.blocks.length ? 'border-t border-gray-200 mt-5' : ''
			"
			:questions="thePost.questions"
			container-type="Post"
			:container-id="thePost.id"
		/>
	</section>
</template>

<script setup lang="ts">

import {computed, defineAsyncComponent, inject, PropType, provide, ref} from "vue"
import BlockShow from "@/Components/Posts/Blocks/BlockShow.vue"
import {PiMath} from "pimath/esm"
import UiSwitch from "@/Components/Ui/UiSwitch.vue"
import QuestionsIndex from "@/Components/Posts/QuestionsIndex.vue"
import axios from "axios";
import {ChapterInterface, PostInterface} from "@/types/modelInterfaces";
import {editModeInterface, flashInterface} from "@/types";


let emits = defineEmits(["change", "destroy"])
const props = defineProps({
		post: {
			type: Object as PropType<PostInterface>,
			required: true
		},
		chapter: {
			type: Object as PropType<ChapterInterface>,
			required: true
		},
		isolate: {
			type: Boolean,
			default: false
		},
	}),
	thePost = ref({
		...props.post,
		random: 1, // special trick to make random function... functional !
	})


const flash = inject<flashInterface>("flash"),
	editMode = inject<editModeInterface>("editMode")

let showEditForm = ref(false),
	editForm = computed(() => {
		return defineAsyncComponent(() =>
			import("@/Components/Posts/PostForm.vue")
		)
	}),
	updatePost = function (p) {
		thePost.value = p
	},
	updateBlocksOrder = function () {
		axios
			.post(route("posts.updateBlocksOrder", [thePost.value.id]), {
				order: thePost.value.blocks.map((x, index) => {
					return { id: x.id, order: index }
				}),
				_method: "PATCH"
			})
			.then((res) => {
				flash.success("les blocs ont bien été mis à jour !")
			})
			.catch((res) =>
				console.warn(
					"update ordering order: ",
					res.response.data.message
				)
			)
	}

let addBlock = function () {
		axios
			.post(route("posts.blocks.store", [thePost.value.id]))
			.then((res) => {
				// Set the first block in edit mode.
				thePost.value.blocks.push({
					...res.data.data,
					isNew: true,
				})
			})
			.catch((err) => {
				console.error(err)
			})
	},
	destroyBlock = function (destroyId) {
		thePost.value.blocks = thePost.value.blocks.filter(
			(x) => x.id !== destroyId
		)
	}

provide(
	"postData",
	computed(() => {
		// trigger the computed value on button click
		try {
			if (thePost.value.script && thePost.value.random) {
				let F = new Function("PiMath", thePost.value.script)
				return F(PiMath)
			}
		} catch (e) {
			console.warn("Post script generator error", e)
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
				post: post ?? "",
			}
		}
		return { pre: "", post: "" }
	}),
	postSwitch = ref(false)

</script>
