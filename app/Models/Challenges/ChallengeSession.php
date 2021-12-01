<?php
	
	namespace App\Models\Challenges;
	
	use App\Models\Challenge;
	use App\Models\User;
	use Illuminate\Database\Eloquent\Model;
	
	class ChallengeSession extends Model
	{
		protected $guarded=[];
		
		public function challenge()
		{
			return $this->belongsTo(Challenge::class);
		}
		
		public function admin()
		{
			return $this->belongsTo(User::class);
		}
		
		public function users()
		{
			return $this->hasMany(ChallengeUser::class);
		}
	}