import "./bootstrap"
import "../css/app.css"

import {createApp, DefineComponent, h} from "vue"
import {createInertiaApp, Head, Link} from "@inertiajs/vue3"
import draggableComponent from "vuedraggable/src/vuedraggable.js"
import {resolvePageComponent} from "laravel-vite-plugin/inertia-helpers"
import {ZiggyVue} from "../../vendor/tightenco/ziggy/dist/vue.m"
import {defaultConfig, plugin as formKitPlugin} from "@formkit/vue";
import formKitConfig from "../../formkit.config";
// Custom directives
import {adminDirective, katexDirective, themeDirective, visibleDirective} from "@/vueDirectives"

// import route from "ziggy-js"
const appName = window.document.getElementsByTagName("title")[0]?.innerText || "ScolCours"

createInertiaApp({
	title: (title) => {
		return title?
			`${title} - ${appName}`:
			`${appName}`
	},
	resolve: (title)=>
        resolvePageComponent(
            `./Pages/${title}.vue`,
            import.meta.glob<DefineComponent>("./Pages/**/*.vue")
    ),
	setup({el, App, props, plugin}) {

		createApp(
			{render: () => h(App, props)})
			.component("Link", Link)
			.component("Head", Head)
			.component("draggable", draggableComponent)
			.use(plugin)
			.use(ZiggyVue, Ziggy)
			.use(formKitPlugin, defaultConfig(formKitConfig))
			.directive("katex", katexDirective)
			.directive("visible", visibleDirective)
			.directive("admin", adminDirective)
			.directive("theme", themeDirective)
			.mixin({methods: {route}})
			.mount(el)
	},
	progress: {color: "#4B5563"}
})
