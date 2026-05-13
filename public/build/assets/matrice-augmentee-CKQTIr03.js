import{D as e,E as t,H as n,S as r,b as i,k as a,mt as o,nt as s,p as c,rt as l,w as u,x as d,xt as f}from"./@inertiajs-DcPzCMHT.js";import{t as p}from"./scButton-f6kSGsBM.js";import{l as m,m as h,n as g}from"./pimath-CyHf4SPY.js";import{t as _}from"./Card-DJQyUxGP.js";import{t as v}from"./MarkdownIt-YsHnuqTF.js";import{t as y}from"./useToolsStorage-AxSizdDw.js";import{t as b}from"./ToolForm-Cpca2985.js";import{t as x}from"./ToolError-DdHtRPgH.js";import{t as S}from"./matrice-augmentee-ChSb3CD4.js";var C=`Pour réduire une matrice augmentée, on effectue des opérations sur la matrice pour amener la partie de gauche
à une matrice unité (que des zéros, sauf dans la diagonale qui doit ne contenir que des 1). On procède de la manière suivante:

1. on commence par amener le premier pivot \\(a_{11}\\) à la valeur \\(1\\)

\\[\\left(\\begin{array}{ccc|c}
1 & \\ldots & \\ldots & \\ldots \\\\
\\ldots & \\ldots & \\ldots & \\ldots \\\\
\\ldots & \\ldots & \\ldots & \\ldots \\\\
\\end{array}\\right)\\]

2. on annule les coefficients **en dessous** de \\(a_{11}\\) en utilisant la première ligne

\\[\\left(\\begin{array}{ccc|c}
1 & \\ldots & \\ldots & \\ldots \\\\
0 & \\ldots & \\ldots & \\ldots \\\\
0 & \\ldots & \\ldots & \\ldots \\\\
\\end{array}\\right)\\]

3. à la ligne suivant, on modifie le coefficient \\(a_{22}\\) à la valeur \\(1\\)

\\[\\left(\\begin{array}{ccc|c}
1 & \\ldots & \\ldots & \\ldots \\\\
0 & 1 & \\ldots & \\ldots \\\\
0 & \\ldots & \\ldots & \\ldots \\\\
\\end{array}\\right)\\]

4. on annule les coefficients **en dessus** et **en dessous** de \\(a_{22}\\) en utilisant la deuxième ligne

\\[\\left(\\begin{array}{ccc|c}
1 & 0 & \\ldots & \\ldots \\\\
0 & 1 & \\ldots & \\ldots \\\\
0 & 0 & \\ldots & \\ldots \\\\
\\end{array}\\right)\\]

5. on répète les points 3. et 4. avec le(s) pivot(s) suivant(s).

\\[\\left(\\begin{array}{ccc|c}
1 & 0 & 0 & \\ldots \\\\
0 & 1 & 0 & \\ldots \\\\
0 & 0 & 1 & \\ldots \\\\
\\end{array}\\right)\\]
`,w=a({__name:`matrice-augmentee`,setup(a){let{restoreTool:w}=y(),T=w([{label:`matrice`,type:`textarea`,value:o(`2 1 -1
1 2 1
3 -1 2`),fromUrl:`matrix`,attributes:{rows:5}},{label:`droite`,type:`textarea`,value:o(`1
8
7`),fromUrl:`droite`,attributes:{rows:5}},{label:`nombre de décimales`,type:`number`,value:o(``),attributes:{min:0,max:4},message:`laisser vide pour le mode fraction`}]),E=i(()=>{let e=T[2].value.value;return e===``||e===void 0?0:+e}),D=i(()=>{try{let e=T[0].value.value.split(`
`),t=T[1].value.value.split(`
`);return{code:e.map((e,n)=>t[n]!==void 0&&t[n]!==``?`${e}|${t[n]}`:e).join(`
`),parameters:`${E.value?`,fixed=${E.value}`:``}`}}catch(e){return console.error(e),!1}});function O(){let e=[,,,].fill(0).map(()=>m.numberSym(5)),t=[,,,].fill(0).map(()=>[,,,].fill(0).map(()=>m.numberSym(9)));if(new g().fromVectors(...t.map(e=>new h(...e))).determinant().value===0)return O();t.forEach(t=>{let n=t.reduce((t,n,r)=>t+n*e[r],0);return t.push(n)}),T[0].value.value=t.map(e=>e.slice(0,-1).join(` `)).join(`
`),T[1].value.value=t.map(e=>e.slice(-1)[0]).join(`
`)}let k=o(!1);return(i,a)=>(n(),u(`article`,null,[e(b,{forms:f(T),rows:6,"form-class":`max-w-xl mx-auto grid grid-cols-2 gap-3`,"generate-button":``,onGenerate:O},null,8,[`forms`]),D.value?(n(),r(_,{key:0},{default:s(()=>[e(S,{illustration:D.value},null,8,[`illustration`]),d(`div`,null,[e(p,{active:k.value,icon:k.value?`bi bi-x-lg`:`bi-eye`,xs:``,onClick:a[0]||=e=>k.value=!k.value},{default:s(()=>[...a[1]||=[t(` instructions `,-1)]]),_:1},8,[`active`,`icon`]),l(e(v,{text:f(C)},null,8,[`text`]),[[c,k.value]])])]),_:1})):(n(),r(x,{key:1}))]))}});export{w as default};