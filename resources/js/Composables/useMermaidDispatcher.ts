// useMermaidDispatcher.ts
type MermaidHandler = (id: string) => void

const callbacks = new Map<string, MermaidHandler>()

declare global {
	interface Window {
		mermaidClickDispatcher?: (nodeId: string) => void
	}
}

// Définir immédiatement la fonction globale
if (typeof window !== 'undefined' && typeof window.mermaidClickDispatcher !== 'function') {
	window.mermaidClickDispatcher = (nodeId: string) => {
		for (const [, cb] of callbacks) {
			cb(nodeId)
		}
	}
}

export function registerMermaidHandler(id: string, cb: MermaidHandler) {
	callbacks.set(id, cb)
}

export function unregisterMermaidHandler(id: string) {
	callbacks.delete(id)
}
