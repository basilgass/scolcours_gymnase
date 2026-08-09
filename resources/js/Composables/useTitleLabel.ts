interface TitleLabelInterface {
	title: string,
	label?: string | null
}

export function useTitleLabel(item: TitleLabelInterface) {
	console.log(item)
	if (!item.label) return item.title

	if (item.label.includes('@')) {
		return item.label.replace('@', item.title)
	}

	return item.label
}
