@include("latex.common.latex-header")
\begin{document}
@isset($title)
\begin{showtitle}
@yield('title')
\end{showtitle}
@endif

@yield('content')

\end{document}
