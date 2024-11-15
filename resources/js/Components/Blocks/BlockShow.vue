<script lang="ts" setup>
import BlockBodyButtons from "@/Components/Blocks/BlockBodyButtons.vue"
import BlockShowAdmin from "@/Components/Blocks/BlockShowAdmin.vue"
import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { useFormattedBody } from "@/Composables/useHelpers.ts"
import { useScriptLoader } from "@/Composables/useScriptLoader.ts"
import { blockTypeDefault, blockTypes } from "@/scolcours.ts"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import { flashInterface } from "@/types"
import type { BlockInterface } from "@/types/modelInterfaces.ts"
import { router } from "@inertiajs/vue3"
import axios from "axios"
import { computed, inject, provide } from "vue"

const editMode = useStoreEditMode()
const flash = inject<flashInterface>("flash")

// Props
const props = defineProps<{
	block: BlockInterface,
	noAdmin?: boolean
}>()


// emits
defineEmits(["destroy"])


// Block display style computed properties
const blockConfig = computed(() => {
	return blockTypes[props.block.type] === undefined
		? blockTypeDefault
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

const blockTitleClass = computed(() => {
	return "flex justify-between w-full px-5 py-3 mb-3 text-2xl"
		+ (props.block.merge ? " pt-10" : "")
		+ " " + blockConfig.value.style.header
})


const blockTemplate = computed(() => {
	if (!props.block.template) {
		return {
			grid: "grid grid-cols-1 gap-3",
			block: "",
			illustration: ""
		}
	}

	const values = props.block.template
		.split(",")
		.filter((x) => x !== "")

	console.log(values)
	// pattern is:
	// bi,md:b+i,lg:2b+i,xl:i+3b
	if (values.length === 0) {
		return {
			grid: "grid grid-cols-1 gap-3",
			block: "",
			illustration: ""
		}
	}

	const grid = ["grid grid-cols-1 gap-3"],
		block = [
			values[0][0] === "b"
				? "order-1 col-span-1"
				: "order-2 col-span-1"
		],
		illustration = [
			values[0][0] === "i"
				? "order-1 col-span-1"
				: "order-2 col-span-1"
		]
	
	for (const value of values) {
		const media = value.split(":") // ["md", "2b+i"]
		if (media.length !== 2) {
			continue
		}

		if (["md", "lg", "xl"].indexOf(media[0]) !== -1) {
			if (media[1].includes("+")) {
				// md:b+i or md:3b+i or ...
				const sizes = media[1].split("+").map((v) => {
					return v.slice(0, -1) === "" ? 1 : +v.slice(0, -1)
				}) // [2, 1]

				// define grid size for the media query
				grid.push(
					`${media[0]}:grid-cols-${sizes[0] + sizes[1]}`
				)

				// define elements.
				for (let j = 0; j < sizes.length; j++) {
					if (sizes[j] === 0) {
						// Must be hidden.
						if (value[0].includes("b")) {
							block.push(`${media[0]}:hidden`)
						} else {
							illustration.push(`${media[0]}:hidden`)
						}
					} else {
						if (value[j].includes("b")) {
							block.push(
								`${media[0]}:order-${j + 1} ${media[0]
								}:col-span-${sizes[j]}`
							)
						} else {
							illustration.push(
								`${media[0]}:order-${j + 1} ${media[0]
								}:col-span-${sizes[j]}`
							)
						}
					}
				}
			} else {
				// md:bi or md:ib
				grid.push(`${media[0]}:grid-cols-1`)
				block.push(
					media[1][0] === "b"
						? `${media[0]}:order-1 ${media[0]}:col-span-1`
						: `${media[0]}:order-2 ${media[0]}:col-span-1`
				)
				illustration.push(
					media[1][0] === "i"
						? `${media[0]}:order-1 ${media[0]}:col-span-1`
						: `${media[0]}:order-2 ${media[0]}:col-span-1`
				)
			}
		}
	}

	return {
		grid: grid.join(" "),
		block: block.join(" "),
		illustration: illustration.join(" ")
	}
})

const postScript = inject("postScript", useScriptLoader(""))
const blockScript = useScriptLoader(props.block.script, { parent: postScript.data })
blockScript.run()
provide("blockScript", blockScript)

const blockBody = computed(() => useFormattedBody(props.block.body, blockScript.merged))


function addIllustration(){
	axios
		.post(
			route("illustrations.store", [props.block.id]),
			{}
		)
		.then((res) => {
			router.visit(route("illustrations.edit", [res.data.id]))
			flash.success("une nouvelle illustration a été créée")
		}).catch((res) => {
			console.warn("add illustration: ", res)
		}
	)
}
</script>

<template>
	<article
		:id="`block-${block.id}`"
		:class="blockConfig.style.body"
		class="bg-white dark:bg-gray-800"
	>
		<BlockShowAdmin
			v-if="!noAdmin"
			:block="block"
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
				:class="blockTitleClass"
			>
				<!-- header left: (generic) icon and title -->
				<div
					v-theme.text="!block.type"
					class="flex gap-3 items-baseline"
				>
					<i
						v-if="blockIcon"
						:class="blockIcon"
					/>
					<h3 v-katex.auto="blockTitle" />
				</div>

				<!-- buttons for randomize and more... -->
				<block-body-buttons />
			</div>
		</slot>

		<!-- body -->
		<slot name="body">
			<div
				:class="blockTemplate.grid + ((!block.title && !block.type) ? ' pt-3' : '')"
				class="px-5 pb-2"
			>
				<markdown-it
					v-if="blockBody !== null"
					:class="blockTemplate.block"
					:text="blockBody"
				/>

				<!-- Block illustrations -->
				<div
					v-if="block.illustrations?.length > 0"
					:class="blockTemplate.illustration"
				>
					<div :class="block.illustrationsGrid">
						<illustration-show
							v-for="illustration in block.illustrations"
							:key="`illustration-${illustration.id}`"
							:illustration="illustration"
						/>
					</div>
				</div>
			</div>
		</slot>

		<!-- admin footer to add illustrations -->
		<div
			v-if="!noAdmin"
			v-admin="editMode.enable"
			v-theme.bg.text.admin
			class="text-xs px-5 py-2 flex justify-between"
		>
			<button
				class="btn btn-xs border border-gray-500"
				@click="addIllustration"
			>
				<i class="bi bi-plus-lg mr-2" /> illustration
			</button>
		</div>
	</article>
</template>
