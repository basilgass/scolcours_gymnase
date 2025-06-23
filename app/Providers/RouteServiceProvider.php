<?php

namespace App\Providers;

use App\Models\Theme;
use App\Models\TranslationLanguage;
use Exception;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
	/**
	 * The path to the "home" route for your application.
	 *
	 * This is used by Laravel authentication to redirect users after login.
	 *
	 * @var string
	 */
	public const HOME = '/dashboard';

	/**
	 * The controller namespace for the application.
	 *
	 * When present, controller route declarations will automatically be prefixed with this namespace.
	 *
	 * @var string|null
	 */
	// protected $namespace = 'App\\Http\\Controllers';

	/**
	 * Define your route model bindings, pattern filters, etc.
	 *
	 * @return void
	 */
	public function boot(): void
	{
		parent::boot();


		Route::bind('theme', function ($value) {
			try {
				$themesList = Theme::getThemesFromCache()->pluck('slug')->toArray();
			} catch (\Exception $e) {
				$themesList = Theme::all()->pluck('slug')->toArray();
			}

			if (in_array($value, $themesList, true)) {
				return Theme::where('slug', $value)->firstOrFail();
			}

			abort(404);
		});


		// Définir le pattern global pour {language}, basé sur le cache
		Route::pattern('language:slug', implode('|', Cache::rememberForever('languages', function () {
			try {
				return TranslationLanguage::pluck('slug')->toArray();
			} catch (Exception $e) {
				return ['italiano', 'english', 'espanol', 'deutsch'];
			}
		})));

		$this->configureRateLimiting();

		// Default entries
		Route::middleware('web')
		     ->group(base_path('routes/web.php'));
		Route::middleware('api')
		     ->prefix('api')
		     ->group(base_path('routes/api.php'));


		// Admin
		Route::middleware('web')
		     ->group(base_path('routes/admin.php'));
		Route::middleware('web')
		     ->group(base_path('routes/single_pages.php'));

		// Routes dans les dossiers.
		$this->loadRoutesFromContentDirectory('management');
		$this->loadRoutesFromContentDirectory('content');

	}

	protected function loadRoutesFromContentDirectory($folder): void
	{
		$routeFiles = File::glob(base_path('routes/'.$folder.'/*.php'));

		// Charge le chapters.php à la fin.
		usort($routeFiles, function ($a, $b) {
			return basename($a) === 'chapters.php' ? 1 : -1;
		});

		foreach ($routeFiles as $file) {
			require $file;
		}
	}

	/**
	 * Configure the rate limiters for the application.
	 *
	 * @return void
	 */
	protected function configureRateLimiting(): void
	{
		RateLimiter::for('api', function (Request $request) {
			return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
		});
	}
}
