<template>
	<div class="bg-white rounded shadow px-4 py-2">
		<h2
			class="chapter-menu text-2xl my-4"
		>
			{{ postTitle }}
		</h2>

		<!-- admin box -->
		<div
			v-if="$page.props.auth.can.admin && editMode"
			class="admin-wrapper"
		>
			<!-- update the number of visible blocks -->
			<div class="flex items-baseline">
				<form-label
					class="mr-2"
					name="visibleBlocks"
					label="Nombre de blocs visibles"
					@click.ctrl="numberVisibleBlocks=0;updateNumberOfVisibleBlocks()"
				/>
				<form-number
					v-model="numberVisibleBlocks"
					name="visibleBlocks"
					label="Nombre de blocs visibles"
					inline
					class="w-12"
					@input="updateNumberOfVisibleBlocks"
				/>
			</div>

			<div class="ml-5 flex gap-3">
				<button
					class="btn-edit btn-xs"
					@click="edit=true"
				>
					éditer <i class="bi bi-pencil" />
				</button>
				<button
					class="btn-delete btn-xs"
					@click="deletePost"
				>
					Supprimer <i class="bi bi-trash" />
				</button>
			</div>
		</div>

		<!-- all the blocks -->
		<div class="post-wrapper">
			<!-- Boutons générés par rapport au scritp du post -->
			<div class="post-header flex justify-end mt-2 mb-5">
				<button
					v-if="postScriptResult?.random===true"
					class="btn btn-xs bg-white hover:bg-blue-400 hover:border-blue-500 hover:text-white"
					@click="runPostScript()"
				>
					<i class="bi bi-shuffle mr-2" />Rendre aléatoire
				</button>
				<div
					v-if="props.post.switch"
					class="ml-10"
				>
					<span v-katex.auto="switchText.pre" />
					<ui-switch
						v-model="scriptSwitch"
						sm
						class="mx-1"
					/>
					<span v-katex.auto="switchText.post" />
				</div>
			</div>

			<!-- Visible blocks by default -->
			<div
				v-if="visibleBlocks.length>0"
				class="space-y-10"
			>
				<block-show
					v-for="block in visibleBlocks"
					:key="block.id"
					has-padding
					:switch="scriptSwitch"
					:block="block"
					@delete="deleteBlock(block.id)"
				/>
			</div>
			<!-- hidden blocks by default -->
			<div v-if="hiddenBlocks.length>0">
				<div
					v-if="!showHiddenBlocks"
					class="text-center mt-6 mb-4 pt-5 border-t border-gray-200"
				>
					<button
						class="btn text-gray-500 italic text-xs"
						@click="showHiddenBlocks=true"
					>
						Développer la suite...
					</button>
				</div>

				<collapse-transition>
					<div
						v-show="showHiddenBlocks"
						class="space-y-10"
					>
						<block-show
							v-for="block in hiddenBlocks"
							:key="block.id"
							has-padding
							:switch="scriptSwitch"
							:block="block"
							@delete="deleteBlock(block.id)"
						/>
					</div>
				</collapse-transition>
			</div>
		</div>

		<!-- all the questions -->
		<div
			v-if="postQuestions.length>0"
			class="questions-wrapper mt-10"
		>
			<h3 class="text-lg bg-gray-300 -mx-4 px-4 py-3 mt-5 mb-3">
				Questions
			</h3>

			<question-show
				v-for="question in postQuestions"
				:key="`postQuestion-${question.id}`"
				class="-mx-4 px-4 even:bg-gray-200"
				:question="question"
				@destroy="questionDestroy"
			/>
		</div>
		<!-- post footer -->
		<div
			v-if="$page.props.auth.can.admin && editMode"
			class="admin-wrapper mt-10 flex-col gap-10"
		>
			<div class="flex items-end gap-3">
				<button
					class="btn-primary"
					@click="addBlock"
					v-text="`ajouter ${addNBlocks} bloc${addNBlocks>1?'s':''}`"
				/>

				<form-number
					v-model="addNBlocks"
					name="addNBlock"
					label="nombre de blocs à ajouter"
					min="1"
					max="10"
				/>
			</div>

			<div>
				<h3 class="text-lg">
					Ajouter des questions
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div class="md:col-span-2">
						<form-textarea
							v-model="questionForm.body"
							:rows="questionForm.rows"
							label="question"
							name="body"
							@input="questionForm.rows = questionForm.body.split('\n').length"
						/>
					</div>
					<form-textarea
						v-model="questionForm.answer"
						:rows="questionForm.rows"
						label="réponse"
						name="answer"
					/>
					<div class="flex items-end gap-4">
						<form-textarea
							v-model="questionForm.checker"
							:rows="questionForm.rows"
							label="Vérification"
							name="checker"
						/>
						<button
							class=" btn-primary"
							@click="questionStore"
						>
							Ajouter {{ questionForm.rows }}
						</button>
					</div>
				</div>
			</div>
		</div>


		<!-- Edit box -->
		<dialog-modal
			v-model="edit"
			class="w-full md:w-[600px]"
			@cancel="numberVisibleBlocks = props.post.numberOfVisibleBlocks"
		>
			<PostForm
				:post="post"
				@validate="refreshPost"
				@cancel="edit=false;numberVisibleBlocks = props.post.numberOfVisibleBlocks"
			/>
		</dialog-modal>
	</div>
