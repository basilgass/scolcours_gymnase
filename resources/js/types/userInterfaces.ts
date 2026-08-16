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
	school_timetable_id: number, // créneau lié (période)
	time: string // hh:mm — dérivé du créneau lié, conservé pour l'affichage
}

export interface SchoolTimetableInterface {
	id: number,
	period: number,
	start: string, // hh:mm
	end: string // hh:mm
}

export interface SchoolCalendarInterface {
	id: number,
	week: number | null,
	day: string, // Y-m-d
	school: boolean
}

export interface TeamInterface {
	id: number,
	name: string,
	active: boolean,
	users?: UserInterface[],
	calendar?: TeamCalendarInterface[]
}
