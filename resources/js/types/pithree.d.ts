// Déclaration de repli pour `pithree` : le package publie des types dans
// `types/index.d.ts`, mais son champ `exports` de package.json empêche TypeScript
// de les résoudre (TS7016). Ce stub fournit un module ambiant de secours exposant
// les classes réellement utilisées côté application.
// À retirer si le package corrige son mapping `exports`/`types`.
declare module "pithree" {
	export class Pi3Draw {
		constructor(container: unknown, options: unknown)

		mount(): Pi3Draw

		onResize(): void

		refreshLayout(parameters: string): void

		refresh(code: string): void
	}

	export class Pi3Graph {
		constructor(...args: unknown[])
	}
}
