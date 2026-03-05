@isset($standalone)
	\documentclass[10pt]{standalone}
@else
	\documentclass[10pt]{article}
	\usepackage{geometry}
	\geometry{ a4paper, total={190mm,270mm}, left=10mm, top=10mm}
	\usepackage[frenchb]{babel}
	\usepackage{titling}
	\usepackage{fancyhdr}

@endif

\usepackage[dvipsnames]{xcolor}
\usepackage[onehalfspacing]{setspace}

% Packages pour les listes.
\usepackage[inline,shortlabels]{enumitem}
\setlist[itemize,1]{label=\( \triangleright \) }
\usepackage[T1]{fontenc}
\usepackage{datetime}
\usepackage{amsmath,amsfonts,amssymb,amsthm,array}
\usepackage{multicol}

% Nouvelles fonctions mathématiques.
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
\makeatother

% Commande pour les ensemble de nombres
\newcommand{\IN}{\ensuremath{\mathbb{N}} }
\newcommand{\IZ}{\ensuremath{\mathbb{Z}} }
\newcommand{\IQ}{\ensuremath{\mathbb{Q}} }
\newcommand{\IR}{\ensuremath{\mathbb{R}} }
\newcommand{\IRp}{\ensuremath{\mathbb{R}^*_+} }
\DeclareMathOperator{\ED}{ED}
\DeclareMathOperator{\Log}{Log}
\DeclareMathOperator{\e}{e}
\def\Im#1{\text{Im}(#1)}
\def\Lim{\displaystyle\lim}
% Bernoulli-Hospital
\def\BH{\overset{\text{B-H}}{=}}
% Intégrales.
\def\dx{\ \text{d}x}
\def\dt{\ \text{d}t}

% Redéfinition de la commande vec (grande flèche)
\AtBeginDocument{
\renewcommand{\vec}[1]{\overrightarrow{#1}}
}

% Suppression de l'indentation automatique
\setlength\parindent{0pt}

% Default settings for a new article
\author{B. Gass}
\date{\today}

@isset($standalone)
@else
	\pagestyle{fancy}
	\fancyhf{}
	\renewcommand{\footrule}{ {\color{lightgray}\hrulefill\color{black}} }
	\renewcommand{\headrulewidth}{0pt}
	\renewcommand{\footrulewidth}{0.1pt}
	\fancyfoot[L]{\scriptsize \thedate}
	\fancyfoot[R]{\scriptsize <?= config('app.url') . (isset($slug) ? $slug : ""); ?>}

	\newenvironment{showtitle}{
	\begin{center}\LARGE
	}{
	\end{center}\vspace{-1em}
	{\color{lightgray}\hrulefill\color{black}}\vspace{0.7em}
	}
@endisset
