<template>
	<div class="chapter-wrapper">
		<!-- Main title -->
		<chapter-header
			:chapter="chapter.data"
			:theme="theme"
		/>

		<!-- Enable edition mode for the whole chapter -->
		<div
			v-if="$page.props.auth.can.admin"
			class="admin-wrapper flex-col"
		>
			<div class="admin-wrapper-row">
				<h3 class="text-lg">
					Administration
				</h3>

				<form-switch
					v-model="editMode"
					label="mode édition"
					name="editMode"
					@click="storeEditMode"
				/>
			</div>

			<div
				v-if="editMode"
				class="admin-wrapper-row"
			>
				<button
					:class="editAndMove?'btn-success':'btn'"
					@click="editAndMove=!editAndMove"
				>
					Mode organisation
				</button>
			</div>
		</div>

		<!-- Header dashboard -->
		<chapter-dashboard
			v-show="!editAndMove"
			v-model:hide-resolved-questions="hideResolvedQuestions"
			v-model:show-exercises="showOnlyExercises"
			:chapter="chapter.data"
		/>

		<!-- Adding all the posts -->
		<section class="space-y-10">
			<!-- Adding formulas as first post. -->
			<!-- TODO: Remove the chapter-formulas component -->
			<chapter-formulas
				v-if="chapter.data.formulas.length>0 || ($page.props.auth.can.admin && editMode)"
				v-show="!editAndMove"
				id="chapter-formula"
				:chapter="chapter.data"
			/>

			<div
				v-if="chapterPosts.length>0"
				class="space-y-10"
			>
				<post-show
					v-for="(post, index) in chapterPostsFiltered"
					:id="`post-${post.id}`"
					:key="post.id"
					:hide-resolved-questions="hideResolvedQuestions"
					:post="post"
					:show-title-only="editAndMove"
					@delete="deletePost(post.id)"
					@update-title="post.title=$event"
				>
					<template
						v-if="chapterPosts.length>1 && chapterPosts.length===chapterPostsFiltered.length"
						#adminHeader
					>
						<div class="w-full flex justify-between items-baseline flex-col md:flex-row">
							<div>Déplacer l'article</div>
							<div class="flex gap-3">
								<button
									:class="index===0?'invisible':''"
									:disabled="index===0"
									class="btn-update btn-xs"
									@click="movePostUp(index, 0)"
								>
									En premier
								</button>
								<button
									:class="index===0?'invisible':''"
									:disabled="index===0"
									class="btn-update btn-xs"
									@click="movePostUp(index, index-1)"
								>
									Monter
								</button>
								<button
									:class="index===chapterPosts.length-1?'invisible':''"
									:disabled="index===chapterPosts.length-1"
									class="btn-update btn-xs"
									@click="movePostUp(index, index+1)"
								>
									Descendre
								</button>
								<button
									:class="index===chapterPosts.length-1?'invisible':''"
									:disabled="index===chapterPosts.length-1"
									class="btn-update btn-xs"
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
		<div
			v-show="!editAndMove"
			class="mt-10 text-center space-y-8"
		>
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

		<!-- Chapter fixed bottom object -->
		<ChapterFloatingMenu
			v-show="showFloatingFooter"
			:observe-title="observeTitle"
		>
			<chapter-formulas
				id="chapter-formula-aside"
				:chapter="chapter.data"
				class="h-full"
			/>
		</ChapterFloatingMenu>
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
import {provide, ref, computed, inject, onMounted} from "vue"
import ChapterHeader from "@/Components/Ui/Chapters/ChapterHeader"
import PostShow from "@/Components/Posts/PostShow"
import FormSwitch from "@/Components/Form/FormSwitch"
import ChapterDashboard from "@/Components/Ui/Chapters/ChapterDashboard"
import {menuScrollTo} from "@/Composables/useHelpers"
import ChapterFloatingMenu from "@/Components/Ui/Chapters/ChapterFloatingMenu"

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
	editMode = ref(localStorage.getItem("ScolCoursEditMode") === "1"),
	editAndMove = ref(false),
	showOnlyExercises = ref(false),
	hideResolvedQuestions = ref(false),
	chapterPostsFiltered = computed(() => {
		if (showOnlyExercises.value) {
			return chapterPosts.value.filter(post => post.type === "exercise")
		}

		return chapterPosts.value
	})

provide("editmode", editMode)
provide("chapterPosts", chapterPosts)
let showFloatingFooter = inject("showfloatingfooter")

function storeEditMode() {
	localStorage.setItem("ScolCoursEditMode", editMode.value ? "1" : "0")
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
	chapterPosts.value.splice(targetIndex, 0, chapterPosts.value.splice(crtIndex, 1)[0])

	// Save the new position to the database
	axios.post(route("chapters.updatePostsOrder", [props.chapter.data.id]), {
		_method: "patch",
		data: chapterPosts.value.map((post, index) => {
			return {"id": post.id, "order": index}
		})
	})
}

function goToNextQuestion(){
	let id = document.getElementsByClassName("unanswered")[0].id
	menuScrollTo(id)
}

let observer = ref(observer),
	observeTitle = ref(""),
	showFormula = ref(false),
	showMenu = ref(true)
onMounted(()=>{
	// Observer
	observer.value = new IntersectionObserver((entries, observer)=>{
		for(let entry of entries){
			if(entry.isIntersecting){
				entry.target.classList.add("observe-visible")
				entry.target.classList.remove("observe-below")
				entry.target.classList.remove("observe-above")
			}else {

				if (entry.boundingClientRect.top < 0) {
					entry.target.classList.add("observe-above")
					entry.target.classList.remove("observe-below")
					entry.target.classList.remove("observe-visible")
				} else {
					entry.target.classList.add("observe-below")
					entry.target.classList.remove("observe-above")
					entry.target.classList.remove("observe-visible")
				}
			}
		}

		// Finally, get the title to display.
		const visibleItems = document.getElementsByClassName("observe-visible")
		if(visibleItems.length>0){
			observeTitle.value = visibleItems[0].dataset.title
		}else{
			const aboveItems = document.getElementsByClassName("observe-above")
			if(aboveItems.length>0){
				observeTitle.value = aboveItems[aboveItems.length-1].dataset.title
			}else{
				observeTitle.value = ""
			}
		}

	}, {})

	let elements = document.getElementsByClassName("chapter-observe")

	for(let element of elements){
		observer.value.observe(element)
	}
})


</script>
