\documentclass[a4paper]{article}
\usepackage[french]{babel}
\usepackage{fancyhdr}
\usepackage{xcolor}
\usepackage[a4paper,inner=1.5cm,outer=1.5cm,top=1cm,bottom=1cm,bindingoffset=0cm]{geometry}
\geometry{textwidth=\paperwidth, textheight=\paperheight, noheadfoot, nomarginpar}
% Suppression de l'indentation automatique
\setlength\parindent{0pt}

% Enlever la numérotation des sections
\setcounter{secnumdepth}{0}
\usepackage{amsmath,amsfonts,amssymb,amsthm,array}
\usepackage[inline,shortlabels]{enumitem}
\usepackage[onehalfspacing]{setspace}

\makeatletter
% Alignement des espaces mathématiques
\newcommand{\mathleft}{\@fleqntrue\@mathmargin0pt}
\newcommand{\mathleftmargin}{\@fleqntrue\@mathmargin10pt}
\newcommand{\mathcenter}{\@fleqnfalse}
\newcommand{\mathdense}{
\setlength{\abovedisplayskip}{0pt}
\setlength{\belowdisplayskip}{0pt}
\setlength{\abovedisplayshortskip}{0pt}
\setlength{\belowdisplayshortskip}{0pt}
}

% Commande pour générer des coordonnées: \coord[nom?]{x,y}
\NewDocumentCommand\coord{s O{} >{\SplitList{,}} m}{%
\def\itemdelim{\def\itemdelim{;}}% Define list separator with one delay
\IfNoValueF{#2}{#2}% Ajout du nom de la coordonnée si donné.
\IfBooleanTF{#1}{\left(}{\bigl(}% Big parenthese ou taille auto.
\ProcessList{#3}{\coorditem}
\IfBooleanTF{#1}{\right)}{\bigr)}% Big parentese ou taille auto
}
\newcommand\coorditem[1]{\itemdelim #1}

% Commande pour tracer le produit scalaire (gros point): \bigcdot
\newcommand*\bigcdot{\mathpalette\bigcdot@{.6}}
\newcommand*\bigcdot@[2]{\mathbin{\vcenter{\hbox{\scalebox{#2}{$\m@th#1\bullet$}}}}}
\makeatother




\pagestyle{fancy}
\fancyhead{}
\renewcommand{\headrulewidth}{0pt}
\fancyfoot{}
\fancyfoot[LE,RO]{\thepage}
\renewcommand{\footrulewidth}{0.2pt}

\begin{document}

\section*{<?= $name ?>}

\mathleft
\begin{enumerate}
\def\itemsep{1em}
@foreach($questions as $question)
    \item \(\displaystyle {{$question->question}}\)
@endforeach
\end{enumerate}

\vfill
\scriptsize
\textbf{Réponses}

\begin{spacing}{2}
\begin{enumerate*}[before=réponse:,itemjoin=\hspace{1cm}]
@foreach($questions as $question)
    \item \({{$question->answer}}\)
@endforeach
\end{enumerate*}
\end{spacing}
\end{document}