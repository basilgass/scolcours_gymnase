<!--
Formulaire d'édition d'un post
Utilisé dans PoseShow et PostEditPage (pour l'édition mode développement ?)
-->
<script lang="ts" setup>
// TODO: make the dialog html modal more user friendly and reactive !
import { inject, PropType, ref } from "vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import MoveItemTo from "@/Components/Posts/MoveItemTo.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type { flashInterface } from "@/types"
import type { PostInterface } from "@/types/modelInterfaces"
import { router } from "@inertiajs/vue3"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	post: { type: Object as PropType<PostInterface>, required: true }
})

const flash = inject<flashInterface>("flash")

const thePost = ref(props.post)
if(thePost.value.type===null) thePost.value.type=""

const typeList = ref({
		article: "",
		exercice: "exercise"
	})

const savePost = function() {
	axios
		.post(route("posts.update", [props.post.id]), {
			...thePost.value,
			_method: "patch"
		})
		.then(() => {
			flash.success("Post enregistré")
		})
}
const deletePost = function() {
	axios
		.post(route("posts.destroy", [props.post.id]), {
			_method: "delete"
		})
		.then((res) => {
			flash.success("Post supprimé")
			router.visit(res.data)
		})
}
</script>
<template>
	<article class="my-5">
		<header class="flex justify-between items-baseline mb-6">
			<div>
				<h1>
					<span class="text-xl md:text-2xl">
						édition d'un post
					</span>
					<span class="text-xs font-code ml-5">
						(id: {{ props.post.id }})
					</span>
				</h1>
				<move-item-to
					:source-id="props.post.id"
					source="post"
					target="chapter"
				/>
			</div>

			<div class="flex gap-3 justify-end">
				<button
					class="btn-primary btn-xs"
					@click="savePost"
				>
					enregistrer
				</button>
				<Link
					:href="route('posts.show', [props.post.id])"
					class="btn-cancel btn-xs"
				>
					retour au post
				</Link>
				<confirm-button
					class="btn-delete btn-xs"
					@confirm="deletePost"
				>
					supprimer
				</confirm-button>
			</div>
		</header>


		<div>
			<form-maker
				v-model="thePost.title"
				focus
				label="Titre"
				name="title"
				@enter="savePost"
			/>

			<div class="flex gap-3 my-3">
				<button
					v-for="(key, name) of typeList"
					:key="'btn-' + name"
					:class="thePost.type === key ? 'btn-primary' : 'btn'"
					class="btn-xs"
					@click="thePost.type = key"
				>
					{{ name }}
				</button>
			</div>

			<form-maker
				v-model="thePost.questionsGrid"
				label="Grille des questions"
			/>

			<div class="flex flex-col">
				<form-maker
					v-model="thePost.script"
					label="script"
					name="script"
					type="textarea"
				/>
				<form-maker
					v-model="thePost.switch"
					label="switch"
					name="switch"
				/>
			</div>
		</div>
	</article>
</template>
