import {parseNumberSet} from "@/Composables/useNumberSet.ts"
import type {
	GeneratorParameterFormat,
	GeneratorParameterSchemaEntry
} from "@/types/challengeInterfaces.ts"
import type {GeneratorParams} from "@/Composables/useGenerator.ts"

export type GeneratorParameterRawValue = string

export function castParameterValue(
	raw: GeneratorParameterRawValue,
	format: GeneratorParameterFormat
): string | number | number[] {
	switch (format) {
		case 'number':
			return Number(raw)
		case 'set':
			return parseNumberSet(raw).values
		case 'string':
		default:
			return raw
	}
}

export function resolveParameters(
	schema: Record<string, GeneratorParameterSchemaEntry> | null | undefined,
	overrides: Record<string, GeneratorParameterRawValue> | null | undefined
): GeneratorParams {
	const out: GeneratorParams = {}

	if (!schema) {
		// Pas de schéma : on passe les overrides bruts (strings).
		if (overrides) {
			for (const [k, v] of Object.entries(overrides)) {
				out[k] = v
			}
		}
		return out
	}

	for (const [key, entry] of Object.entries(schema)) {
		const raw = overrides && key in overrides ? overrides[key] : entry.default
		out[key] = castParameterValue(raw, entry.format)
	}

	return out
}