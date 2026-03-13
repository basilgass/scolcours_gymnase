<?php

namespace App\Providers;

use App\Models\Scolcours;
use Exception;
use Illuminate\Http\Resources\Json\JsonResource;
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
		if ($this->app->environment('local')) {
			$this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
			$this->app->register(TelescopeServiceProvider::class);
		}

		//
		//		$this->app->singleton('Scolcours', function($app){
		//			try {
		//				return Scolcours::all()->first();
		//			}catch(\Exception $exception){
		//				return [];
		//			}
		//		});
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot()
	{
		if (App::environment('production')) {
			URL::forceScheme('https');
		}

		Cache::rememberForever('scolcours', function () {
			try {
				return Scolcours::all()->first();
			} catch (Exception $exception) {
				return [];
			}
		});

		JsonResource::withoutWrapping();

		// TODO: consider automatically eager load relationships
		// Model::automaticallyEagerLoadRelationships();
	}
}
