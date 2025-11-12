<!--
Formulaire d'édition d'un post
Utilisé dans PoseShow et PostEditPage (pour l'édition mode développement ?)
-->
<script
	lang="ts"
	setup
>
import FormMaker from "@/Components/Form/FormMaker.vue"
import MoveItemTo from "@/Components/MoveItemTo.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type {PostShowInterface} from "@/types/modelInterfaces"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {PropType, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

defineOptions({layout: LayoutMain})

const props = defineProps({
	post: {type: Object as PropType<PostShowInterface>, required: true}
})

const flash = useStoreFlashMessage()

const thePost = ref(props.post)
if (thePost.value.type === null) thePost.value.type = ""

const typeList = ref({
	article: "",
	exercice: "exercise",
	"savoir faire": "howto",
	"quizz": "quizz",
	"évaluation": "test"
})


const savePost = function () {
	axios
		.post(route("api.admin.posts.update", [props.post.id]), {
			...thePost.value,
			_method: "patch"
		})
		.then(() => {
			flash.success("Post enregistré")
		})
}
const deletePost = function () {
	const chapter_id = props.post.chapter_id
	axios
		.post(route("api.admin.posts.destroy", [props.post.id]), {
			_method: "delete"
		})
		.then(() => {
			flash.success("Post supprimé")
			router.visit(route('chapters.show', chapter_id))
		})
}


</script>
<template>
	<article class="scolcours-container my-5">
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
			</div>

			<div class="flex gap-3 justify-end items-baseline">
				<sc-button
					type="primary"
					xs
					@click="savePost"
				>
					enregistrer
				</sc-button>
				<sc-button
					:href="route('posts.show', [props.post.id])"
					xs
				>
					retour au post
				</sc-button>
				<confirm-button
					xs
					@confirm="deletePost"
				>
					supprimer
				</confirm-button>
			</div>
		</header>

		<div class="w-full flex justify-between">
			<move-item-to
				:source-id="props.post.id"
				source="post"
				target="chapter"
			/>

			<div class="flex flex-col gap-2">
				<form-maker
					v-model="thePost.active"
					label="publié,brouillon"
					sm
					type="switch"
				/>

				<form-maker
					v-model="thePost.revise"
					label="à réviser,en ordre"
					sm
					type="switch"
				/>
			</div>
		</div>
		<div>
			<form-maker
				v-model="thePost.title"
				focus
				label="Titre"
				name="title"
				@enter="savePost"
			/>

			<div class="flex gap-3 my-3">
				<sc-button
					v-for="(key, name) of typeList"
					:key="'btn-' + name"
					:outline="thePost.type!==key"
					theme
					xs
					@click="thePost.type = key"
				>
					{{ name }}
				</sc-button>
			</div>

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
