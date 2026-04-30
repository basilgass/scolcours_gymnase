export interface UserInterface {
	id: number;
	name: string;
	firstname: string;
	fullname: string;
	email: string;
	pseudo: string;
	public_name: string;
	showRealName: boolean;
	teams?: { id: number, name: string }[];
}

// export interface User {
// 	id: number
// 	name: string
// 	firstname: string
// 	fullname: string
// 	email: string
// 	pseudo: string
// 	public_name: string
// 	showRealName: boolean
// 	email_verified_at: string
// 	role: string
// }

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
