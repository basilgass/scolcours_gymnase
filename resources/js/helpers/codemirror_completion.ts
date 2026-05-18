import type {CompletionContext, CompletionResult, CompletionSource} from "@codemirror/autocomplete"
import type {GeneratorParameterSchemaEntry} from "@/types/challengeInterfaces.ts"

export interface CompletionItem {
	label: string
	detail?: string
	info?: string
}

export interface CompletionGroup {
	prefix: string
	items: () => CompletionItem[]
}

export function makeCompletionSource(groups: CompletionGroup[]): CompletionSource {
	return (context: CompletionContext): CompletionResult | null => {
		const word = context.matchBefore(/[\w.]+/)
		if (!word) return null

		const dotPos = word.text.lastIndexOf('.')
		const prefix = dotPos >= 0 ? word.text.slice(0, dotPos) : ''
		const endsWithDot = dotPos === word.text.length - 1
		const from = dotPos >= 0
			? (endsWithDot ? word.to : word.from + dotPos + 1)
			: word.from

		const group = groups.find(g => g.prefix === prefix)
		if (!group) return null

		return {
			from,
			options:  group.items(),
			validFor: /^\w*$/
		}
	}
}

export function schemaToCompletionItems(
	schema: Record<string, GeneratorParameterSchemaEntry> | null | undefined
): CompletionItem[] {
	if (!schema) return []
	return Object.entries(schema).map(([key, entry]) => ({
		label:  key,
		detail: entry.format,
		info:   entry.description
	}))
}