<script
	lang="ts"
	setup
>
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {ChapterShowInterface, PostInterface} from "@/types/modelInterfaces.ts"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {computed, ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import PostTypeIcon from "@/Components/Posts/PostTypeIcon.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const props = defineProps<{
	chapter: ChapterShowInterface,      // id, slug, posts
	posts: PostInterface[],
	active?: number                 // Highlight the currently selected post.
	vertical?: boolean
}>()

const flash = useStoreFlashMessage()
const editMode = useStoreEditMode()

const posts = ref(props.posts)
const postsFilterCurrent = ref("")
const postsFilterCurrentMessage = ref("")

const postsFilter = function (filter: string) {
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

	switch (postsFilterCurrent.value) {
		case 'theory':
			postsFilterCurrentMessage.value = 'théorie'
			return
		case 'exercise':
			postsFilterCurrentMessage.value = 'exercices'
			return
	}

}
const moveMode = ref(false)
const updatePostsOrder = function () {
	axios
		.post(route("api.admin.chapters.posts.order", [props.chapter.id]), {
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

const addPost = function () {
	axios
		.post(route("api.admin.posts.store"), {
			title: "nouvel article",
			chapter_id: props.chapter.id
		})
		.then((res) => {
			router.visit(route("admin.posts.edit", {post: res.data.id}))
		})
		.catch((err) => console.warn(err))
}

// Determine si le post à des questions et si toutes les questions on été répondues
// null: pas de questions
// number: pourcentage des questions répondues (0 à 1)
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

const postTypes: Record<string, {
	label: string,
	icon: string,
	title: string,
	active: boolean
}> = {
	theory: {
		label: 'théorie',
		icon: 'bi bi-book',
		title: 'afficher la théorie',
		active: props.posts.some(post => post.type === null)
	},
	exercise: {
		label: 'exercices',
		icon: 'bi bi-journal',
		title: 'afficher les exercices',
		active: props.posts.some(post => post.type === 'exercise')
	},
	howto: {
		label: 'savoir faire',
		icon: 'bi bi-card-checklist',
		title: 'afficher les savoirs faire',
		active: props.posts.some(post => post.type === 'howto')
	},
	en_cours: {
		label: 'en cours',
		icon: 'bi bi-check-circle',
		title: 'afficher les exercices non terminés',
		active: true
	}
}

const availablePostTypes = computed(() => {
	return Object.fromEntries(
		Object.entries(postTypes).filter(([, v]) => v.active)
	)
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
					v-for="(el, key) in availablePostTypes"
					:key="`filter-${key}`"
					v-theme.text="postsFilterCurrent===key"
					:title="el.title"
					@click="postsFilter(key as string)"
				>
					<i :class="el.icon" />
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
				<FormSwitch
					v-model="moveMode"
					:disabled="postsFilterCurrent !== ''"
					label="mode déplacement"
					name="move"
					sm
				/>
				<sc-button
					type="add"
					xs
					@click="addPost"
				>
					Ajouter un article {{ posts.length + 1 }}
				</sc-button>
			</div>
		</div>

		<draggable
			v-if="posts.length"
			v-model="posts"
			:class="vertical?'':'md:columns-2 lg:columns-3'"
			class="columns-1 column-toc gap-8 space-y-4"
			handle=".draggable-handle"
			item-key="id"
			v-bind="{
				animation: 200,
				disabled: !$page.props.auth.can.admin && moveMode,
			}"
			@end="updatePostsOrder"
		>
			<template #item="{ element }: { element: PostInterface }">
				<div
					class="flex gap-3"
					:class="{
						'opacity-30': !element.active,
						'text-red-500' : element.revise && $page.props.auth.can.admin
					}"
				>
					<button
						v-if="$page.props.auth.can.admin && moveMode"
						class="draggable-handle text-xs px-1"
					>
						<i class="bi bi-arrows-move" />
					</button>

					<InertiaLink
						:class="[
							props.active === element.id
								? `font-semibold text-${$page.props.theme.slug}-500`
								: '',
							'text-left hover:pl-1 transition-all duration flex gap-1'
						]
						"
						:href="route('themes.chapters.posts.show', [
							$page.props.theme.slug,
							props.chapter.slug,
							element.order,
						])
						"
					>
						<post-type-icon
							:post="element"
							class="opacity-50"
						/>

						<i
							:class="{
								'bi bi-check-circle-fill text-green-500':
									questionStatus[element.id] === 1,
								'bi bi-check-circle text-green-600':
									questionStatus[element.id] < 1 && questionStatus[element.id] > 0,
								'bi bi-check-circle text-orange-400 opacity-50':
									questionStatus[element.id] === 0,
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
