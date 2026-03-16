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
	id: number,
	day: number, // 0, 1, 2, 3, 4, 5, 6, 7
	time: string // hh:mm:ss
}

export interface TeamInterface {
	id: number,
	name: string,
	active: boolean,
	users?: UserInterface[],
	calendar?: TeamCalendarInterface[]
}
