import { computed, inject, provide, ref, unref } from "vue"
import { PiMath } from "pimath/esm"
import { useFormattedBody } from "@/Composables/useHelpers"
import { BlockInterface } from "@/types/modelInterfaces"

export function useBlock(blockMaybeRef: BlockInterface) {
	const block = unref(blockMaybeRef)

	const random = ref(1),
		postData = inject("postData", { value: {} }),
		blockData = computed(() => {
			try {
				if (block.script !== null && random.value > 0) {
					const F = new Function(
						"PiMath",
						"postData",
						"iteration",
						block.script,
					)

					return {
						...postData.value,
						...F(PiMath, postData.value, random.value),
					}
				}
			} catch (e) {
				console.warn("BlockShow (script generation)", e)
			}

			return { ...postData.value }
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
					show: true,
				},
				resetBtn: boolean | object = false

			if (blockData.value.reset) {
				resetBtn = {
					icon: "bi bi-x-square",
					text: "par défaut",
					show: random.value > 1,
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
								: random.value === 1,
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
							blockData.value.btn.reset.show ?? random.value > 1,
					}
				}
			}

			return {
				random: randomBtn,
				reset: resetBtn,
			}
		})

	provide("blockData", blockData)
	return { random, blockBody, blockButtons, blockData, postData }
}
