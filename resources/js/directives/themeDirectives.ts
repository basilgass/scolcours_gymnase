import {usePage} from "@inertiajs/vue3"
import type {Directive, DirectiveBinding} from "vue"

type ThemeModifier =
	| "bg" | "text" | "border" | "outline" | "gradient" | "from" | "to"
	| "admin"
	| "light" | "dark"

type ThemeValue = number | string | boolean | null
type ThemeModifiers = Partial<Record<ThemeModifier, boolean>>
type ThemeBinding = DirectiveBinding<ThemeValue, ThemeModifier>

const keys = ["bg", "text", "border", "outline", "gradient", "from", "to"]

// Slugs des thèmes, mémoïsés tant que l'objet themes des props ne change pas.
let cachedThemesSource: unknown = null
let cachedSlugs: string[] = []

function getThemes(): string[] {
	const themes = usePage().props.themes
	if (themes !== cachedThemesSource) {
		cachedThemesSource = themes
		cachedSlugs = Object.values(themes).map((theme) => theme.slug)
	}
	return cachedSlugs
}

function getCurrentTheme(): string {
	return usePage().props?.theme?.slug || "scolcours"
}

const appliedClasses = new WeakMap<HTMLElement, string[]>()

export function getThemeChapter(value?: ThemeValue, modifiers?: ThemeModifiers): string {
	const themes = getThemes()

	if (
		(modifiers && Object.hasOwn(modifiers, "admin")) ||
		value === "admin"
	) {
		return "admin"
	} else if (typeof value === 'string' && themes.includes(value)) {
		return value
	} else if (typeof value === "number") {
		// it's a number -> get the theme id.
		const theme = usePage().props.themes[+value]

		if (theme) {
			return theme.slug
		}
	}

	return getCurrentTheme()
}

export function getThemeClasses(chapter: string, modifiers: ThemeModifiers): string[] {
	const classesList: string[] = []

	// Le mode admin implique bg + text, sans muter l'objet reçu.
	const activeModifiers: ThemeModifiers = modifiers.admin
		? {...modifiers, bg: true, text: true}
		: modifiers

	const intensity = activeModifiers.light
		? '-light'
		: activeModifiers.dark
			? '-dark'
			: ''

	Object.keys(activeModifiers)
		.forEach((key) => {
			if (keys.includes(key)) {
				if (key === "text" && Object.hasOwn(activeModifiers, "bg") && chapter !== 'admin') {
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
						classesList.push(`${key}-${chapter}${intensity}`)
					}

					if (key === 'border') {
						classesList.push(`border`)
					}
					if (key === 'outline') {
						classesList.push('outline-2')
					}
				}
			}
		})

	return classesList
}

function themeUpdate(el: HTMLElement, binding: ThemeBinding) {
	// Retire uniquement les classes que cette directive a posées.
	appliedClasses.get(el)?.forEach((className) => el.classList.remove(className))

	if (binding.value === false || binding.value === 0 || binding.value === "") {
		appliedClasses.delete(el)
		return
	}

	const chapter = getThemeChapter(binding.value, binding.modifiers)
	const classes = [...new Set(getThemeClasses(chapter, binding.modifiers))]

	classes.forEach((className) => el.classList.add(className))
	appliedClasses.set(el, classes)
}

export const themeDirective: Directive<HTMLElement, ThemeValue, ThemeModifier> = {
	mounted(el, binding) {
		themeUpdate(el, binding)
	},
	updated(el, binding) {
		themeUpdate(el, binding)
	}
}
