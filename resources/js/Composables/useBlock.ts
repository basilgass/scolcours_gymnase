import { computed, inject, onMounted, onUnmounted, provide, Ref, ref, unref } from "vue"
import { PiMath } from "pimath"
import { useFormattedBody } from "@/Composables/useHelpers"
import type { BlockInterface } from "@/types/modelInterfaces"

//TODO: reformat useBlock

export function useBlock(blockMaybeRef: BlockInterface | Ref<BlockInterface>) {
	// The block to be edited.
	const block = unref(blockMaybeRef)

	let events: { [Key: string]: EventListener }[] = []
	const random = ref(1),
		postData = inject<Ref<{Object}>>("postData"),
		eventData = ref({}),
		blockData = computed(() => {
			try {
				// Remove the existing events
				if (events.length > 0) {
					for (const [key, value] of Object.entries(events[0])) {
						document.removeEventListener(key, value, false)
					}
				}

				// Run the script if there is one.
				if (block.script !== null && random.value > 0) {
					const F = new Function(
						"PiMath",
						"postData",
						"iteration",
						block.script
					)

					const result = F(PiMath, postData.value, random.value)

					// Store events for later removal
					if (result.events !== undefined) {
						events = result.events

						// Load the events.
						Object.keys(events).forEach((key) => {
							document.addEventListener(key, events[key], false)
						})

					}

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
			// return { ...postData.value }
		}),
		blockBody = computed(() => {
			return useFormattedBody(block.body, blockData)
		}),
		blockButtons = computed(() => {
			const showRandom = block.script,
				hasCustomButtons = blockData.value.btn !== undefined

			// No random buttons
			if (!showRandom) {
				return false
			}

			// Default values
			let randomBtn = {
					icon: "bi bi-shuffle",
					text: "aléatoire",
					show: true
				},
				resetBtn: boolean | object = false

			if (blockData.value.reset) {
				resetBtn = {
					icon: "bi bi-x-square",
					text: "par défaut",
					show: random.value > 1
				}
			}

			// Custom buttons
			if (hasCustomButtons) {
				// Random button
				if (blockData.value.btn.random) {
					randomBtn = {
						icon: blockData.value.btn.random.icon ?? "",
						text:
							blockData.value.btn.random.text ??
							blockData.value.btn.random,
						show:
							blockData.value.btn.random.show === undefined ||
							blockData.value.btn.random.show
								? true
								: random.value === 1
					}
				}

				// Reset button
				if (blockData.value.btn.reset) {
					resetBtn = {
						icon: blockData.value.btn.reset.icon ?? "",
						text:
							blockData.value.btn.reset.text ??
							blockData.value.btn.reset,
						show:
							blockData.value.btn.reset.show ?? random.value > 1
					}
				}
			}

			return {
				random: randomBtn,
				reset: resetBtn
			}
		})

	// TODO : Work with event listener to make illustration more interactive !
	const illustrationListener = (e: CustomEvent) => {
		eventData.value = e.detail
	}

	onMounted(() => {
		document.addEventListener("illustration.change", illustrationListener, false)
	})
	onUnmounted(() => {
		document.removeEventListener("illustration.change", illustrationListener, false)
		// Remove the existing events
		if (events.length > 0) {
			for (const [key, value] of Object.entries(events[0])) {
				document.removeEventListener(key, value, false)
			}
		}
	})


	provide("blockData", blockData)
	return { random, blockBody, blockButtons, blockData, postData }
}
