<template>
	<div
		v-if="props.chapter.posts"
		class="my-5"
	>
		<div class="flex justify-between items-baseline">
			<h3 class="uppercase font-extralight mb-2">
				table des matières
			</h3>
			<div
				v-if="$page.props.auth.can.admin"
				class="flex gap-3 items-baseline"
			>
				<form-switch
					v-model="moveMode"
					label="mode déplacement"
					name="move"
					sm
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
				disabled: !($page.props.auth.can.admin) && moveMode,
			}"
			@end="updatePostsOrder"
		>
			<template #item="{element}">
				<div class="flex gap-3">
					<button
						v-if="$page.props.auth.can.admin && moveMode"
						class="draggable-handle text-xs px-1"
					>
						<i class="bi bi-arrows-move" />
					</button>
					<Link
						:class="props.active===element.order?`font-semibold text-scolcours-${$page.props.theme.slug}`:''"
						:href="route('theme.chapter.slide', [$page.props.theme.slug, props.chapter.slug, element.order])"
						class="block text-left hover:pl-5 transition-all duration"
					>
						<i
							:class="{
								'bi bi-calculator': element.type==='exercise',
								'bi bi-text-paragraph': !element.type
							}"
						/>
						<span
							v-katex.auto="element.title"
							class="ml-2"
						/>
					</Link>
				</div>
			</template>
		</draggable>
	</div>
</template>
<script setup>

import {inject, ref} from "vue"
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import {Inertia} from "@inertiajs/inertia"

let props = defineProps({
	chapter: {type: Object, required: true},
	scroll: {type: Boolean, default: false},
	active: {type: Number, default: null}
})

const flash = inject("flash")
let posts = ref(props.chapter.posts),
	moveMode = ref(false),
	updatePostsOrder = function () {
		axios.post(route("chapters.updatePostsOrder", [props.chapter.id]), {
			posts: posts.value.map((post, index) => {
				return {
					id: post.id,
					title: post.title,
					order: index + 1,
				}
			}),
			_method: "PATCH"
		}).then(res => {
			// TODO : flash message !
			flash.add("les posts ont bien été réordré !")
		}).catch(res => console.log("update ordering order: ", res.response.data.message))
	},
	addPost = function () {
		axios.post(
			route("chapters.posts.store", [props.chapter.slug]),
			{
				title: "nouvel article",
			}
		)
			.then(res => {
				Inertia.visit(res.data.redirect)
			})
			.catch(err => console.log(err))
	}

</script>