</template>

<script setup>

import {computed, inject, onMounted, provide, reactive, ref} from "vue"
import BlockShow from "@/Components/Posts/BlockShow"
import FormNumber from "@/Components/Form/FormNumber"
import CollapseTransition from "@/Components/CollapseTransition"
import PostForm from "@/Components/Posts/PostForm"
import {PiMath} from "pimath/esm"
import UiSwitch from "@/Components/Ui/UiSwitch"
import DialogModal from "@/Components/Ui/DialogModal"
import FormLabel from "@/Components/Form/FormLabel"
import FormTextarea from "@/Components/Form/FormTextarea"
import QuestionShow from "@/Components/Posts/QuestionShow"

const emits = defineEmits(["delete","updateTitle"])
const props = defineProps({
	post: {
		type: Object, default: () => {
		}
	}
})

/** Blocks reactives and methods */
let blocks = ref(props.post.blocks),
	visibleBlocks = computed(()=>{
		let result = []

		// Get the number of visible blocks.
		if(numberVisibleBlocks.value===0){
			result = blocks.value
		}else{
			result = [...blocks.value].splice(0, numberVisibleBlocks.value)
		}

		// If not in edit mode, filter the blocks depending on the switch.
		if(!editMode.value){
			if(props.post.switch!==null) {
				result = result
					.filter(block => {
						return block.switch === null || Boolean(block.switch) === scriptSwitch.value
					})
			}
		}

		// Return the list of blocks
		return result
	}),
	hiddenBlocks = computed(()=>{
		if(numberVisibleBlocks.value===0){
			return []
		}else{
			return [...blocks.value.filter(block=>props.post.switch===null || block.switch===null || Boolean(block.switch)===scriptSwitch.value)].splice(numberVisibleBlocks.value)
		}
	}),
	showHiddenBlocks = ref(false)


/** Questions reactives and methods */
let postQuestions = ref(props.post.questions)
let questionForm = reactive({
	body: "",
	answer: "",
	checker: "",
	rows: 1
})
function questionStore(){
	axios.post(
		route("posts.questions.store", [props.post.id]), {
			...questionForm
		}
	).then((res)=>{
		// Add the question.
		res.data.data.forEach(q=>postQuestions.value.push(q))
		// questions.value.push(res.data)
	}).catch(res=>{
		// Show the error.
		console.log(res.message)
	})
}
function questionDestroy(id){
	postQuestions.value = postQuestions.value.filter(question=>question.id!==id)
}


/** scripts / random parameters / switch*/
function runPostScript(){
	if(props.post.script!==null) {
		let F = new Function("PiMath", props.post.script)
		postScriptResult.value = F(PiMath)
	}
}
let postScriptResult = ref({})
onMounted(()=>runPostScript())
provide("postScriptResult", postScriptResult)


/** Switch display */
let switchText = computed(()=>{
	let preText = "", postText = ""

	if(props.post.switch.includes("@")){
		const txt =  props.post.switch.split("@")
		preText = txt[0]
		postText = txt[1]
	}else{
		preText = props.post.switch
	}

	return {
		pre: preText,
		post: postText
	}
})


/** Edit mode and methods */
let editMode = inject("editmode")




let edit = ref(props.post.isNew===true),
	postTitle = ref(props.post.title),
	numberVisibleBlocks = ref(props.post.numberOfVisibleBlocks),
	scriptSwitch = ref(props.post.switch!==null),
	addNBlocks = ref(1)























function refreshPost(item){
	postTitle.value = item.title
	emits("updateTitle", item.title)
	edit.value = false
}

function updateNumberOfVisibleBlocks(){
	axios.post(
		route("posts.updateNumberOfVisibleBlocks", [props.post.id]),
		{
			"numberVisibleBlocks": numberVisibleBlocks.value,
			_method: "patch"
		}
	).then(res => {
		// TODO: Send flash message ?
	})
}

function deletePost() {
	axios.post(route("posts.destroy", [props.post.id]),
		{_method: "delete"})
		.then(res => emits("delete", props.post.id))
}

function addBlock() {
	if(addNBlocks.value>=0) {
		axios.post(
			route("posts.blocks.store", [props.post.id]),
			{
				n: addNBlocks.value
			}
		).then(res => {
			// Set the first block in edit mode.
			res.data[0].isNew = true
			for(let b of res.data){
				blocks.value.push(b)
			}
		}).catch(err => {
			console.error(err)
		})
	}
}

function deleteBlock(id) {
	blocks.value = blocks.value.filter(block => block.id !== id)
}

</script>
