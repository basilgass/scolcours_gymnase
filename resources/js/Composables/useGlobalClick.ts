// composables/useGlobalClick.ts
import {onMounted, onUnmounted} from 'vue'

type Handler = (event: MouseEvent) => void

const listeners = new Map<string, Handler>()

function onGlobalClick(event: MouseEvent) {
	for (const handler of listeners.values()) {
		handler(event)
	}
}

let isBound = false

export function useGlobalClick(id: string, handler: Handler) {
	onMounted(() => {
		listeners.set(id, handler)
		if (!isBound) {
			window.addEventListener('click', onGlobalClick)
			isBound = true
		}
	})

	onUnmounted(() => {
		listeners.delete(id)
		if (listeners.size === 0 && isBound) {
			window.removeEventListener('click', onGlobalClick)
			isBound = false
		}
	})

}
