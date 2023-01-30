<template>
	<div
		ref="root"
	>
		<div
			v-if="$page.props.auth.can.admin && !preview && editMode.enabled.value"
			class="flex justify-between mb-3"
		>
			<div>
				<button
					class="draggable-handle text-xs px-1 text-gray-400 hover:text-black"
				>
					<i class="bi bi-arrows-move" />
				</button>
				<button
					class="text-xs ml-3"
					@click="showEditForm=true"
				>
					<i class="bi bi-pencil mr-2" /> {{ theIllustration.id }}
				</button>
			</div>
		</div>
		<pi-draw-parser
			v-if="theIllustration.type==='draw'"
			:draw="theIllustration"
		/>
		<div>
			<component
				:is="IllustrationComponent"
				v-if="theIllustration.type==='component'"
				:key="updateComponentKey"
				:illustration="theIllustration"
			/>
			<div class="float-right">
				<button
					v-if="preview"
					class="btn btn-xs flex gap-3 group"
					@click="updateComponentKey++"
				>
					<div class="group-hover:rotate-180 transition-all">
						<i class="bi bi-arrow-clockwise" />
					</div>
					<div>mise à jour</div>
				</button>
			</div>
		</div>

		<!-- edit form -->
		<div
			v-if="showEditForm"
			v-admin
		>
			<component
				:is="editForm"
				v-model="showEditForm"
				:illustration="theIllustration"
				@change="theIllustration = $event"
				@destroy="emits('destroy', $event)"
			/>
		</div>
	</div>
</template>

<script setup>
import {computed, defineAsyncComponent, inject, ref} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"

const props = defineProps({
		illustration: {type: Object, required: true},
		preview: {type: Boolean, default: false}
	}),
	emits = defineEmits(["destroy"])

let root = ref(null),
	showEditForm = ref(false),
	editForm = computed(() => {
		return defineAsyncComponent(
			() => import("@/Components/Posts/Illustrations/IllustrationForm.vue")
		)
	}),
	editMode = inject("editMode"),
	theIllustration = ref(props.illustration),
	updateComponentKey = ref(0)

const IllustrationComponent = computed(
	() => {
		if(props.illustration.type==="component" && props.illustration.title!==null){
			return defineAsyncComponent(
				() => import(`@/Components/Posts/Illustrations/Elements/${props.illustration.title}.vue`)
			)
		}else{
			return false
		}
	}
)
</script>
