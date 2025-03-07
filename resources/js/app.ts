import "./bootstrap"
import "../css/app.css"
import { adminDirective } from "@/directives/adminDirectives"
import { katexDirective } from "@/directives/katexDirectives"
import { themeDirective } from "@/directives/themeDirectives"
import { createInertiaApp, Head, Link } from "@inertiajs/vue3"
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers"
import { createPinia } from "pinia"

import { createApp, DefineComponent, h } from "vue"
import draggableComponent from "vuedraggable/src/vuedraggable.js"

import { ZiggyVue } from "../../vendor/tightenco/ziggy"
import {useDark} from "@vueuse/core"

const pinia = createPinia()

// Enable dark mode
useDark()

// import route from "ziggy-js"
// const appName =
// 	window.document.getElementsByTagName("title")[0]?.innerText || "ScolCours"

createInertiaApp({
	title: (title) => {
		return title ? `${title} - ScolCours` : `ScolCours`
	},
	resolve: (title) =>
		resolvePageComponent(
			`./Pages/${title}.vue`,
			import.meta.glob<DefineComponent>("./Pages/**/*.vue")
		),
	setup({ el, App, props, plugin }) {
		const app = createApp({ render: () => h(App, props) })

		// Add global components
		app.component("InertiaLink", Link)
			.component("Head", Head)
			.component("draggable", draggableComponent)
			.use(plugin)
			.use(ZiggyVue, Ziggy)
			.use(pinia)

		// add directives
		app.directive("katex", katexDirective)
			.directive("admin", adminDirective)
			.directive("theme", themeDirective)
			.mixin({ methods: { route } })

		// Mount the app.
		app.mount(el)
	},
	progress: { color: "#409f40" }
})

