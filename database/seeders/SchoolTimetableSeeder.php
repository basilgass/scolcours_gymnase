<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SchoolTimetableSeeder extends Seeder
{
	public function run(): void
	{
		$horaire = [
			"08:15",
			"09:05",
			"10:10",
			"11:00",
			"11:50",
			"12:35",
			"13:25",
			"14:15",
			"15:05",
			"15:55",
		];

		$p = 1;
		foreach ($horaire as $h) {
			\DB::table('school_timetable')->insert([
				'period'     => $p,
				'start'      => $h,
				'end'        => Carbon::createFromFormat('H:i', $h)->addMinutes(45)->format('H:i'),
				'updated_at' => now(),
				'created_at' => now()
			]);
			$p++;

		}
	}
}
