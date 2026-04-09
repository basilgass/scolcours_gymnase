<?php

return [
	// bin path to your pdflatex installation | use 'which pdflatex' on a linux system to find out which is the path to your pdflatex installation
	'binPath'  => env('LATEX_BIN_PATH'),

	// Folder in your storage folder where you would like to store the temp files created by LaraTeX
	'tempPath' => 'app/temp/laratex',
];
