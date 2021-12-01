<?php
	
	namespace App\Models\Challenges;
	
	use Illuminate\Database\Eloquent\Model;
	
	class ChallengeUser extends Model
	{
		protected $guarded=[];
		
		public function session()
		{
			return $this->belongsTo(ChallengeSession::class);
		}
	}