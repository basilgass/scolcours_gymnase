import{e as o}from"./pimath-7d48ec27.js";import{d as _,r as h,a as x,o as q,aF as w,J as y,L as v,u as b,b1 as S,F}from"./@vue-b854543f.js";import"./@svgdotjs-404fd87d.js";const j={class:"w-full",rows:"20"},G=_({__name:"DevTestRacine",setup(B){let $=h([]),d=h([]);x(()=>`\\begin{aligned} ${$.value.map((i,t)=>`${i}=${d.value[t]}`).join("\\\\")} \\end{aligned}`);let c=h([]),g=`\\documentclass[12pt]{article}
\\usepackage{basil_header_v1.3}
% \\toggletrue{master}
\\title{ Racines et puissances}
\\begin{document}`,R="\\end{document}",p=function(){$.value=[],d.value=[],c.value=[],c.value.push(g);for(let i=0;i<12;i++)c.value.push("\\begin{center} \\Huge Racines et puissances \\end{center}"),c.value.push(M(8)),c.value.push(P(8)),c.value.push(k(8)),c.value.push("\\newpage");c.value.push(R)},M=function(i){let t=[],r=[];for(let m=0;m<i;m++){let s=o.PiMath.Random.number(2,10),e=o.PiMath.Random.prime(12);t.push(`\\sqrt{ ${s**2*e} }`),r.push(`${s} \\sqrt{${e}}`)}return $.value=$.value.concat(...t),d.value=d.value.concat(...r),f(1,t,r,"réduire les racines")},P=function(i){let t=[],r=[],m=[["\\frac{ {e}^{a} \\cdot {e}^{b} }{ {e}^{d} }",(s,e,a,n,l)=>`${s}^{ ${e+a-l} }`],["\\frac{ \\left({e}^{a} \\cdot {e}^{b}\\right)^{c} }{ {e}^{d} }",(s,e,a,n,l)=>`${s}^{ ${(e+a)*n-l} }`]];for(let s=0;s<i;s++){let e=o.PiMath.Random.number(2,10),a=o.PiMath.Random.numberSym(6,!1),n=o.PiMath.Random.numberSym(6,!1),l=o.PiMath.Random.numberSym(6,!1),u=o.PiMath.Random.numberSym(6,!1);switch(o.PiMath.Random.item(m),a===1&&(a=2),n===1&&(n=2),l===1&&(l=2),u===1&&(u=2),o.PiMath.Random.number(1,4)){case 1:t.push(`\\frac{ ${e}^{ ${a} } \\cdot ${e}^{ ${n} } }{ ${e}^{ ${u} } }`),r.push(a+n-u<0?`\\frac{1}{${e}^{ ${-(a+n-u)} }}`:`${e}^{ ${a+n-u} }`);break;case 2:t.push(`\\frac{ \\left(${e}^{ ${a} } \\cdot ${e}^{ ${n} }\\right)^{ ${l} } }{ ${e}^{ ${u} } }`),r.push((a+n)*l-u<0?`\\frac{1}{ ${e}^{ ${-((a+n)*l-u)} } }`:`${e}^{ ${(a+n)*l-u} }`);break;case 3:t.push(`\\left( \\frac{ ${e}^{ ${a} } }{ ${e}^{ ${u} } } \\right)^{ ${n} }`),r.push((a-u)*n<0?`\\frac{1}{ ${e}^{ ${-((a-u)*n)} } }`:`${e}^{ ${(a-u)*n} }`);break;case 4:t.push(`\\left( \\frac{ ${e**2}^{ ${a} } }{ ${e}^{ ${u} } } \\right)^{ ${n} }`),r.push((a*2-u)*n<0?`\\frac{1}{ ${e}^{ ${-((a*2-u)*n)} } }`:`${e}^{ ${(a*2-u)*n} }`);break}}return $.value=$.value.concat(...t),d.value=d.value.concat(...r),f(2,t,r,"réduire pour n'avoir que des puissances positives")},k=function(i){let t=[],r=[];for(let m=0;m<i;m++){let s=o.PiMath.Random.number(2,10),e=o.PiMath.Random.prime(12)*(o.PiMath.Random.bool(.65)?s:1),a=new o.PiMath.Fraction(s,e).reduce();t.push(`\\frac{ ${s} }{\\sqrt{ ${e} }}`),r.push(a.denominator===1?`${a.numerator}\\sqrt{ ${e} }`:`\\frac{ ${a.numerator===1?"":a.numerator}\\sqrt{ ${e} } }{ ${a.denominator} }`)}return $.value=$.value.concat(...t),d.value=d.value.concat(...r),f(1,t,r,"rendre le dénominateur rationnel")},f=function(i,t,r,m){return`\\textbf{exercice ${i}}: ${m}

\\bigskip
\\begin{multicols}{2}
	\\begin{enumerate}[(i),itemsep=1em]
		\\item ${t.map((s,e)=>`\\(${s} = \\trou{ ${r[e]} }\\)`).join(`
		\\item`)}
	\\end{enumerate}
\\end{multicols}

\\vfill
`};return q(()=>{p()}),(i,t)=>(w(),y(F,null,[v("button",{class:"btn bg-white",onClick:t[0]||(t[0]=(...r)=>b(p)&&b(p)(...r))},"Générer"),v("textarea",j,S(b(c).join(`

`)),1)],64))}});export{G as default};
