<!--
Affichage d'un block , avec toutes les possibilités
-->
<script setup>
	import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
	import { computed, inject, ref } from "vue"
	import { blockTypeDefault, blockTypes } from "@/scolcours"
	import IllustrationsIndex from "@/Components/Posts/Illustrations/IllustrationsIndex.vue"
	import BlockEdit from "@/Components/Posts/Blocks/BlockEdit.vue"
	import { useBlock } from "@/Components/Posts/Blocks/useBlock"
	import BlockBodyButtons from "@/Components/Posts/Blocks/BlockBodyButtons.vue"

	// Props
	const props = defineProps({
		block: { type: Object, required: true },
		switch: { type: Boolean, default: null },
		forceShow: { type: Boolean, default: false },
		maxIllustration: { type: Number, default: null },
		noDelete: { type: Boolean, default: false },
	})

	// Reactive edition mode (admin only)
	let editMode = inject("editMode")

	// Reactive Refs
	let theBlock = ref(props.block)

	// Reactive GUI
	let isBlur = ref(props.block.blur),
		showBlock = computed(() => {
			if (props.forceShow) return true

			if (theBlock.value.switch === null) return true

			return Boolean(theBlock.value.switch) === Boolean(props.switch)
		})

	// Block display style computed properties
	const blockConfig = computed(() => {
			return blockTypes[theBlock.value.type] === undefined
				? blockTypeDefault
				: blockTypes[theBlock.value.type]
		}),
		blockExtraStyle = computed(() => {
			let extraClass = ""
			if (editMode.enabled.value) {
				extraClass += " border border-dashed border-gray-400"
			}

			if (blockTitle.value !== "" && theBlock.value.order > 0) {
				extraClass += " mt-10"
			}

			return extraClass
		}),
		blockTitle = computed(() => {
			return theBlock.value.title === ""
				? blockConfig.value.title
				: theBlock.value.title
		}),
		blockIcon = computed(() => {
			return blockConfig.value.icon
		}),
		blockTemplate = computed(() => {
			if (!theBlock.value.template) {
				return {
					grid: "grid grid-cols-1 gap-3",
					block: "",
					illustration: "",
				}
			}

			const values = theBlock.value.template
				.split(",")
				.filter((x) => x !== "")
			// pattern is:
			// bi,md:b+i,lg:2b+i,xl:i+3b
			if (values.length === 0) {
				return {
					grid: "grid grid-cols-1 gap-3",
					block: "",
					illustration: "",
				}
			}

			let grid = ["grid grid-cols-1 gap-3"],
				block = [
					values[0][0] === "b"
						? "order-1 col-span-1"
						: "order-2 col-span-1",
				],
				illustration = [
					values[0][0] === "i"
						? "order-1 col-span-1"
						: "order-2 col-span-1",
				]

			for (let i = 1; i < values.length; i++) {
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
									: +value[1].slice(0, -1),
							] // [2, 1]

						// define grid size for the media query
						grid.push(
							`${media[0]}:grid-cols-${sizes[0] + sizes[1]}`,
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
										}:col-span-${sizes[j]}`,
									)
								} else {
									illustration.push(
										`${media[0]}:order-${j + 1} ${
											media[0]
										}:col-span-${sizes[j]}`,
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
								: `${media[0]}:order-2 ${media[0]}:col-span-1`,
						)
						illustration.push(
							media[1][0] === "i"
								? `${media[0]}:order-1 ${media[0]}:col-span-1`
								: `${media[0]}:order-2 ${media[0]}:col-span-1`,
						)
					}
				}
			}

			return {
				grid: grid.join(" "),
				block: block.join(" "),
				illustration: illustration.join(" "),
			}
		})

	const { blockBody, blockButtons, random } = useBlock(theBlock)
</script>

<template>
	<article
		v-if="showBlock"
		:id="`block-${props.block.id}`"
		:class="blockConfig.style.body + blockExtraStyle"
	>
		<button
			v-if="isBlur"
			v-katex.auto.inline="blockTitle === '' ? 'afficher' : blockTitle"
			:class="`active-scolcours-${$page.props.theme.slug}`"
			class="w-full px-5 py-4 border-t border-b"
			@click="isBlur = false"
		/>
		<div v-else>
			<block-edit
				v-show="editMode.enabled.value"
				v-admin
				:block="theBlock"
			/>
			<div
				v-show="editMode.enabled.value || blockTitle || blockButtons"
				:class="blockConfig.style.header"
				class="flex justify-between w-full px-5 py-3 mb-3 text-xl"
			>
				<div class="flex gap-3">
					<i v-if="blockIcon" :class="blockIcon" />
					<h3 v-katex.auto="blockTitle" />
				</div>

				<div class="flex items-end gap-3">
					<BlockBodyButtons
						v-model="random"
						:buttons="blockButtons"
					/>
				</div>
			</div>

			<div :class="blockTemplate.grid" class="px-5">
				<!-- Block body -->
				<markdown-it
					v-if="blockBody !== null"
					:class="blockTemplate.block"
					:text="blockBody"
				/>

				<!-- Block illustrations -->
				<div
					v-if="
						theBlock.illustrations.length > 0 ||
							editMode.enabled.value
					"
					:class="blockTemplate.illustration"
				>
					<illustrations-index
						:container-id="theBlock.id"
						:grid="theBlock.illustrationsGrid"
						:illustrations="theBlock.illustrations"
						container-type="Block"
					/>
				</div>
			</div>
		</div>
	</article>
</template>
