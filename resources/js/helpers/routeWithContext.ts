export function routeWithContext(name: string, params: Record<string, unknown> = {}, absolute = true) {
	const path = window.location.pathname

	console.log(path)

	// logique de contexte basée sur l'URL courante
	if (name === 'posts.show') {
		if (path.startsWith('/courses/') || path.startsWith('/cours/')) {
			// contexte "cours"
			const match = path.match(/^\/courses\/(\d+)/) || path.match(/^\/cours\/(\d+)/)
			const courseId = match ? Number(match[1]) : null
			if (courseId) {
				name = 'students'
				
				params = {...params, course: courseId}
			}
		}
	}

	return route(name, params, absolute)
}
