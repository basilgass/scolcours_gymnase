import {defineStore} from "pinia"
import {flashConfig, flashMessageInterface, flashType} from "@/types"
import {ref} from "vue"

export const useStoreFlashMessage = defineStore(
	'flashMessage',
	() => {

		const messages = ref<flashMessageInterface[]>([])

		function addFlashMessage(
			message: string,
			type: flashType,
			config: flashConfig = {}
		) {
			messages.value.push({
					id: null,
					message,
					type,
					config: {
						timeout: 1000 * 2,
						...config
					}
				}
			)
		}

		return {
			messages,
			add: addFlashMessage,
			success: (message: string, config?: flashConfig) =>
				addFlashMessage(message, "success", config),
			info: (message: string, config?: flashConfig) =>
				addFlashMessage(message, "info", config),
			error: (message: string, config?: flashConfig) =>
				addFlashMessage(message, "error", config)
		}
	}
)
