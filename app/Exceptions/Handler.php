<?php

namespace App\Exceptions;

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Resources\ThemeResource;
use App\Models\Theme;
use App\Support\NotFoundSuggestionResolver;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register(): void
    {
        $this->renderable(function (NotFoundHttpException $e, $request) {
            if (!Inertia::getShared('auth')) {
                Inertia::share(app(HandleInertiaRequests::class)->share($request));
            }

            $suggestion = app(NotFoundSuggestionResolver::class)->resolve($request->path());

            if ($suggestion['theme_id'] ?? null) {
                $theme = Theme::getThemesFromCache()->firstWhere('id', $suggestion['theme_id']);
                if ($theme) {
                    Inertia::share('theme', ThemeResource::make($theme));
                }
            }

            return Inertia::render('Error404', [
                'error'      => $request->path(),
                'suggestion' => $suggestion,
            ])->toResponse($request)->setStatusCode(404);
        });

        $this->reportable(function (Throwable $e) {
            //
        });
    }
}
