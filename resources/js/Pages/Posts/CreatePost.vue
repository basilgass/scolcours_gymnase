<template>
	<ArticleTitle title="Nouvel article" />
	
	<div class="grid grid-cols-2 gap-4">
		<div class="max-h-[700px] overflow-y-scroll pr-3">
			<form
				ref="formPost"
				@submit.prevent="create_new_post()"
			>
				<form-select
					v-model="form.chapter"
					label="chapitre"
					name="chapter"
					:error="form.errors.chapter"
				>
					<option
						v-for="(chapter, index) of props.chapters"
						:key="'chapter-'+index"
						:value="chapter.slug"
					>
						{{ chapter.title }}
					</option>
				</form-select>
				
				<form-select
					v-model="form.template"
					label="template"
					name="template"
					:error="form.errors.template"
				>
					<option
						value="1"
					>
						Simple Post
					</option>
				</form-select>
				
				<form-input
					v-model="form.title"
					label="titre"
					name="title"
					:error="form.errors.title"
				/>
				
				<form-textarea
					v-model="form.body"
					label="body"
					name="body"
					:error="form.errors.body"
				/>
				
				<div v-show="addAnswer">
					<form-input
						v-model="form.answer"
						name="answer"
						label="réponse"
					/>
				</div>
				
				<div v-show="addWalkthrough">
					<h2 class="font-lg font-semibold mt-10">
						Marche à suivre
					</h2>
					<button
						type="button"
						class="btn"
						@click.prevent="form.walkthrough.push({
							step: '',
							resolution: ''
						})"
					>
						+
					</button>
					<div
						v-for="(walk, index) in form.walkthrough"
						:key="`walk-${index}`"
					>
						<form-input
							v-model="form.walkthrough[index].step"
							:name="`walk-step-${index}`"
							:label="`Etape ${index+1}`"
							:error="form.errors.walkthrough"
						/>
						<form-textarea
							v-model="form.walkthrough[index].resolution"
							name="`walk-step-${index}`"
							label="Résolution"
							:error="form.errors.walkthrough"
						/>
					</div>
				</div>
				
				<div v-show="addIllustrations">
					<h2 class="font-lg font-semibold mt-10">
						Illustrations
					</h2>
					
					<form-illustration
						v-model="illustration"
						name="illustration"
					/>
				</div>
				<form-button>Ajouter</form-button>
			</form>
			
			
			<div class="grid grid-cols-3 gap-5 mt-10">
				<button
					class="btn bg-white"
					@click="addWalkthrough=!addWalkthrough"
				>
					Walkthrough
				</button>
				<button
					class="btn bg-white"
					@click="addAnswer=!addAnswer"
				>
					Réponse
				</button>
				<button
					class="btn bg-white"
					@click="addIllustrations=!addIllustrations"
				>
					Illustrations
				</button>
			</div>
		</div>
		
		<div class="max-h-[700px] overflow-y-scroll">
			<component
				:is="PostTemplate"
				:post="PostModel"
			/>
		</div>
	</div>
</template>

<script>
import LayoutMain from '@/Pages/Shared/LayoutMain'

export default {
	layout: LayoutMain
}
</script>


<script setup>
import ArticleTitle from '@/Components/Ui/ArticleTitle'
import FormInput from '@/Components/Form/FormInput'
import FormTextarea from '@/Components/Form/FormTextarea'
import FormSelect from '@/Components/Form/FormSelect'
import { useForm } from '@inertiajs/inertia-vue3'
import FormButton from '@/Components/Form/FormButton'
import { ref } from 'vue'
import { computed, defineAsyncComponent } from 'vue'
import FormIllustration from '@/Components/Form/FormIllustration'

const props = defineProps({
	chapters: {type: Array, default: ()=>[]}
})

let addAnswer = ref(false),
	addWalkthrough = ref(false),
	addIllustrations = ref(false)

const form = useForm({
	chapter: null,
	title: '',
	body: '',
	template: '',
	answer: '',
	walkthrough: [],
	illustrations: []
})

const PostTemplate = computed(
	()=> defineAsyncComponent(
		() => import(`@/Components/Posts/Templates/${'SimplePost'}`)
	)
)

const PostModel = computed(()=>{
	let post = {
		title: form.title,
		body: form.body,
		answer: {
			body: form.answer
		},
		walkthrough: form.walkthrough,
		illustrations: form.illustrations
	}
	return post
})

function create_new_post(){
	form.post('/post', {
		preserveScroll: true,
		onError: ()=> {
			console.log(form.errors)
		}
	})
}
</script>
