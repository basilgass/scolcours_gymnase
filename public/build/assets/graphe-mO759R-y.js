import{D as e,H as t,b as n,k as r,mt as i,nt as a,w as o,xt as s}from"./@inertiajs-CYi4IIr1.js";import{t as c}from"./PiDrawParser-C6_6tMB4.js";import{t as l}from"./Card-DeiWr68t.js";import{t as u}from"./useToolsStorage-YOEYn230.js";import{t as d}from"./ToolForm-CgYNPDnb.js";var f={class:`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3`},p=r({__name:`graphe`,setup(r){let{restoreTool:p}=u(),m=p([{label:`paramètres`,type:`codearea`,attributes:{language:`pidraw-params`,rows:1},value:i(`axis,grid,x=-10:10,y=-10:10`),fromUrl:`params`},{label:`code`,type:`codearea`,attributes:{language:`pidraw`,rows:10},value:i(`O(0,0)
A(5,1)
B(3,8)->drag=grid
d=OA.
e=OB.
T1(6,0)
T2(6,5)
t=T1T2
a=arc A,O,B,2->tex=\\theta
X=inter t,d->w=10`),fromUrl:`code`}]),h=n(()=>m[0].value.value),g=n(()=>m[1].value.value);return(n,r)=>(t(),o(`article`,f,[e(d,{"form-class":`space-y-3`,forms:s(m),rows:15},null,8,[`forms`]),e(l,{class:`col-span-1 lg:col-span-2`},{default:a(()=>[e(c,{width:800,height:800,draw:{code:g.value,parameters:h.value}},null,8,[`draw`])]),_:1})]))}});export{p as default};