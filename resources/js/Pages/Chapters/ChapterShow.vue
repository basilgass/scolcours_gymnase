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
		<div class="space-y-10">
			<!-- Adding formulas as first post. -->
			<chapter-formulas
				v-if="chapter.data.formulas.length>0 || ($page.props.auth.can.admin && editMode)"
				v-show="!editAndMove"
				id="chapter-formula"
				:chapter="chapter.data"
			/>

			<chapter-posts
				v-model:posts="chapterPosts"
				:organisation-mode="editAndMove"
			/>
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

import ChapterFormulas from "@/Components/Chapters/Formulas/ChapterFormulas"
import {provide, ref, computed, inject, onMounted} from "vue"
import ChapterHeader from "@/Components/Chapters/ChapterHeader.vue"
import FormSwitch from "@/Components/Form/FormSwitch"
import ChapterDashboard from "@/Components/Chapters/ChapterDashboard.vue"
import {menuScrollTo} from "@/Composables/useHelpers"
import ChapterFloatingMenu from "@/Components/Chapters/ChapterFloatingMenu.vue"
import ChapterPosts from "@/Components/Chapters/ChapterPosts.vue"

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
	hideResolvedQuestions = ref(false)

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
