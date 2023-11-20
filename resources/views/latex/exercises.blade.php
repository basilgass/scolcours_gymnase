@extends('latex.common.latex-template')

@section('title')
    {{ $title }}
@endsection

@section('content')
    \begin{multicols}{2}
    \mathleft
    \begin{enumerate}
    \def\itemsep{3em}
    @foreach($questions as $question)
        \item \(\displaystyle {{$question->question}}\)
    @endforeach
    \end{enumerate}
    \end{multicols}

    \vfill
    \scriptsize
    \textbf{Réponses}\vspace{-0.5cm}
    \begin{spacing}{2}
    \begin{multicols}{4}
    \begin{enumerate}
    @foreach($questions as $question)
        \item \({{$question->answer}}\)
    @endforeach
    \end{enumerate}
    \end{multicols}
    \end{spacing}
    \vspace{-1cm}
@endsection

