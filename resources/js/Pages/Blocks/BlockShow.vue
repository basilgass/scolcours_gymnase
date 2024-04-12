<!--
Affichage d'un block , avec toutes les possibilités
-->
<script lang="ts" setup>
import { computed, inject, PropType, provide, ref } from "vue"
import { blockTypeDefault, blockTypes } from "@/scolcours"
import type { BlockInterface } from "@/types/modelInterfaces"
import IllustrationShow from "@/Pages/Illustrations/IllustrationShow.vue"
import BlockShowAdmin from "@/Pages/Blocks/BlockShowAdmin.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { useFormattedBody } from "@/Composables/useHelpers"
import { PiMath } from "pimath/esm"
import BlockBodyButtons from "@/Components/Blocks/BlockBodyButtons.vue"

// Props
const props = defineProps({
	block: {
		type: Object as PropType<BlockInterface>,
		required: true
	},
	groupIndex: {
		type: Number,
		default: 0
	}
	// TODO: delete extra props for BlockShow
	// format: {
	// 	type: String as PropType<"post" | "formula" | "question">,
	// 	default: "post"
	// },
	// switch: {
	// 	type: Boolean,
	// 	default: null
	// },
	// forceShow: {
	// 	type: Boolean,
	// 	default: false
	// },
	// maxIllustration: {
	// 	type: Number,
	// 	default: null
	// },
	// noDelete: {
	// 	type: Boolean,
	// 	default: false
	// }
})

// emits
defineEmits(["destroy"])


// Block display style computed properties
const blockConfig = computed(() => {
	return blockTypes[props.block.type] === undefined
		? blockTypeDefault
		: blockTypes[props.block.type]
})
const blockTitle = computed(() => {
	return props.block.title === ""
		? blockConfig.value.title
		: props.block.title
})
const blockIcon = computed(() => {
	return blockConfig.value.icon
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

	for (let i = 0; i < values.length; i++) {
		const media = values[i].split(":") // ["md", "2b+i"]
		if (media.length !== 2) {
			continue
		}

		if (["md", "lg", "xl"].indexOf(media[0]) !== -1) {
			if (media[1].includes("+")) {
				// md:b+i or md:3b+i or ...
				const value = media[1].split("+"), // ["2b", "i"]
					sizes = [
						value[0].slice(0, -1) === ""
							? 1
							: +value[0].slice(0, -1),
						value[1].slice(0, -1) === ""
							? 1
							: +value[1].slice(0, -1)
					] // [2, 1]

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
								`${media[0]}:order-${j + 1} ${
									media[0]
								}:col-span-${sizes[j]}`
							)
						} else {
							illustration.push(
								`${media[0]}:order-${j + 1} ${
									media[0]
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

const postData = inject('postData', ref({}))
// const { blockData, random } = useBlock(props.block)
const random = ref(1)
const blockData = computed(()=>{try {
	// Remove the existing events
	// if (events.length > 0) {
	// 	for (const [key, value] of Object.entries(events[0])) {
	// 		document.removeEventListener(key, value, false)
	// 	}
	// }

	// Run the script if there is one.
	if (props.block.script !== null && random.value > 0) {
		const F = new Function(
			"PiMath",
			"postData",
			"iteration",
			props.block.script
		)

		const result = F(PiMath, postData.value, random.value)

		// // Store events for later removal
		// if (result.events !== undefined) {
		// 	events = result.events
		//
		// 	// Load the events.
		// 	Object.keys(events).forEach((key) => {
		// 		document.addEventListener(key, events[key], false)
		// 	})
		//
		// }

		return {
			...postData.value,
			...result
		}
	}
} catch (e) {
	console.warn("BlockShow (script generation)", e)
	return {}
}

	return {}
})
const blockBody = computed(()=>useFormattedBody(props.block.body, blockData))
provide("blockData", blockData)

//
// const { bodyData, iteration, blockScript } = useDataMaker()
//
// onMounted(()=>{
// 	blockScript(props.block.script)
// })
</script>

<template>
	<article
		:id="`block-${block.id}`"
		:class="blockConfig.style.body"
		class="rounded bg-white"
	>
		<BlockShowAdmin :block="block" />

		<!-- header -->
		<div
			v-show="blockTitle || 1===1"
			:class="blockConfig.style.header"
			class="flex justify-between w-full px-5 py-3 mb-3 text-xl"
		>
			<!-- header left: (generic) icon and title -->
			<div class="flex gap-3 items-baseline">
				<i
					v-if="blockIcon"
					:class="blockIcon"
				/>
				<h3 v-katex.auto="blockTitle" />
			</div>

			<!-- buttons for randomize and more... -->
			<block-body-buttons
				v-model="random"
				:block-data="blockData"
			/>
		</div>

		<!-- body -->
		<div
			:class="blockTemplate.grid + (groupIndex>0 || (!block.title && !block.type)?' pt-3':'')"
			class="px-5 pb-2"
		>
			<markdown-it
				v-if="blockBody !== null"
				:class="blockTemplate.block"
				:text="blockBody"
			/>

			<!-- Block illustrations -->
			<div
				v-if="block.illustrations.length > 0"
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
	</article>
</template>
