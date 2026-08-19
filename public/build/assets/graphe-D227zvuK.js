import{Ct as e,D as t,U as n,b as r,ht as i,k as a,rt as o,w as s}from"./@inertiajs-DtbEXzlC.js";import{t as c}from"./PiDrawParser-TYgDFJQv.js";import{t as l}from"./Card-B8H42yMk.js";import{t as u}from"./useToolsStorage-BQDQYkRM.js";import{t as d}from"./ToolForm-Cj17CptW.js";var f={class:`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3`},p=a({__name:`graphe`,setup(a){let{restoreTool:p}=u(),m=p([{label:`paramètres`,type:`codearea`,attributes:{language:`pidraw-params`,rows:1},value:i(`axis,grid,x=-10:10,y=-10:10`),fromUrl:`params`},{label:`code`,type:`codearea`,attributes:{language:`pidraw`,rows:10},value:i(`O(0,0)
A(5,1)
B(3,8)->drag=grid
d=OA.
e=OB.
T1(6,0)
T2(6,5)
t=T1T2
a=arc A,O,B,2->tex=\\theta
X=inter t,d->w=10`),fromUrl:`code`}]),h=r(()=>m[0].value.value),g=r(()=>m[1].value.value);return(r,i)=>(n(),s(`article`,f,[t(d,{"form-class":`space-y-3`,forms:e(m),rows:15},null,8,[`forms`]),t(l,{class:`col-span-1 lg:col-span-2`},{default:o(()=>[t(c,{width:800,height:800,draw:{code:g.value,parameters:h.value}},null,8,[`draw`])]),_:1})]))}});export{p as default};