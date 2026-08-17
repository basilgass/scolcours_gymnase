/**
 * Logique pure de l'audit SEO (statut, filtrage, tri).
 *
 * Extraite de la page `Admin/AdminSeo.vue` pour être testable en isolation :
 * la page se contente d'orchestrer ces fonctions via des `computed`.
 * Les lignes proviennent telles quelles de `SeoAdminController` (déjà toutes
 * hydratées côté client), d'où un filtrage/tri 100 % front.
 */

export interface SeoRow {
	url: string
	title: string
	description: string
	/** Identifiant machine du modèle touché (`class_basename`), ou `"static"` pour une page sans modèle. */
	type: string
	/** Clé primaire du modèle touché ; `null` pour une page statique (non éditable). */
	metable_id: number | null
	/** Override de titre brut stocké dans `metas`, `null` si dérivé. */
	override_title: string | null
	/** Override de description brut stocké dans `metas`, `null` si dérivé. */
	override_description: string | null
	source: string
	length: number
}

/** Gravité SEO d'une description : absente / trop courte / correcte. */
export type SeoStatus = "empty" | "weak" | "ok"

/** Valeur du filtre statut (`"all"` = pas de filtre). */
export type StatusFilter = "all" | SeoStatus

/** Valeur du filtre source (`"all"` = pas de filtre, sinon un `MetaSource`). */
export type SourceFilter = string

/** Colonnes triables du tableau. */
export type SortKey = "url" | "title" | "type" | "source" | "length"

export type SortDir = "asc" | "desc"

/** Seuil (exclusif) en dessous duquel une description non vide est jugée « courte ». */
export const WEAK_THRESHOLD = 50

export function rowStatus(row: SeoRow): SeoStatus {
	if (row.length === 0) {
		return "empty"
	}
	if (row.length < WEAK_THRESHOLD) {
		return "weak"
	}
	return "ok"
}

export const STATUS_LABELS: Record<StatusFilter, string> = {
	all:   "Tous",
	empty: "Vides",
	weak:  "Courtes",
	ok:    "OK",
}

/** Libellés des filtres source ; les clés reprennent les valeurs de l'enum `MetaSource`. */
export const SOURCE_LABELS: Record<string, string> = {
	all:      "Toutes",
	template: "template",
	block:    "block",
	body:     "body",
	override: "override",
}

/**
 * Libellés des types de modèle ; les clés reprennent `class_basename` du modèle
 * (`"static"` pour les pages sans modèle). Toute clé absente retombe sur sa valeur brute.
 */
export const MODEL_LABELS: Record<string, string> = {
	all:       "Tous",
	static:    "Page",
	Theme:     "Thème",
	Chapter:   "Chapitre",
	Tool:      "Outil",
	Deck:      "Cartes",
	Challenge: "Défi",
	Generator: "Exercices",
}

/**
 * Critères de filtrage cumulatifs (ET logique).
 * - `url` / `title` / `description` : sous-chaîne insensible à la casse (`""` = ignoré).
 * - `source` / `status` : `"all"` = ignoré.
 * - `maxLength` : ne garde que les descriptions de longueur ≤ seuil (`null` = ignoré).
 */
export interface SeoFilters {
	url: string
	title: string
	description: string
	type: string
	source: SourceFilter
	status: StatusFilter
	maxLength: number | null
}

function includesInsensitive(haystack: string, needle: string): boolean {
	if (needle === "") {
		return true
	}
	return haystack.toLowerCase().includes(needle.toLowerCase())
}

export function filterRows(rows: SeoRow[], filters: SeoFilters): SeoRow[] {
	return rows.filter((row) => {
		if (filters.status !== "all" && rowStatus(row) !== filters.status) {
			return false
		}
		if (filters.type !== "all" && row.type !== filters.type) {
			return false
		}
		if (filters.source !== "all" && row.source !== filters.source) {
			return false
		}
		if (filters.maxLength !== null && row.length > filters.maxLength) {
			return false
		}
		return (
			includesInsensitive(row.url, filters.url) &&
			includesInsensitive(row.title, filters.title) &&
			includesInsensitive(row.description, filters.description)
		)
	})
}

/** Longueur cible d'une description SEO (miroir de `DescriptionCleaner::MAX_LENGTH`). */
export const PREVIEW_MAX_LENGTH = 155

/**
 * Tronque une description pour l'aperçu snippet : coupe sur une frontière de mot
 * et ajoute une ellipse. Miroir front léger de `DescriptionCleaner::clean` (PHP) ;
 * garder les deux alignés (même seuil, même coupe).
 */
export function previewDescription(text: string, max = PREVIEW_MAX_LENGTH): string {
	const clean = text.trim()

	if (clean.length <= max) {
		return clean
	}

	const cut = clean.slice(0, max)
	const lastSpace = cut.lastIndexOf(" ")
	const trimmed = lastSpace > 0 ? cut.slice(0, lastSpace) : cut

	return trimmed.replace(/[\s,.;:]+$/, "") + "…"
}

/**
 * Clé de rendu stable et unique pour une ligne d'audit.
 *
 * L'URL seule ne suffit PAS : deux entités distinctes peuvent produire la même
 * URL (ex. un thème de slug « tools » collisionne avec la route d'index
 * `tools.index`, tous deux `/tools`). On combine donc url + type + id du modèle,
 * ce qui reste unique même en cas de collision d'URL.
 */
export function rowKey(row: SeoRow): string {
	return `${row.url}|${row.type}|${row.metable_id ?? ""}`
}

export function sortRows(rows: SeoRow[], key: SortKey, dir: SortDir): SeoRow[] {
	const factor = dir === "asc" ? 1 : -1

	return [...rows].sort((a, b) => {
		const left = a[key]
		const right = b[key]

		if (typeof left === "number" && typeof right === "number") {
			return (left - right) * factor
		}

		return String(left).localeCompare(String(right), "fr") * factor
	})
}
