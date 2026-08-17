import {describe, expect, test} from "vitest"
import {
	filterRows,
	previewDescription,
	PREVIEW_MAX_LENGTH,
	rowKey,
	rowStatus,
	type SeoFilters,
	type SeoRow,
	sortRows,
	WEAK_THRESHOLD,
} from "@/Composables/seoAudit.ts"

const NO_FILTER: SeoFilters = {
	url: "", title: "", description: "", type: "all", source: "all", status: "all", maxLength: null,
}

function filters(over: Partial<SeoFilters>): SeoFilters {
	return {...NO_FILTER, ...over}
}

/**
 * Logique pure de l'audit SEO extraite de la page Admin/AdminSeo.vue.
 * Verrouille la classification de gravité + le filtrage/tri côté client.
 */

function row(over: Partial<SeoRow>): SeoRow {
	return {
		url: "/x", title: "x", description: "", type: "static", source: "template", length: 0,
		metable_id: null, override_title: null, override_description: null, ...over,
	}
}

describe("rowStatus — gravité d'une description", () => {
	test("longueur 0 : vide", () => {
		expect(rowStatus(row({length: 0}))).toBe("empty")
	})

	test("longueur sous le seuil : courte", () => {
		expect(rowStatus(row({length: 39}))).toBe("weak")
		expect(rowStatus(row({length: WEAK_THRESHOLD - 1}))).toBe("weak")
	})

	test("borne du seuil incluse dans OK", () => {
		expect(rowStatus(row({length: WEAK_THRESHOLD}))).toBe("ok")
	})

	test("longueur confortable : OK", () => {
		expect(rowStatus(row({length: 78}))).toBe("ok")
	})
})

describe("filterRows — filtres cumulatifs", () => {
	const rows = [
		row({url: "/empty", title: "Algèbre", description: "", length: 0, type: "Theme", source: "template"}),
		row({url: "/weak", title: "Analyse", description: "courte", length: 39, type: "Chapter", source: "block"}),
		row({url: "/ok", title: "Géométrie", description: "longue et complète", length: 78, type: "Tool", source: "body"}),
	]

	test("aucun filtre : aucune ligne écartée", () => {
		expect(filterRows(rows, NO_FILTER)).toHaveLength(3)
	})

	test("filtre statut : ne garde que les vides", () => {
		expect(filterRows(rows, filters({status: "empty"})).map((r) => r.url)).toEqual(["/empty"])
	})

	test("filtre source : ne garde que la source demandée", () => {
		expect(filterRows(rows, filters({source: "block"})).map((r) => r.url)).toEqual(["/weak"])
	})

	test("filtre type : ne garde que le modèle demandé", () => {
		expect(filterRows(rows, filters({type: "Tool"})).map((r) => r.url)).toEqual(["/ok"])
	})

	test("filtre URL : sous-chaîne insensible à la casse", () => {
		expect(filterRows(rows, filters({url: "EMP"})).map((r) => r.url)).toEqual(["/empty"])
	})

	test("filtre titre : sous-chaîne insensible à la casse et accents", () => {
		expect(filterRows(rows, filters({title: "géo"})).map((r) => r.url)).toEqual(["/ok"])
	})

	test("filtre description : sous-chaîne", () => {
		expect(filterRows(rows, filters({description: "complète"})).map((r) => r.url)).toEqual(["/ok"])
	})

	test("seuil maxLength : ne garde que les longueurs ≤ seuil", () => {
		expect(filterRows(rows, filters({maxLength: 39})).map((r) => r.url)).toEqual(["/empty", "/weak"])
	})

	test("seuil maxLength 0 : uniquement les vides", () => {
		expect(filterRows(rows, filters({maxLength: 0})).map((r) => r.url)).toEqual(["/empty"])
	})

	test("combinaison statut + source", () => {
		expect(filterRows(rows, filters({status: "ok", source: "body"}))).toHaveLength(1)
		expect(filterRows(rows, filters({status: "ok", source: "block"}))).toHaveLength(0)
	})
})

describe("previewDescription — troncature d'aperçu", () => {
	test("texte court : renvoyé tel quel (trim)", () => {
		expect(previewDescription("  Une description brève.  ")).toBe("Une description brève.")
	})

	test("chaîne vide", () => {
		expect(previewDescription("")).toBe("")
	})

	test("coupe sur une frontière de mot et ajoute une ellipse", () => {
		const long = "mot ".repeat(100).trim() // 399 chars
		const result = previewDescription(long)

		expect(result.length).toBeLessThanOrEqual(PREVIEW_MAX_LENGTH + 1) // +1 pour l'ellipse
		expect(result.endsWith("…")).toBe(true)
		expect(result).not.toContain("mo…") // pas de coupe en plein mot
	})

	test("respecte un seuil personnalisé", () => {
		expect(previewDescription("un deux trois quatre", 8)).toBe("un deux…")
	})
})

describe("rowKey — clé de rendu unique", () => {
	test("distingue deux lignes qui partagent la même URL (collision de slug)", () => {
		const index = row({url: "/tools", type: "static", metable_id: null})
		const theme = row({url: "/tools", type: "Theme", metable_id: 6})

		expect(rowKey(index)).not.toBe(rowKey(theme))
	})

	test("déterministe pour une même ligne", () => {
		const theme = row({url: "/tools", type: "Theme", metable_id: 6})

		expect(rowKey(theme)).toBe(rowKey(theme))
	})
})

describe("sortRows — tri par colonne", () => {
	const rows = [
		row({url: "/b", title: "beta", length: 39, source: "template"}),
		row({url: "/a", title: "alpha", length: 78, source: "block"}),
		row({url: "/c", title: "gamma", length: 0, source: "body"}),
	]

	test("longueur croissante", () => {
		expect(sortRows(rows, "length", "asc").map((r) => r.length)).toEqual([0, 39, 78])
	})

	test("longueur décroissante", () => {
		expect(sortRows(rows, "length", "desc").map((r) => r.length)).toEqual([78, 39, 0])
	})

	test("URL alphabétique", () => {
		expect(sortRows(rows, "url", "asc").map((r) => r.url)).toEqual(["/a", "/b", "/c"])
	})

	test("ne mute pas le tableau source", () => {
		const original = rows.map((r) => r.url)
		sortRows(rows, "url", "asc")
		expect(rows.map((r) => r.url)).toEqual(original)
	})
})
