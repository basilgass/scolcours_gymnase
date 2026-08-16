interface TitleLabelInterface {
	title: string,
	label?: string | null
}

export function useTitleLabel(item: TitleLabelInterface) {
	if (!item.label) return item.title

	if (item.label.includes('@')) {
		return item.label.replace('@', item.title)
	}

	return item.label
}
