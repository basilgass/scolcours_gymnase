import {createApp, h} from "vue"
import {createInertiaApp, Head, Link} from "@inertiajs/vue3"
import draggableComponent from "vuedraggable/src/vuedraggable.js"

// Custom directives
import {adminDirective, katexDirective, visibleDirective} from "@/vueDirectives"

require("./bootstrap")

const appName = window.document.getElementsByTagName("title")[0]?.innerText || "ScolCours"


createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	resolve: name => import(`./Pages/${name}`),
	setup({el, App, props, plugin}) {
		const vueApp = createApp(
			{render: () => h(App, props)})
			.component("Link", Link)
			.component("Head", Head)
			.component("draggable", draggableComponent)
			.use(plugin)
			.directive("katex", katexDirective)
			.directive("visible", visibleDirective)
			.directive("admin", adminDirective)
			.mixin({methods: {route}})

		// Custom function available as 	$fnName
		vueApp.config.globalProperties.$log = console.log

		return vueApp.mount(el)
	},
	progress: {color: "#4B5563"}
})
