<?php
	
	namespace App\Models;
	
	use App\Models\Challenges\ChallengeSession;
	use Illuminate\Database\Eloquent\Model;
	
	class Challenge extends Model
	{
		protected $guarded=[];
		
		public function sessions()
		{
			return $this->hasMany(ChallengeSession::class);
		}
		
		public function getRunningAttribute()
		{
			return $this->sessions->where('open', 'is', true);
		}
	}