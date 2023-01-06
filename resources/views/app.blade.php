<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title inertia>{{ config('app.name', 'Laravel') }}</title>

	<!-- Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600&display=swap" rel="stylesheet">

	<!-- syntax highlither -->
{{--	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/themes/prism-dark.min.css" integrity="sha512-Njdz7T/p6Ud1FiTMqH87bzDxaZBsVNebOWmacBjMdgWyeIhUSFU4V52oGwo3sT+ud+lyIE98sS291/zxBfozKw==" crossorigin="anonymous" referrerpolicy="no-referrer" />--}}
{{--	<script src="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@1.1/code-input.min.js"></script>--}}
{{--	<script src="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@1.1/plugins/indent.js"></script>--}}
{{--	<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@1.1/code-input.min.css">--}}

	<!-- Styles -->
	<link rel="stylesheet" href="{{ mix('css/app.css') }}">

	@routes

	<!-- Finally, loading the main app script -->
	<script src="{{ mix('js/manifest.js') }}"></script>
	<script src="{{ mix('js/vendor.js') }}" defer></script>
	<script src="{{ mix('js/app.js') }}" defer></script>

{{--	<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/prism.min.js" integrity="sha512-RDQSW3KoqJMiX0L/UBgwBmH1EmRYp8LBOiLaA8rBHIy+7OGP/7Gxg8vbt8wG4ZYd29P0Fnoq6+LOytCqx3cyoQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>--}}
</head>
<body class="font-sans antialiased min-h-screen">

<noscript>Votre navigateur n'accepte pas les scripts... C'est triste :(</noscript>

@inertia

<div id="modal-dialog"></div>
</body>
<script>
	// document.addEventListener('DOMContentLoaded', function () {
	// 	katexAutoRender(document.body)
	// })
</script>

</html>
