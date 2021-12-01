import { createApp, h } from "vue"
import { createInertiaApp, Head, Link } from "@inertiajs/inertia-vue3"
import { InertiaProgress } from "@inertiajs/progress"

// Custom directives
import { katexDirective } from "@/vueDirectives"
// import LayoutFullpage from "@/Pages/Shared/LayoutFullpage"
// import LayoutMain from "@/Pages/Shared/LayoutMain"

require("./bootstrap")

const appName = window.document.getElementsByTagName("title")[0]?.innerText || "ScolCours"
createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	// resolve: (name) => {
	// 	const page = require(`./Pages/${name}.vue`).default
	// 	page.layout = name === "Welcome" ? LayoutFullpage : LayoutMain
	// 	return page
	// },
	resolve: name => import(`./Pages/${name}`),
	setup({el, app, props, plugin}) {
		const vueApp = createApp(
			{render: () => h(app, props)})
			.component("Link", Link)
			.component("Head", Head)
			.use(plugin)
			.directive("katex", katexDirective)
			.mixin({methods: {route}})

		vueApp.config.globalProperties.$log=console.log

		return vueApp.mount(el)
	},
})

InertiaProgress.init({color: "#4B5563"})
