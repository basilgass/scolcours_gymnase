% \documentclass[12pt,aspectratio=169,usenames,dvipsnames]{beamer}
\documentclass[12pt]{article}

\usepackage{basil_header_v1.3}
% \includeonlyframes{current}
\toggletrue{master}

\title{ mwe }
\begin{document}
\showtitle

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
\begin{enumerate*}[itemjoin=\hspace{1cm}]
@foreach($questions as $question)
    \item \({{$question->answer}}\)
@endforeach
\end{enumerate*}
\end{spacing}
\end{document}