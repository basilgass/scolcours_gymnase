export interface UserInterface {
	email: string;
	firstname: string;
	fullname: string;
	id: number;
	name: string;
	teams?: { id: number, name: string }[];
}

export interface User {
	email: string
	email_verified_at: string
	firstname: string
	fullname: string
	id: number
	name: string
	role: string
}

export interface TeamCalendarInterface {
	day: number, // 0, 1, 2, 3, 4, 5, 6, 7
	id: number,
	time: string // hh:mm:ss
}

export interface TeamInterface {
	active: boolean,
	calendar: TeamCalendarInterface[]
	id: number,
	name: string,
	users: UserInterface[],
}

export interface UserTeamInterface {
	calendar: TeamCalendarInterface[]
	id: number,
	name: string,
}
