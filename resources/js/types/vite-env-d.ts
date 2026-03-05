/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_URL: string
	// ajoute ici d'autres variables VITE_ au fur et à mesure
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
