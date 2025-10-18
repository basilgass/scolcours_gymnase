export function onClick_answerIndex($event: MouseEvent): number | null {
	const target = $event.target as Element
	if (!target) return null
	const el = target.closest('[data-answer-index]') as Element | null

	if (!el) return null

	const raw = el.getAttribute('data-answer-index')
	if (raw === null) return null

	const index = parseInt(raw)
	if (Number.isNaN(index)) return null

	return index
}
