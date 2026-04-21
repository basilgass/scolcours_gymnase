import{A as e,O as t,St as n,T as r,U as i,ht as a,rt as o,x as s}from"./@inertiajs-C0oRnCTy.js";import{t as c}from"./PiDrawParser-B4gCNu18.js";import{t as l}from"./Card-y55CIRLv.js";import{t as u}from"./useToolsStorage-CtS_vwYD.js";import{t as d}from"./ToolForm-BnJXKa6c.js";var f={class:`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3`},p=e({__name:`graphe`,setup(e){let{restoreTool:p}=u(),m=p([{label:`paramètres`,type:`text`,value:a(`axis,grid,x=-10:10,y=-10:10`),fromUrl:`params`},{label:`code`,type:`codearea`,value:a(`O(0,0)
A(5,1)
B(3,8)->drag=grid
d=OA.
e=OB.
T1(6,0)
T2(6,5)
t=T1T2
a=arc A,O,B,2->tex=\\theta
X=inter t,d->w=10`),fromUrl:`code`}]),h=s(()=>m[0].value.value),g=s(()=>m[1].value.value);return(e,a)=>(i(),r(`article`,f,[t(d,{"form-class":`space-y-3`,forms:n(m),rows:15},null,8,[`forms`]),t(l,{class:`col-span-1 lg:col-span-2`},{default:o(()=>[t(c,{width:800,height:800,draw:{code:g.value,parameters:h.value}},null,8,[`draw`])]),_:1})]))}});export{p as default};