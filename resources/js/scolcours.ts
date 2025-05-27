import { defineAsyncComponent } from "vue"

export const ToolsModules = import.meta.glob("./Components/Tools/*.vue", {
	eager: false,
})
export const KeyboardsModules = import.meta.glob([
	"./Components/Keyboards/*.vue",
	"!./Components/Keyboards/KeyboardDisplay.vue",
])
export const IllustrationsModules = import.meta.glob([
	"./Components/Posts/Illustrations/Elements/*.vue",
])
export const WidgetsModules = import.meta.glob([
	"./Components/Widgets/*.vue",
	"./Components/Widgets/*/*.vue",
])

export const FormElementComponents = Object.fromEntries(
	Object.entries(
		import.meta.glob(
			"./Components/Form/FormElements/*.vue"
		)
	).map(([path, loader])=>{
		const name = path
			.split('/Components/Form/FormElements/FormElement')[1].split('.vue')[0].toLowerCase()
		return [name, loader]
	})
)
export const DevsModules = import.meta.glob("./Components/Devs/*.vue")

const dynamicModules = {
	tools: {
		path: "./Components/Tools/",
		modules: ToolsModules,
	},
	keyboards: {
		path: "./Components/Keyboards/",
		modules: KeyboardsModules,
	},
	illustrations: {
		path: "./Components/Posts/Illustrations/Elements/",
		modules: IllustrationsModules,
	},
	widgets: {
		path: "./Components/Widgets/",
		modules: WidgetsModules,
	},
	dev: {
		path: "./Components/Devs/",
		modules: DevsModules,
	},
}

export enum MODULE_TYPES {
	ILLUSTRATION = "illustrations",
	WIDGET = "widgets",
	TOOLS = "tools",
	KEYBOARD = "keyboards",
	DEV = "dev",
}

export function getModule(key: string, type: MODULE_TYPES) {
	if (key === null || key === undefined) return null

	const path = `${dynamicModules[type].path}${key}${key.endsWith('.vue') ? '' : '.vue'}`

	if (
		Object.hasOwn(dynamicModules, type) &&
		Object.hasOwn(dynamicModules[type].modules, path)
	) {

		return defineAsyncComponent(
			dynamicModules[type].modules[path],
		)
	}
	return null
}

export const graduateBackgroundColor = [
	"rgba(255, 99, 132, 0.2)",	// 1
	"rgba(255, 99, 132, 0.2)",	// 1.5
	"rgba(255, 99, 132, 0.2)",	// 2
	"rgba(255, 159, 64, 0.2)",	// 2.5
	"rgba(255, 159, 64, 0.2)",	// 3
	"rgba(255, 205, 86, 0.2)",	// 3.5
	"rgba(54, 162, 235, 0.2)",	// 4
	"rgba(54, 162, 235, 0.2)",	// 4.5
	"rgba(75, 192, 192, 0.2)",	// 5
	"rgba(75, 192, 192, 0.2)",	// 5.5
	"rgba(40,210,72,0.2)",		// 6
]
export const graduateBorderColor = [
	"rgb(255, 99, 132)",	// 1
	"rgb(255, 99, 132)",	// 1.5
	"rgb(255, 99, 132)",	// 2
	"rgb(255, 159, 64)",	// 2.5
	"rgb(255, 159, 64)",	// 3
	"rgb(255, 205, 86)",	// 3.5
	"rgb(54, 162, 235)",	// 4
	"rgb(54, 162, 235)",	// 4.5
	"rgb(75, 192, 192)",	// 5
	"rgb(75, 192, 192)",	// 5.5
	"rgb(201, 203, 207)",	// 6
]

