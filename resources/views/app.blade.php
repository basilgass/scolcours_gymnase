<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet">

    <!-- Styles -->
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">

    @routes

    <!-- Finally, loading the main app script -->
    <script src="{{ mix('js/manifest.js') }}"></script>
    <script src="{{ mix('js/vendor.js') }}"></script>
    <script src="{{ mix('js/pi.bundle.js') }}"></script>
    <script src="{{ mix('js/app.js') }}" defer></script>

</head>
<body class="font-sans antialiased min-h-screen">

<noscript>Votre navigateur n'accepte pas les scripts... C'est triste :(</noscript>

@inertia

<div id="modal-dialog"></div>
</body>
<script>
	document.addEventListener('DOMContentLoaded', function () {
		katexAutoRender(document.body)
	})
</script>

</html>
