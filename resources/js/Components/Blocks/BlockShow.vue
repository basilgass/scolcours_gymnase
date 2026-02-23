<script lang="ts" setup>
import BlockBodyButtons from "@/Components/Blocks/BlockBodyButtons.vue"
import BlockShowAdmin from "@/Components/Blocks/BlockShowAdmin.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {useFormattedBody} from "@/Composables/useHelpers.ts"
import {useScriptLoader, UseScriptLoaderReturn} from "@/Composables/useScriptLoader.ts"
import {blockTypes, IblockType} from "@/block.config.ts"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import type {BlockInterface} from "@/types/modelInterfaces.ts"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {computed, inject, onMounted, provide, ref} from "vue"
import {blockTemplate} from "@/helpers/blockTemplate.ts"
import ScButton from "@/Components/Ui/scButton.vue"
import IllustrationIndex from "@/Components/Illustrations/IllustrationIndex.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import AccordionBody from "@/Components/Ui/AccordionBody.vue";

const editMode = useStoreEditMode()
const flash = useStoreFlashMessage()

// Props
const props = defineProps<{
	block: BlockInterface,
	noAdmin?: boolean
}>()


// emits
const emits = defineEmits<{
	destroy: [],
	moved: [target: { id: number, target_type: string, target_id: number }]
	success: [success: boolean]
}>()

// Script randomization
const postScript = inject("postScript", useScriptLoader(""))
const blockScript: UseScriptLoaderReturn = useScriptLoader(props.block.script, {parent: postScript.data})
blockScript.run()
provide("blockScript", blockScript)

// Block display style computed properties
const blockConfig = computed<IblockType>(() => {
	return blockTypes[props.block.type] === undefined
		? {
			style: {
				body: "",
				header: "",
				illustration: ""
			},
			icon: "",
			title: ""
		}
		: blockTypes[props.block.type]
})

const blockIcon = computed(() => {
	return blockConfig.value.icon
})

const blockTitle = computed(() => {
	return !props.block.title
		? blockConfig.value.title
		: props.block.title
})

const elementsClasses = computed(() => {
	return blockTemplate(props.block.template)
})

// Block computed content.
const blockBody = computed(() => {
	let body = useFormattedBody(props.block.body, blockScript.merged)

	if (blockConfig.value.content?.prepend) {
		body += `${blockConfig.value.content.prepend}\n\n${body}`
	}

	if (blockConfig.value.content?.append) {
		body += `${body}\n\n${blockConfig.value.content.append}`
	}

	return useFormattedBody(body, blockScript.merged)
})

const canCollapse = computed(() => blockConfig.value.collapse !== undefined)
const isOpen = ref(blockConfig.value.collapse !== true)

function addIllustration() {
	axios
		.post(
			route("api.admin.blocks.illustrations.store", {block: props.block.id}),
			{}
		)
		.then((res) => {
			router.visit(route("admin.illustrations.edit", {illustration: res.data.id}))
			flash.success("une nouvelle illustration a été créée")
		}).catch((res) => {
			console.warn("add illustration: ", res)
		}
	)
}

onMounted(() => {
	emits('success', !blockScript.hasErrors.value)

})
</script>

<template>
	<article
		:id="`block-${block.id}`"
		:class="blockConfig.style.body"
		class="bg-content"
	>
		<BlockShowAdmin
			v-if="!noAdmin"
			:block="block"
			@moved="emits('moved', $event)"
		>
			<template #adminLeft>
				<slot name="adminLeft" />
			</template>
			<template #adminCenter>
				<slot name="adminCenter" />
			</template>
			<template #adminRight>
				<slot name="adminRight" />
			</template>
		</BlockShowAdmin>

		<!-- header -->
		<slot name="header">
			<div
				v-show="blockTitle || blockScript.hasData.value"
				:class="(props.block.merge ? ' pt-10' : '') + ' ' +
					blockConfig.style.header"
				class="flex justify-between
					w-full
					px-2 md:px-5 py-2 md:py-3"
			>
				<!-- header left: (generic) icon and title -->
				<div
					v-theme.text="!block.type"
					class="flex gap-3 items-baseline text-lg md:text-xl lg:text-2xl font-semibold cursor-pointer"
					@click="isOpen=!isOpen"
				>
					<i
						v-if="blockIcon"
						:class="blockIcon"
					/>
					<h3 v-katex.auto="blockTitle" />
				</div>

				<!-- header right -->
				<div class="flex gap-3">
					<!-- buttons for randomize and more... -->
					<block-body-buttons />

					<div v-if="canCollapse"
					     :class="[
						   	'aspect-square text-center cursor-pointer',
							 'transition-all ease-in-out duration-300',
							 isOpen ? 'rotate-90' : ''
						 ]"
					     @click="isOpen=!isOpen"
					>
						<i class="bi bi-chevron-right" />
					</div>
				</div>
			</div>
		</slot>

		<!-- body -->
		<accordion-body v-model="isOpen">
			<slot name="body">
				<div
					v-if="blockBody!==null || block.illustrations.length>1"
					:class="[
						'p-3',
						elementsClasses.grid + ((!block.title && !block.type) ? ' pt-3' : ''),
				]"
				>
					<markdown-it
						v-if="blockBody !== null"
						:class="elementsClasses.block"
						:text="blockBody"
					/>

					<!-- Block illustrations -->
					<div
						v-if="block.illustrations?.length > 0"
						:class="elementsClasses.illustration"
					>
						<illustration-index
							:block
						/>
					</div>
				</div>
				<div v-else-if="block.illustrations.length===1">
					<!-- seulement une illustration : plein bloc -->
					<illustration-index
						:block
					/>
				</div>
				<div v-else class="font-code text-xl min-h-[10em] grid place-items-center">
					Aucun contenu
				</div>
			</slot>
		</accordion-body>

		<slot name="footer">
			<!-- admin footer to add illustrations -->
			<div
				v-if="!noAdmin"
				v-admin="editMode.enable"
				v-theme.admin
				class="text-xs px-5 py-2 flex justify-between border-t"
			>
				<sc-button
					type="add"
					xs
					@click="addIllustration"
				>
					<i class="bi bi-plus-lg mr-2" /> illustration
				</sc-button>
			</div>
		</slot>
	</article>
</template>
