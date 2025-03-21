import {usePage} from "@inertiajs/vue3"

// REFACTOR: reformat this file
function getThemes(): string[] {
	return usePage().props.themes.map((theme) => theme.slug)
}

function getCurrentTheme(): string {
	return usePage().props?.theme?.slug || "scolcours"
}

const keys = ["bg", "text", "border", "outline", "gradient", "from", "to"]

function clearThemeClasses(el: HTMLElement): void {
	const themes = getThemes()

	keys.forEach((key) => {
		themes.forEach((theme) => {

			const regex = new RegExp(`${key}-${theme}[(-dark)|(-light)]?`)
			el.classList.forEach((className) => {
				if (regex.test(className)) {
					el.classList.remove(className)

					// If removing a border-*-* item, also remove border.
					if (key === 'border') {
						el.classList.remove('border')
					}

					if (key === 'outline') {
						el.classList.remove('outline')
						el.classList.remove('outline-1')
						el.classList.remove('outline-2')
					}
				}
			})
		})
	})

	// Remove the text-white class if bg is not set
	el.classList.remove("text-white")
}

export function getThemeChapter(value?: string | boolean | number, modifiers?: Record<string, boolean>): string {
	const themes = getThemes()

	if (
		modifiers &&
		Object.hasOwn(modifiers, "admin") ||
		value === "admin"
	) {
		return "admin"
	} else if (typeof value === 'string' && themes.indexOf(value) !== -1) {
		return value
	} else if (typeof value === "number") {
		// it's a number -> get the theme id.
		const theme = usePage().props.themes.filter(
			(th) => +th.id === +value
		)

		if (theme.length === 1) {
			return theme[0].slug
		}
	}

	return getCurrentTheme() ?? 'scolcours'
}

export function getThemeClasses(chapter: string, modifiers: Record<string, boolean>) {
	const classesList: string[] = []

	if (modifiers.admin) {
		modifiers.bg = true
		modifiers.text = true
	}

	Object.keys(modifiers)
		.forEach((key) => {
			if (keys.indexOf(key) !== -1) {
				if (key === "text" && Object.hasOwn(modifiers, "bg") && chapter !== 'admin') {
					classesList.push("text-white")
				} else if (key === 'gradient') {
					classesList.push(`bg-linear-to-t`)
					classesList.push(`from-${chapter}`)
					classesList.push(`to-${chapter}-light`)
					classesList.push(`dark:to-${chapter}-dark`)
				} else {
					if (chapter === 'admin') {
						classesList.push(`admin-content`)
					} else {
						classesList.push(`${key}-${chapter}`)
					}

					if (key === 'border') {
						classesList.push(`border`)
					}
					if(key==='outline'){
						classesList.push('outline-2')
					}
				}
			}
		})

	return classesList
}

function setThemeClasses(el: HTMLElement, chapter: string, modifiers: Record<string, boolean>): void {
	getThemeClasses(chapter, modifiers).forEach((value: string) => {
		el.classList.add(value)
	})
}

function themeUpdate(el, binding) {
	clearThemeClasses(el)

	if (binding.value === false || binding.value === 0 || binding.value === "") return

	setThemeClasses(
		el,
		getThemeChapter(binding.value, binding.modifiers),
		binding.modifiers
	)
}

export const themeDirective = {
	mounted(el, binding) {
		themeUpdate(el, binding)
	},
	updated(el, binding) {
		themeUpdate(el, binding)
	}
}
