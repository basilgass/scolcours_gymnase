import "./bootstrap"
import "../css/app.css"

import { createApp, DefineComponent, h } from "vue"
import { createInertiaApp, Head, Link } from "@inertiajs/vue3"
import draggableComponent from "vuedraggable/src/vuedraggable.js"
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers"
import { ZiggyVue } from "../../vendor/tightenco/ziggy/dist/vue.m"
import { katexDirective } from "@/directives/katexDirectives"
import { adminDirective } from "@/directives/adminDirectives"
import { themeDirective } from "@/directives/themeDirectives"
import { useEditMode } from "./Composables/useEditMode"

// import route from "ziggy-js"
const appName =
	window.document.getElementsByTagName("title")[0]?.innerText || "ScolCours"

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
		app.component("Link", Link)
			.component("Head", Head)
			.component("draggable", draggableComponent)
			.use(plugin)
			.use(ZiggyVue, Ziggy)

		// add directives
		app.directive("katex", katexDirective)
			.directive("admin", adminDirective)
			.directive("theme", themeDirective)
			.mixin({ methods: { route } })

		// Provide global variables
		const editMode = useEditMode()
		app.provide("editMode", editMode)



		// Mount the app.
		app.mount(el)
	},
	progress: { color: "#409f40" }
})

