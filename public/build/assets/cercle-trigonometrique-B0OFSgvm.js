import{D as e,H as t,Z as n,b as r,k as i,mt as a,nt as o,w as s,x as c}from"./@inertiajs-DPgfgE8-.js";import{t as l}from"./PiDrawParser-CyoG3wKC.js";import{t as u}from"./Card-qf2bAOir.js";import{t as d}from"./FormSwitch-Cz-Gc4CD.js";var f={class:`max-w-2xl mx-auto`},p={class:`flex justify-between mb-3`},m=`axis,x=-13:13,y=-18:18,ppu=20`,h=i({__name:`cercle-trigonometrique`,setup(i){let h=a(!0),g=a(!0),_=r(()=>`@begin:static
A(0,0)
c=circ A,10
P0(10,0)
P1(8.67,5)->tex=\\frac{\\pi}{6}/bc/-0.2;-0.5,fill=black,o=4
P2(7.07,7.07)->tex=\\frac{\\pi}{4}/mr/0.5;0.4,fill=black,o=4
P3(5,8.67)->tex=\\frac{\\pi}{3}/tc/0.5;0.5,fill=black,o=4
P4(0,10)->tex=\\frac{\\pi}{2}/tl/-0.5;0.2,fill=black,o=4
P7(-8.67,5)->tex=\\frac{5\\pi}{6}/ml/-0.5;0,fill=black,o=4
P6(-7.07,7.07)->tex=\\frac{3\\pi}{4}/tl/-0.5;0.4,fill=black,o=4
P5(-5,8.67)->tex=\\frac{2\\pi}{3}/tc/-0.5;0.5,fill=black,o=4
P8(-10,0)->tex=\\pi/tl/-0.5;0.3,fill=black,o=4
P9(8.67,-5)->tex=${g.value?`\\frac{11\\pi}{6}`:`-\\frac{\\pi}{6}`}/tl/-0.1;0,fill=black,o=4
P10(7.07,-7.07)->tex=${g.value?`\\frac{7\\pi}{4}`:`-\\frac{\\pi}{4}`}/br/0.5;0,fill=black,o=4
P311(5,-8.67)->tex=${g.value?`\\frac{5\\pi}{3}`:`-\\frac{\\pi}{3}`}/bc/0.5;-0.5,fill=black,o=4
P12(0,-10)->tex=${g.value?`\\frac{3\\pi}{2}`:`-\\frac{\\pi}{2}`}/bl/-0.5;-0.3,fill=black,o=4
P13(-8.67,-5)->tex=${g.value?`\\frac{7\\pi}{6}`:`-\\frac{5\\pi}{6}`}/ml/-0.5;0,fill=black,o=4
P14(-7.07,-7.07)->tex=${g.value?`\\frac{5\\pi}{4}`:`-\\frac{3\\pi}{4}`}/bl/-0.5;0,fill=black,o=4
P15(-5,-8.67)->tex=${g.value?`\\frac{4\\pi}{3}`:`-\\frac{2\\pi}{3}`}/bc/-0.5;-0.5,fill=black,o=4
T1(5,0)->tex=\\scriptsize\\frac{1}{2}/cb/0;-0.5,fill=black,o=4
T2(7.07,0)->tex=\\scriptsize\\frac{\\sqrt{2}}{2}/cb/0;-0.5,fill=black,o=4
T3(8.6,0)->tex=\\scriptsize\\frac{\\sqrt{3}}{2}/cb/0;-0.5,fill=black,o=4
T4(10,0)->tex=\\scriptsize 1/rb/0.4;0,fill=black,o=4
T5(0,5)->tex=\\scriptsize\\frac{1}{2}/rm/0.1;0,fill=black,o=4
T6(0,7.07)->tex=\\scriptsize\\frac{\\sqrt{2}}{2}/lm/-0.1;0,fill=black,o=4
T7(0,8.6)->tex=\\scriptsize\\frac{\\sqrt{3}}{2}/rm/0.1;0,fill=black,o=4
T9(0,10)->tex=\\scriptsize 1/rt/0.1;0,fill=black,o=4
T11(-5,0)->tex=\\scriptsize-\\frac{1}{2}/cb/0;-0.5,fill=black,o=4
T12(-7.07,0)->tex=\\scriptsize-\\frac{\\sqrt{2}}{2}/ct/0;0.5,fill=black,o=4
T13(-8.6,0)->tex=\\scriptsize-\\frac{\\sqrt{3}}{2}/cb/0;-0.5,fill=black,o=4
T14(-10,0)->tex=\\scriptsize -1/lb/-0.4;0,fill=black,o=4
T15(0,-5)->tex=\\scriptsize-\\frac{1}{2}/rm/0.1;0,fill=black,o=4
T16(0,-7.07)->tex=\\scriptsize-\\frac{\\sqrt{2}}{2}/lm/-0.1;0,fill=black,o=4
T17(0,-8.6)->tex=\\scriptsize-\\frac{\\sqrt{3}}{2}/rm/0.1;0,fill=black,o=4
T19(0,-10)->tex=\\scriptsize -1/rb/0.2;0.2,fill=black,o=4
T20(10,10)->hide
X1(10,5.77)->tex=\\scriptsize \\frac{\\sqrt{3}}{3}/mr/0.5;0,fill=black,o=4
X2(10,10)->tex=\\scriptsize 1/mr/0.5;0,fill=black,o=4
X3(10,17.3)->tex=\\scriptsize \\sqrt{3}/mr/0.5;0,fill=black,o=4
X4(10,-5.77)->tex=\\scriptsize -\\frac{\\sqrt{3}}{3}/mr/0.5;0,fill=black,o=4
X5(10,-10)->tex=\\scriptsize -1/mr/0.5;0,fill=black,o=4
X6(10,-17.3)->tex=\\scriptsize -\\sqrt{3}/mr/0.5;0,fill=black,o=4
t=T20P0
@end:static`+(h.value?`
P(7.07,7.07)->drag=c
C=proj P,Ox->hide
S=proj P,Oy->hide
c=PC.->dash
s=PS.->dash
p0=PA->dot
p=PA.->w=3
c1=AC.->green,w=5
s1=AS.->red,w=5
T=inter p,t
t1=P0T.->gold,w=5
a=arc P0,A,P,2->tex=\\theta`:``)),v=n(`svgContainer`);return(n,r)=>(t(),s(`article`,f,[c(`div`,p,[e(d,{modelValue:h.value,"onUpdate:modelValue":r[0]||=e=>h.value=e,label:`afficher l'interactivité`,sm:``},null,8,[`modelValue`]),e(d,{modelValue:g.value,"onUpdate:modelValue":r[1]||=e=>g.value=e,label:`angles positifs,angles entre \\(-\\pi\\) et \\(\\pi\\)`,sm:``},null,8,[`modelValue`])]),e(u,null,{default:o(()=>[e(l,{ref_key:`svgContainer`,ref:v,draw:{code:_.value,parameters:m}},null,8,[`draw`])]),_:1})]))}});export{h as default};