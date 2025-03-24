Pour réduire une matrice augmentée, on effectue des opérations sur la matrice pour amener la partie de gauche
à une matrice unité (que des zéros, sauf dans la diagonale qui doit ne contenir que des 1). On procède de la manière suivante:

1. on commence par amener le premier pivot \(a_{11}\) à la valeur \(1\)

\[\left(\begin{array}{ccc|c}
1 & \ldots & \ldots & \ldots \\
\ldots & \ldots & \ldots & \ldots \\
\ldots & \ldots & \ldots & \ldots \\
\end{array}\right)\]

2. on annule les coefficients **en dessous** de \(a_{11}\) en utilisant la première ligne

\[\left(\begin{array}{ccc|c}
1 & \ldots & \ldots & \ldots \\
0 & \ldots & \ldots & \ldots \\
0 & \ldots & \ldots & \ldots \\
\end{array}\right)\]

3. à la ligne suivant, on modifie le coefficient \(a_{22}\) à la valeur \(1\)

\[\left(\begin{array}{ccc|c}
1 & \ldots & \ldots & \ldots \\
0 & 1 & \ldots & \ldots \\
0 & \ldots & \ldots & \ldots \\
\end{array}\right)\]

4. on annule les coefficients **en dessus** et **en dessous** de \(a_{22}\) en utilisant la deuxième ligne

\[\left(\begin{array}{ccc|c}
1 & 0 & \ldots & \ldots \\
0 & 1 & \ldots & \ldots \\
0 & 0 & \ldots & \ldots \\
\end{array}\right)\]

5. on répète les points 3. et 4. avec le(s) pivot(s) suivant(s).

\[\left(\begin{array}{ccc|c}
1 & 0 & 0 & \ldots \\
0 & 1 & 0 & \ldots \\
0 & 0 & 1 & \ldots \\
\end{array}\right)\]
