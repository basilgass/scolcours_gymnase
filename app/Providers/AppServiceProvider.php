<?php

namespace App\Providers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
		$this->app->singleton('Scolcours', function($app){
//			return Scolcours::all()->first();
			return "";
		});
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
	    if(App::environment('production')){
		    URL::forceScheme('https');
	    }

		Cache::rememberForever('scolcours', function (){
//			return Scolcours::all()->first();
			return "";
		});

    }
}
