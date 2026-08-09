import {mount, VueWrapper} from "@vue/test-utils"
import {Component} from "vue"
import {createPinia, setActivePinia} from "pinia"
import {questionDataInterface, questionDataKey} from "@/Components/Questions/QuestionInterface.ts"

/**
 * Helper de montage partagé pour les tests de composants Vue (phase F3).
 *
 * Il centralise trois neutralisations indispensables, sinon `mount()` jette :
 *  - les directives globales custom (`v-katex`, `v-admin`, `v-theme`, cf.
 *    app.ts) remplacées par des no-op qui absorbent args/modificateurs ;
 *  - le store Pinia, ré-initialisé pour chaque montage (les composants
 *    appellent `useStoreEditMode()` au setup) ;
 *  - la résolution de route Ziggy (`route()` dans les templates), isolée
 *    derrière `mockRoute` — COUTURE UNIQUE : la future bascule vers Laravel
 *    Wayfinder ne touchera que cette fonction, pas les tests qui assertent
 *    l'URL rendue.
 */

/**
 * Couture route (seam). Produit une URL déterministe à partir du nom et des
 * paramètres, de sorte qu'un test puisse asserter le `href` rendu sans dépendre
 * du manifeste Ziggy. Point de bascule futur Ziggy -> Wayfinder.
 */
export function mockRoute(
	name: string,
	params?: Record<string, unknown> | unknown[] | string | number,
): string {
	if (params === undefined || params === null) {
		return `/${name}`
	}

	const flat = Array.isArray(params)
		? params.join("/")
		: typeof params === "object"
			? Object.values(params).join("/")
			: String(params)

	return `/${name}/${flat}`
}

interface MountComponentOptions {
	props?: Record<string, unknown>
	slots?: Record<string, unknown>
	provide?: Record<string | symbol, unknown>
	/** Injecte le contexte questionData (provide/inject) attendu par les Question Parts. */
	questionData?: questionDataInterface
	/** Stubs d'enfants lourds à isoler (BlockShow, QuestionsIndex, ...). */
	stubs?: Record<string, unknown>
}

export function mountComponent(
	component: Component,
	options: MountComponentOptions = {},
): VueWrapper<any> {
	setActivePinia(createPinia())

	const provide: Record<string | symbol, unknown> = {...(options.provide ?? {})}
	if (options.questionData) {
		provide[questionDataKey as symbol] = options.questionData
	}

	// Cast au point d'appel : typer le paramètre en `Component` (large) fait
	// exploser la résolution de surcharges de `mount` (union trop complexe,
	// TS2590). Le cast sélectionne la voie générique et rend VueWrapper<any>.
	return mount(component as any, {
		props: options.props,
		slots: options.slots,
		global: {
			directives: {
				// katex rend la valeur liée dans le DOM ; on reproduit ce contrat en
				// écrivant la valeur en textContent, afin que les tests puissent asserter
				// le format/les messages sans dépendre de la lib KaTeX réelle.
				katex: {
					mounted: (el: HTMLElement, binding: {value: unknown}) => {
						el.textContent = String(binding.value ?? "")
					},
					updated: (el: HTMLElement, binding: {value: unknown}) => {
						el.textContent = String(binding.value ?? "")
					},
				},
				admin: {},
				theme: {},
			},
			mocks: {
				route: mockRoute,
			},
			provide,
			stubs: options.stubs,
		},
		// Options relâchées : ce helper est un wrapper générique ; les types
		// stricts de ComponentMountingOptions dépendent du composant concret,
		// hors de portée d'une signature unique.
	} as any)
}
