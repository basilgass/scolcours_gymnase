// useMermaidDispatcher.ts


type MermaidHandler = (id: string, event:MouseEvent) => void

export interface MermaidEmits {
	nodeClick: [nodeId: string, event: MouseEvent]
}

const callbacks = new Map<string, MermaidHandler>()

declare global {
	interface Window {
		mermaidClickDispatcher?: (nodeId: string, event: MouseEvent) => void
	}
}

// Définir immédiatement la fonction globale
if (typeof window !== 'undefined' && typeof window.mermaidClickDispatcher !== 'function') {
	window.mermaidClickDispatcher = (nodeId: string, event: MouseEvent) => {
		for (const [, cb] of callbacks) {
			cb(nodeId, event)
		}
	}
}

export function registerMermaidHandler(id: string, cb: MermaidHandler) {
	callbacks.set(id, cb)
}

export function unregisterMermaidHandler(id: string) {
	callbacks.delete(id)
}
