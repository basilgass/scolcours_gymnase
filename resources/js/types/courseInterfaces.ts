import type { BlockInterface } from "@/types/blockInterfaces.ts"
import type { UserTeamInterface } from "@/types/userInterfaces.ts"
import type { LessonInterface } from "@/types/modelInterfaces.ts"

export interface CourseMinInterface {
	block: BlockInterface,
	created_at: string,
	id: number,
	slug: string,
	theme_id: number,
	title: string,
	updated_at: string,
}

export interface CourseInterface extends CourseMinInterface {
	lessons: LessonInterface[],
	scheduled_at: string,
	status: 'not yet started' | 'active' | 'finished',
	teams?: UserTeamInterface[],
}
