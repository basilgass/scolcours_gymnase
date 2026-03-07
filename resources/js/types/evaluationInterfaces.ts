import type { QuestionInterface } from "@/types/postInterfaces.ts"
import type { TeamInterface } from "@/types/userInterfaces.ts"

export enum ITEM_STATUS {
	'NEW',
	'PARTIAL',
	'SUCCESS',
}

export enum EVAL_STATUS {
	LOADING,
	INTRO,
	RUNNING,
	FINISHED
}

export interface EvaluationInterface {
	auto_control: boolean;
	body: string;
	id: number;
	questions: QuestionInterface[];
	randomOrder: boolean;
	slug: string;
	title: string;
}

export interface EvaluationAdminInterface extends EvaluationInterface {
	teams: TeamInterface[]
}
