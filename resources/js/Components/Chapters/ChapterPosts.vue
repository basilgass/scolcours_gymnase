<template>
	<section>
		<div
			v-if="thePosts.length>0"
			class="space-y-10"
		>
			<post-show
				v-for="(post, index) in postsFilter"
				:id="`post-${post.id}`"
				:key="post.id"
				:post="post"
				:show-title-only="organisationMode"
				@delete="deletePost(post.id)"
				@update-title="post.title=$event"
			>
				<template
					v-if="thePosts.length>1 && thePosts.length===postsFilter.length"
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
								:class="index===thePosts.length-1?'invisible':''"
								:disabled="index===thePosts.length-1"
								class="btn-update btn-xs"
								@click="movePostUp(index, index+1)"
							>
								Descendre
							</button>
							<button
								:class="index===thePosts.length-1?'invisible':''"
								:disabled="index===thePosts.length-1"
								class="btn-update btn-xs"
								@click="movePostUp(index, thePosts.length)"
							>
								En dernier
							</button>
						</div>
					</div>
				</template>
			</post-show>
		</div>

		<!-- chapter footer -->
		<div
			v-show="!organisationMode"
			class="mt-10 text-center space-y-8"
		>
			<div v-if="thePosts.length===0">
				Aucun article - que c'est triste
			</div>

			<button
				v-if="$page.props.auth.can.admin && editMode"
				class="btn-primary"
				@click="createPost"
			>
				Créer un article maintenant
			</button>
		</div>
	</section>
</template>

<script setup>
import PostShow from "@/Components/Posts/PostShow.vue"
import {computed, inject, ref} from "vue"
import {usePage} from "@inertiajs/inertia-vue3"

const emits = defineEmits("update:posts")
const props = defineProps({
		posts: {type: Array, required: true},
		filter: {type: Array, default: ()=>[]},
		organisationMode: {type: Boolean, default: false}
	}),
	theChapter = usePage().props.value.chapter.data
let thePosts = ref(props.posts),
	postsFilter = computed(()=>{
		return thePosts.value
	}),
	editMode = inject("editmode")

function createPost() {
	axios.post(
		route("chapters.posts.store", [theChapter.slug]),
		{
			title: "no title",
		}
	)
		.then(res => {
			const post = res.data.data
			post.isNew = true
			thePosts.value.push(post)
			emits("update:posts", thePosts.value)
		})
		.catch(err => console.log(err))
}

function deletePost(id) {
	// Remove the post from the list.
	thePosts.value = thePosts.value.filter(post => post.id !== id)
	emits("update:posts", thePosts.value)
}

function movePostUp(crtIndex, targetIndex) {
	thePosts.value.splice(targetIndex, 0, thePosts.value.splice(crtIndex, 1)[0])

	// Save the new position to the database
	axios.post(route("chapters.updatePostsOrder", [theChapter.id]), {
		_method: "patch",
		data: thePosts.value.map((post, index) => {
			return {"id": post.id, "order": index}
		})
	}).then(()=>{
		emits("update:posts", thePosts.value)
	})
}
</script>
