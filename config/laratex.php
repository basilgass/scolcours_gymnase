<?php

return [
	// bin path to your pdflatex installation | use 'which pdflatex' on a linux system to find out which is the path to your pdflatex installation
	'binPath' => env('APP_ENV')==='local'?
		'C:\Users\basil\AppData\Local\Programs\MiKTeX 2.9\miktex\bin\x64\pdflatex.exe':
		'\home\clients\ff3453ceb0d3f534299efdde49b459d5\latex\texdir\bin\x86_64-linux\pdflatex',

	// Folder in your storage folder where you would like to store the temp files created by LaraTeX
	'tempPath' => 'app/pdf/',
];
