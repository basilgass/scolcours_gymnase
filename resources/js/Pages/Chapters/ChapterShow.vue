<template>
	<div class="chapter-wrapper">
		<!-- Main title -->
		<chapter-header
			:theme="theme"
			:chapter="chapter.data"
		/>

		<!-- Enable edition mode for the whole chapter -->
		<div
			v-if="$page.props.auth.can.admin"
			class="admin-wrapper"
		>
			<h3 class="text-lg">
				Administration
			</h3>

			<form-switch
				v-model="editMode"
				name="editMode"
				label="mode édition"
				@click="storeEditMode"
			/>
		</div>

		<!-- Header dashboard -->
		<chapter-dashboard :chapter="chapter.data" />

		<!-- Adding all the posts -->
		<section class="space-y-10">
			<!-- Adding formulas as first post. -->
			<chapter-formulas
				v-if="chapter.data.formulas.length>0 || ($page.props.auth.can.admin && editMode)"
				id="chapter-formula"
				:chapter="chapter.data"
			/>

			<div
				v-if="chapterPosts.length>0"
				class="space-y-10"
			>
				<post-show
					v-for="(post, index) in chapterPosts"
					:id="`post-${post.id}`"
					:key="post.id"
					:post="post"
					@delete="deletePost(post.id)"
					@updateTitle="post.title=$event"
				>
					<template
						v-if="chapterPosts.length>1"
						#admin
					>
						<div class="w-full flex justify-between items-baseline flex-col md:flex-row">
							<div>Déplacer l'article</div>
							<div class="flex gap-3">
								<button
									:disabled="index===0"
									class="btn-update btn-xs"
									:class="index===0?'invisible':''"
									@click="movePostUp(index, 0)"
								>
									En premier
								</button>
								<button
									:disabled="index===0"
									:class="index===0?'invisible':''"
									class="btn-update btn-xs"
									@click="movePostUp(index, index-1)"
								>
									Monter
								</button>
								<button
									:disabled="index===chapterPosts.length-1"
									class="btn-update btn-xs"
									:class="index===chapterPosts.length-1?'invisible':''"
									@click="movePostUp(index, index+1)"
								>
									Descendre
								</button>
								<button
									:disabled="index===chapterPosts.length-1"
									class="btn-update btn-xs"
									:class="index===chapterPosts.length-1?'invisible':''"
									@click="movePostUp(index, chapterPosts.length)"
								>
									En dernier
								</button>
							</div>
						</div>
					</template>
				</post-show>
			</div>
		</section>

		<!-- chapter footer -->
		<div class="mt-10 text-center space-y-8">
			<div v-if="chapterPosts.length===0">
				Aucun article - que c'est triste
			</div>

			<button
				v-if="$page.props.auth.can.admin && editMode"
				class="btn-primary"
				@click="createPost"
			>
				Créer un article
			</button>
		</div>
	</div>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>

import ChapterFormulas from "@/Components/Ui/Chapters/Formulas/ChapterFormulas"
import {provide, ref, computed} from "vue"
import ChapterHeader from "@/Components/Ui/Chapters/ChapterHeader"
import PostShow from "@/Components/Posts/PostShow"
import FormSwitch from "@/Components/Form/FormSwitch"
import ChapterDashboard from "@/Components/Ui/Chapters/ChapterDashboard"

const props = defineProps({
	theme: {
		type: Object, default: () => {
		}
	},
	chapter: {
		type: Object, default: () => {
		}
	},
	edit: {
		type: Boolean, default: false
	}
})

let chapterPosts = ref(props.chapter.data.posts),
	editMode = ref(localStorage.getItem("ScolCoursEditMode")==="1")

provide("editmode", editMode)
provide("chapterPosts", chapterPosts)

function storeEditMode(){
	localStorage.setItem("ScolCoursEditMode", editMode.value?"1":"0")
}

function createPost() {
	axios.post(
		route("chapters.posts.store", [props.chapter.data.slug]),
		{
			title: "no title",
		}
	)
		.then(res => {
			const post = res.data.data
			post.isNew = true
			chapterPosts.value.push(post)
		})
		.catch(err => console.log(err))
}

function deletePost(id) {
	// Remove the post from the list.
	chapterPosts.value = chapterPosts.value.filter(post => post.id !== id)
}

function movePostUp(crtIndex, targetIndex) {
	chapterPosts.value.splice(targetIndex, 0, chapterPosts.value.splice(crtIndex,1)[0])

	// Save the new position to the database
	axios.post(route("chapters.updatePostsOrder", [props.chapter.data.id]), {
		_method: "patch",
		data: chapterPosts.value.map((post, index)=>{return {"id": post.id, "order": index}})
	})
}
</script>
