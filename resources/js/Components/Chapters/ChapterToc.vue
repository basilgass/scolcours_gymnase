<script
	lang="ts"
	setup
>
import FormMaker from "@/Components/Form/FormMaker.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {flashInterface} from "@/types"
import {ChapterShowInterface, PostInterface} from "@/types/modelInterfaces.ts"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {computed, inject, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

const props = defineProps<{
	chapter: ChapterShowInterface,      // id, slug, posts
	posts: PostInterface[],
	active?: number                 // Highlight the currently selected post.
	vertical?: boolean
}>()

const flash = inject<flashInterface>("flash")
const editMode = useStoreEditMode()

const posts = ref(props.posts)
const postsFilterCurrent = ref("")
const postsFilterCurrentMessage = ref("")

const postsFilter = function(filter: string) {
	// Same filter ? remove the filter
	postsFilterCurrent.value =
		postsFilterCurrent.value === filter ? "" : filter


	// Si le filtre est vide, on affiche tout.
	if (postsFilterCurrent.value === "") {
		posts.value = props.posts
		postsFilterCurrentMessage.value = ""
		return
	}

	// On désactive le move mode
	moveMode.value = false
	if (filter === "en_cours") {
		posts.value = props.posts.filter(
			(post) =>
				questionStatus.value[post.id] !== null &&
				questionStatus.value[post.id] < 1
		)
		postsFilterCurrentMessage.value = "exercices non terminés"
		return
	}

	posts.value = props.posts.filter(
		(post) =>
			post.type === (postsFilterCurrent.value === "theory" ? null : postsFilterCurrent.value)
	)

	switch (postsFilterCurrent.value){
		case 'theory':
			postsFilterCurrentMessage.value = 'théorie'
			return
		case 'exercise':
			postsFilterCurrentMessage.value = 'exercices'
			return
	}

}
const moveMode = ref(false)
const updatePostsOrder = function() {
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
}

const addPost = function() {
	axios
		.post(route("chapters.posts.store", [props.chapter.slug]), {
			title: "nouvel article"
		})
		.then((res) => {
			router.visit(route("posts.edit", {post: res.data.post.id}))
		})
		.catch((err) => console.warn(err))
}

// Determine si le post à des questions et si toutes les questions on été répondues
// null: pas de questions
// number: pourcentage des questions répondues (0 à 1)
// TODO: rendre le visuel de l'avancée des questions plus mieux bien.
const questionStatus = computed<Record<number, number | null>>(() => {
	const result = {}
	props.posts.forEach((p) => {
		result[p.id] =
			p.questionsInfo.count > 0
				? p.questionsInfo.answered / p.questionsInfo.count
				: null
	})
	return result
})
</script>

<template>
	<div v-if="props.posts">
		<div class="flex justify-between items-baseline">
			<div class="flex gap-3 items-baseline">
				<h3 class="uppercase font-extralight mb-5">
					table des matières
				</h3>

				<button
					:class="postsFilterCurrent === 'theory'
						? `text-${$page.props.theme.slug}-500`
						: ''
					"
					@click="postsFilter('theory')"
				>
					<i class="bi bi-text-paragraph" />
				</button>
				<button
					:class="postsFilterCurrent === 'exercise'
						? `text-${$page.props.theme.slug}-500`
						: ''
					"
					@click="postsFilter('exercise')"
				>
					<i class="bi bi-calculator" />
				</button>
				<button
					:class="postsFilterCurrent === 'en_cours'
						? `text-${$page.props.theme.slug}-500`
						: ''
					"
					@click="postsFilter('en_cours')"
				>
					<i class="bi bi-check-circle" />
				</button>

				<div class="text-sm font-extralight">
					{{ postsFilterCurrentMessage }}
				</div>
			</div>
			<div
				v-if="$page.props.auth.can.admin"
				v-show="editMode.enable"
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
				<sc-button
					xs
					type="add"
					@click="addPost"
				>
					Ajouter un article {{ posts.length + 1 }}
				</sc-button>
			</div>
		</div>

		<draggable
			v-if="posts.length"
			v-model="posts"
			class="columns-1 column-toc gap-8 space-y-4"
			:class="vertical?'':'md:columns-2 lg:columns-3'"
			handle=".draggable-handle"
			item-key="id"
			v-bind="{
				animation: 200,
				disabled: !$page.props.auth.can.admin && moveMode,
			}"
			@end="updatePostsOrder"
		>
			<template #item="{ element }: { element: PostInterface }">
				<div class="flex gap-3">
					<button
						v-if="$page.props.auth.can.admin && moveMode"
						class="draggable-handle text-xs px-1"
					>
						<i class="bi bi-arrows-move" />
					</button>

					<InertiaLink
						:class="props.active === element.order
							? `font-semibold text-${$page.props.theme.slug}-500`
							: ''
						"
						:href="route('themes.chapters.slide', [
							$page.props.theme.slug,
							props.chapter.slug,
							element.order,
						])
						"
						class="text-left hover:pl-1 transition-all duration flex gap-1"
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
									questionStatus[element.id] === 1,
								'bi bi-check-circle text-green-600':
									questionStatus[element.id] < 1,
								'invisible':
									questionStatus[element.id] === null,
							}"
							class="mx-1"
						/>

						<span v-katex.auto="element.title" />

						<span v-if="!element.active">(brouillon)</span>
					</InertiaLink>
				</div>
			</template>
		</draggable>
	</div>
</template>
