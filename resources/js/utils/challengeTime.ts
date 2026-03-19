export function humanTime(seconds: number): string {
	if (seconds < 120) {
		return `${seconds} secondes`
	}

	const sec = seconds % 60
	const min = (seconds - sec) / 60

	return sec === 0
		? `${min} minutes`
		: `${min} minutes et ${sec} secondes`
}