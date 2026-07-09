import type {ChartData, ChartType} from "chart.js"
import {graduateBackgroundColor, graduateBorderColor} from "@/scolcours.ts"

/**
 * Libellé d'axe : chart.js accepte aussi bien des chaînes que des nombres.
 */
export type ChartLabel = string | number

/**
 * Forme d'entrée d'un dataset acceptée par les composants bar/line.
 * Seul `data` est requis ; les autres champs sont des options chart.js facultatives.
 */
export type ChartInputDataset = {
	label?: string
	data: number[]
	type?: string
	borderColor?: string | string[]
	backgroundColor?: string | string[]
	borderWidth?: number
	barPercentage?: number
	categoryPercentage?: number
}

/**
 * Entrée acceptée par `chartDataset` : soit une liste de datasets, soit un simple `number[]`.
 */
export type ChartInput = ChartInputDataset[] | number[]

/**
 * Données d'une boîte à moustaches (dataset du boxPlotChart).
 */
export type BoxPlotData = {
	whiskerMin: number
	q1: number
	median: number
	q3: number
	whiskerMax: number
	items?: number[]
}

export type BoxPlotInputDataset = {
	label: string
	data: BoxPlotData
}

/**
 * Props communes aux composants bar/line.
 */
export interface ChartComponentProps {
	chartDataset: ChartInput
	chartLabels?: ChartLabel[]
	chartOptions?: object
	chartLegend?: boolean
	chartColorset?: string
}

/**
 * Props du composant boxPlot (dataset au format boîte à moustaches).
 */
export interface BoxPlotComponentProps {
	chartDataset: BoxPlotInputDataset[]
	chartLabels?: ChartLabel[]
	chartOptions?: object
	chartLegend?: boolean
	chartColorset?: string
}

/**
 * Valeurs par défaut communes à passer à `withDefaults`.
 */
export const chartPropDefaults = {
	chartLabels: (): ChartLabel[] => [],
	chartLegend: false,
} as const

/**
 * Couleurs de dataset selon le jeu de couleurs demandé.
 */
export function chartColors(colorset?: string | null): Partial<ChartInputDataset> {
	if (colorset === "graduate") {
		return {
			backgroundColor: graduateBackgroundColor,
			borderColor: graduateBorderColor,
			borderWidth: 1,
		}
	}

	return {}
}

/**
 * Normalise l'entrée en une liste de datasets chart.js.
 * - liste de datasets → passthrough
 * - `number[]` brut → un unique dataset coloré selon `colorset`
 */
export function normalizeDatasets(input: ChartInput, colorset?: string | null): ChartInputDataset[] {
	if (Array.isArray(input) && typeof input[0] === "object") {
		return input as ChartInputDataset[]
	}

	return [{
		data: input as number[],
		...chartColors(colorset),
	}]
}

/**
 * Construit l'objet `ChartData` attendu par vue-chartjs.
 */
export function buildChartData<T extends ChartType>(
	input: ChartInput,
	labels: ChartLabel[],
	colorset?: string | null,
): ChartData<T> {
	const base: { labels?: ChartLabel[] } = {}
	if (labels.length > 0) {
		base.labels = labels
	}

	return {
		...base,
		datasets: normalizeDatasets(input, colorset),
	} as ChartData<T>
}
