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

			const msg = {
				id: crypto.randomUUID(),
				message,
				type,
				config: {
					duration: 1000 * 2,
					...config
				}
			}

			messages.value.push(msg)
			
			setTimeout(() => close(msg), msg.config.duration)
		}

		function close(message: flashMessageInterface) {
			const index = messages.value.findIndex(msg => msg.id === message.id)

			if (index === -1) return

			messages.value.splice(index, 1)
		}

		return {
			messages,
			add: addFlashMessage,
			success: (message: string, config?: flashConfig) =>
				addFlashMessage(message, "success", config),
			info: (message: string, config?: flashConfig) =>
				addFlashMessage(message, "info", config),
			error: (message: string, config?: flashConfig) =>
				addFlashMessage(message, "error", config),
			close
		}
	}
)
