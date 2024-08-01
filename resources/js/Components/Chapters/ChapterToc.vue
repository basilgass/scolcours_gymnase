<!--
Affichage de la table des matières.
-->

<script lang="ts" setup>
import { computed, inject, Ref, ref } from "vue"
import { router } from "@inertiajs/vue3"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import { flashInterface } from "@/types"

const props = defineProps({
	chapter: { type: Object, required: true },
	scroll: { type: Boolean, default: false },
	active: { type: Number, default: null }
})

const flash = inject<flashInterface>("flash")
const editMode = inject<Ref<boolean>>("editMode")

const posts = ref(props.chapter.posts),
	postsFilterCurrent = ref(""),
	postsFilter = function(filter) {
		postsFilterCurrent.value =
			postsFilterCurrent.value === filter ? "" : filter

		if (postsFilterCurrent.value === "") {
			posts.value = props.chapter.posts
		} else {
			moveMode.value = false
			posts.value = props.chapter.posts.filter(
				(x) =>
					x.type ===
					(postsFilterCurrent.value === "theory"
						? null
						: postsFilterCurrent.value)
			)
		}
	},
	moveMode = ref(false),
	updatePostsOrder = function() {
		axios
			.post(route("chapters.updatePostsOrder", [props.chapter.id]), {
				posts: posts.value.map((post, index) => {
					return {
						id: post.id,
						title: post.title,
						order: index + 1
					}
				}),
				_method: "PATCH"
			})
			.then((res) => {
				flash.success("les posts ont bien été réordré !")
				// Post has been updated. Go to then new post
				if (res.data.posts) {
					posts.value = res.data.posts
				}
			})
	},
	addPost = function() {
		axios
			.post(route("chapters.posts.store", [props.chapter.slug]), {
				title: "nouvel article"
			})
			.then((res) => {
				router.visit(res.data.redirect)
			})
			.catch((err) => console.warn(err))
	}

const questionStatus = computed(() => {
	const result = {}
	props.chapter.posts.forEach((p) => {
		result[p.id] =
			p.questions.length > 0
				? p.questions.filter((q) => q.user.result).length === p.questions.length
				: null
	})
	return result
})
</script>
<template>
	<div
		v-if="props.chapter.posts"
		class="my-5"
	>
		<div class="flex justify-between items-baseline">
			<div class="flex gap-3 items-baseline">
				<h3 class="uppercase font-extralight mb-2">
					table des matières
				</h3>
				<button
					:class="
						postsFilterCurrent === 'theory'
							? `text-scolcours-${$page.props.theme.slug}`
							: ''
					"
					@click="postsFilter('theory')"
				>
					<i class="bi bi-text-paragraph" />
				</button>
				<button
					:class="
						postsFilterCurrent === 'exercise'
							? `text-scolcours-${$page.props.theme.slug}`
							: ''
					"
					@click="postsFilter('exercise')"
				>
					<i class="bi bi-calculator" />
				</button>
			</div>
			<div
				v-if="$page.props.auth.can.admin"
				v-show="editMode"
				class="flex gap-3 items-baseline"
			>
				<form-maker
					v-if="postsFilterCurrent === ''"
					v-model="moveMode"
					label="mode déplacement"
					name="move"
					sm
					type="switch"
				/>
				<button
					class="btn-new-inline btn-xs"
					@click="addPost"
				>
					Ajouter un article {{ posts.length + 1 }}
				</button>
			</div>
		</div>

		<draggable
			v-if="posts.length"
			v-model="posts"
			class="columns-1 md:columns-2 lg:columns-3 column-toc gap-8 space-y-4"
			handle=".draggable-handle"
			item-key="id"
			v-bind="{
				animation: 200,
				disabled: !$page.props.auth.can.admin && moveMode,
			}"
			@end="updatePostsOrder"
		>
			<template #item="{ element }">
				<div
					class="flex gap-3"
				>
					<button
						v-if="$page.props.auth.can.admin && moveMode"
						class="draggable-handle text-xs px-1"
					>
						<i class="bi bi-arrows-move" />
					</button>
					<Link
						:class="
							props.active === element.order
								? `font-semibold text-scolcours-${$page.props.theme.slug}`
								: ''
						"
						:href="
							route('themes.chapters.slide', [
								$page.props.theme.slug,
								props.chapter.slug,
								element.order,
							])
						"
						class="block text-left hover:pl-5 transition-all duration flex gap-1"
					>
						<i
							:class="{
								'bi bi-calculator': element.type === 'exercise',
								'bi bi-text-paragraph': !element.type,
							}"
						/>

						<i
							:class="{
								'bi bi-check-circle-fill text-green-500':
									questionStatus[element.id],
								'bi bi-check-circle text-gray-300':
									questionStatus[element.id] === false,
								'bi bi-check-circle text-gray-300 invisible':
									questionStatus[element.id] === null,
							}"
							class="mx-2"
						/>

						<span v-katex.auto="element.title" />

						<span v-if="!element.active">(brouillon)</span>
					</Link>
				</div>
			</template>
		</draggable>
	</div>
</template>
