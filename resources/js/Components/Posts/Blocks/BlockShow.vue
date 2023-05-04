<!--
Affichage d'un block , avec toutes les possibilités
-->
<template>
	<article
		v-show="showBlock"
		:class="theBlock.type !== '' ? `block-border-${theBlock.type}` : ''"
	>
		<button
			v-if="isBlur"
			v-katex.auto.inline="blockTitle === '' ? 'afficher' : blockTitle"
			class="w-full"
			:class="`active-scolcours-${$page.props.theme.slug}`"
			@click="isBlur = false"
		/>
		<div v-else>
			<!-- Block title (if exist) -->
			<div class="flex justify-between w-full px-5 block-header">
				<h3 v-katex.auto="blockTitle" />

				<div class="flex gap-3">
					<transition name="slide-fade">
						<div v-if="blockData.reset && random > 1">
							<button
								:class="`btn-scolcours-${$page.props.theme.slug} btn-xs tracking-wider d-block`"
								@click="random = 1"
							>
								<i class="bi bi-x-square mr-2" />par défaut
							</button>
						</div>
					</transition>

					<button
						v-if="theBlock.script"
						:class="`btn-scolcours-${$page.props.theme.slug} btn-xs tracking-wider`"
						@click="random++"
					>
						<i class="bi bi-shuffle mr-2" />aléatoire
					</button>

					<div
						v-show="editMode.enabled.value"
						v-admin
					>
						<button
							class="text-xs mr-2"
							@click="showEditForm = true"
						>
							{{ theBlock.id }} <i class="bi bi-pencil ml-2" />
						</button>

						<button class="draggable-handle text-xs px-1">
							<i class="bi bi-arrows-move" />
						</button>
					</div>
				</div>
			</div>

			<div
				:class="blockTemplate.grid"
				class="px-5"
			>
				<!-- Block body -->
				<markdown-it
					:class="blockTemplate.block"
					:text="blockBody"
				/>

				<!-- Block illustrations -->
				<div
					v-if="
						theBlock.illustrations.length > 0 ||
							$page.props.auth.can.admin
					"
					:class="blockTemplate.illustration"
				>
					<draggable
						v-model="theBlock.illustrations"
						:class="{
							'md:grid-cols-2 xl:grid-cols-3':
								theBlock.illustrations.length >= 2,
							'xl:grid-cols-2':
								theBlock.illustrations.length === 2,
							'w-full': theBlock.illustrations.length === 1,
						}"
						class="grid grid-cols-1 gap-3 my-5"
						handle=".draggable-handle"
						item-key="id"
						v-bind="{
							animation: 200,
							disabled: !$page.props.auth.can.admin,
						}"
						@end="updateIllustrationsOrder"
					>
						<template #item="{ element }">
							<illustration-show
								:illustration="element"
								@destroy="destroyIllustration"
							/>
						</template>
						<template #footer>
							<button
								v-show="editMode.enabled.value"
								v-admin
								class="btn-new-inline"
								@click="addIllustration"
							>
								ajouter une illustration
							</button>
						</template>
					</draggable>
				</div>
			</div>
		</div>
		<!-- Edit form -->
		<div
			v-if="showEditForm"
			v-admin
		>
			<component
				:is="editForm"
				v-model="showEditForm"
				:block="theBlock"
				:max-illustration="maxIllustration"
				@change="updateBlock"
				@destroy="emits('destroy', $event)"
			/>
		</div>
	</article>
</template>

<script setup>
import MarkdownIt from "@/Components/Ui/MarkdownIt"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import { computed, defineAsyncComponent, inject, provide, ref } from "vue"
import { PiMath } from "pimath/esm"
import { useFormattedBody } from "@/Composables/useHelpers"
import { useBlockTypes } from "@/scolcours"

const emits = defineEmits(["destroy"])
let props = defineProps({
		block: { type: Object, required: true },
		switch: { type: Boolean },
		maxIllustration: { type: Number, default: null },
	}),
	theBlock = ref(props.block),
	isBlur = ref(props.block.blur),
	showBlock = computed(() => {
		// if(usePage().props.value.auth.can.admin){return true}

		if (theBlock.value.switch === null) {
			return true
		}
		return Boolean(theBlock.value.switch) === Boolean(props.switch)
	}),
	flash = inject("flash"),
	editMode = inject("editMode")

const blockTypes = useBlockTypes,
	blockTitle = computed(() => {
		if (theBlock.value.title) {
			return theBlock.value.title
		}

		if (blockTypes[theBlock.value.type] !== undefined) {
			return blockTypes[theBlock.value.type].text
		}

		return ""
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
					grid.push(`${media[0]}:grid-cols-${sizes[0] + sizes[1]}`)

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
			illustration: illustration.join(" "),
		}
	})

let random = ref(1),
	postData = inject("postData", {}),
	blockData = computed(() => {
		try {
			if (props.block.script !== null && random.value > 0) {
				let F = new Function(
					"PiMath",
					"postData",
					"iteration",
					props.block.script
				)
				return {
					...postData.value,
					...F(PiMath, postData.value, random.value),
				}
			}
		} catch (e) {
			console.log("BlockShow (script generation)", e)
		}

		return { ...postData.value }
	}),
	blockBody = computed(() => {
		return useFormattedBody(props.block.body, blockData)
	})

provide("blockData", blockData)

let showEditForm = ref(props.block?.isNew === true),
	editForm = computed(() => {
		return defineAsyncComponent(() =>
			import("@/Components/Posts/Blocks/BlockForm.vue")
		)
	}),
	updateBlock = function (b) {
		theBlock.value = b
	},
	addIllustration = function () {
		axios
			.post(route("blocks.illustrations.store", [props.block.id]), {})
			.then((res) => {
				res.data.isNew = true
				theBlock.value.illustrations.push(res.data)
				// edit the new illustration.

				flash.add("une nouvelle illustration a été créée")
			})
	},
	updateIllustrationsOrder = function () {
		axios
			.post(route("blocks.illustrations.order", [props.block.id]), {
				order: theBlock.value.illustrations.map(
					(illustration, index) => {
						return {
							id: illustration.id,
							order: index + 1,
						}
					}
				),
				_method: "PATCH",
			})
			.then((res) => {
				// TODO : flash message !
				flash.add("les illustrations ont bien été réordrées !")
			})
			.catch((res) =>
				console.log("update ordering illustrations: ", res)
			)
	},
	destroyIllustration = function (destroyId) {
		theBlock.value.illustrations = theBlock.value.illustrations.filter(
			(x) => x.id !== destroyId
		)
	}
</script>
