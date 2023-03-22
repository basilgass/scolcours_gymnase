<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title inertia>{{ config('app.name', 'Laravel') }}</title>

	<!-- Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link
		href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600&display=swap"
		rel="stylesheet">

	<!-- Styles -->
	<link rel="stylesheet" href="{{ mix('css/app.css') }}">

	@routes

	<!-- Finally, loading the main app script -->
	<script src="{{ mix('js/manifest.js') }}"></script>
	<script src="{{ mix('js/vendor.js') }}" defer></script>
	<script src="{{ mix('js/app.js') }}" defer></script>


{{--	<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>--}}
{{--	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-coy.min.css"></link>--}}

	<!--code-input-->
	<!--In the <head>-->
{{--	<script src="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@1.2/code-input.min.js"></script>--}}
{{--	<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@1.2/code-input.min.css">--}}
{{--	<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@1.2/plugins/prism-line-numbers.min.css">--}}
</head>
<body class="font-sans antialiased min-h-screen">

<noscript>Votre navigateur n'accepte pas les scripts... C'est triste :(</noscript>

@inertia

<div id="modal-dialog"></div>
</body>

</html>
