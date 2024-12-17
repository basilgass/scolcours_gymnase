import {usePage} from "@inertiajs/vue3"


function themeUpdate(el, binding) {
	const themes = usePage().props.themes.map((theme) => theme.slug)

	const keys = ["btn", "bg", "text", "border", "active", "scrollbar", "hover"]

	let chapter: string

	// Remove all classes from el matching the pattern "<key>-scolcours-<theme>"
	if (el) {
		keys.forEach((key) => {
			el.classList.remove(new RegExp(`${key}-scolcours-[${themes.join('|')}]`))
		})
	}

	if (binding.value === false || binding.value === 0 || binding.value === "") return

	if (
		Object.hasOwn(binding.modifiers, "admin") ||
		binding.value === "admin"
	) {
		chapter = "admin"
	} else if (themes.indexOf(binding.value) !== -1) {
		chapter = binding.value
	} else if (typeof binding.value === "number") {
		// it's a number -> get the theme id.
		const theme = usePage().props.themes.filter(
			(th) => +th.id === +binding.value
		)

		if (theme.length === 1) {
			chapter = theme[0].slug
		}
	} else {
		chapter = usePage().props?.theme?.slug

		if (chapter === undefined && (typeof binding.value === 'string')) {
			el.classList.add(...binding.value.split(' '))
			return
		}
	}

	// No chapter giver -> use main
	if (chapter === undefined) chapter = 'main'

	Object.keys(binding.modifiers).forEach((key) => {
		console.log(key)
		if (keys.indexOf(key) !== -1) {
			if (key === "text" && Object.hasOwn(binding.modifiers, "bg")) {
				el.classList.add("text-white")
			} else if (key === "hover") {
				console.log('ADDING HOVER CLASSES')
				el.classList.add(
					`hover:bg-${chapter}-50`,
					`hover:border-${chapter}-500`,
					`hover:text-${chapter}-500`,
					'transition-colors',
					'duration-300'
				)
			} else {
				el.classList.add(`${key}-${chapter}-500`)

				// TODO: add the dark mode here ?
				// el.classList.add(`dark:${key}-${chapter}-500`)
			}
		}
	})
}

export const themeDirective = {
	mounted(el, binding) {
		themeUpdate(el, binding)
	},
	updated(el, binding) {
		themeUpdate(el, binding)
	}
}
